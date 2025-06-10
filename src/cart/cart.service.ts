import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ValidationService } from 'src/common/validation.service';
import { CartValidation } from './cart.validation';
import { PrismaService } from 'src/common/prisma.service';
import { CartItemDto, CartItemsRequest, CartItemsResponse } from 'src/model/cart.model';
import { Logger } from 'winston';
import { Category } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class CartService {
    constructor(
        private readonly prismaService: PrismaService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly validationService: ValidationService
    ) { }

    async addToCart(request: CartItemsRequest,): Promise<CartItemsResponse> {
        this.logger.info(`Add to Cart: ${JSON.stringify(request)}`);
        const validated: CartItemsRequest = this.validationService.validate<CartItemsRequest>(
            CartValidation.addToCartSchema,
            request
        )


        const findItems = await this.prismaService.item.findUnique({
            where: {
                id: validated.itemId,
            }
        })

        if (!findItems) {
            this.logger.error(`Item not found: ${validated.itemId}`);
            throw new HttpException(`Item not found: ${validated.itemId}`, 404);
        }

        if (findItems.stock < validated.quantity) {
            this.logger.error(`Insufficient stock for item: ${validated.itemId}`);
            throw new HttpException(`Insufficient stock for item: ${validated.itemId}`, 400);
        }
        let cart = await this.prismaService.cart.findUnique({
            where: {
                userId: validated.userId,
            },
        });

        if (!cart) {
            cart = await this.prismaService.cart.create({
                data: {
                    userId: validated.userId,
                    cartItems: {
                        create: {
                            itemId: validated.itemId,
                            quantity: validated.quantity,
                        },
                    },
                },
            });
        }

        const existingCartItem = await this.prismaService.cartItem.findUnique({
            where: {
                cartId_itemId: {
                    cartId: cart.id,
                    itemId: validated.itemId,
                }
            }
        }) as CartItemDto | null;

        if (existingCartItem) {
            await this.prismaService.cartItem.update({
                where: {
                    cartId_itemId: {
                        cartId: cart.id,
                        itemId: validated.itemId,
                    }
                },
                data: {
                    quantity: existingCartItem.quantity + validated.quantity,
                },
            });
        } else {
            await this.prismaService.cartItem.create({
                data: {
                    cartId: cart.id,
                    itemId: validated.itemId,
                    quantity: validated.quantity,
                },
            });
        }


        await this.prismaService.item.update({
            where: { id: validated.itemId },
            data: {
                stock: findItems.stock - validated.quantity,
            },
        });


        const updatedCart = await this.prismaService.cart.findUnique({
            where: { id: cart.id },
            include: {
                cartItems: {
                    include: {
                        item: true,
                    },
                },
            },
        }) as {
            id: string;
            cartItems: Array<{
                id: string;
                quantity: number;
                item: {
                    id: string;
                    name: string;
                    price: number;
                    image: string;
                    stock: number;
                    type: Category;
                    isOnSale: boolean;
                };
            }>;
        } | null;

        if (!updatedCart) {
            this.logger.error(`Cart not found after update: ${cart.id}`);
            throw new HttpException(`Cart not found after update: ${cart.id}`, 404);
        }

        const items: CartItemDto[] = updatedCart.cartItems.map(cartItem => ({
            itemId: cartItem.item.id,
            name: cartItem.item.name,
            price: cartItem.item.price,
            image: cartItem.item.image,
            quantity: cartItem.quantity,
            totalPrice: cartItem.quantity * cartItem.item.price,
            stock: cartItem.item.stock,
            type: cartItem.item.type,
            isOnSale: cartItem.item.isOnSale,
            userId: validated.userId,
        }));

        return {
            userId: validated.userId,
            items,
            totalPrice: items.reduce((total, item) => total + item.totalPrice, 0),
            cartId: updatedCart.id,
        };
    }

    async getCartByUserId(userId: string): Promise<CartItemsResponse> {
        this.logger.info(`Get Cart by UserId: ${userId}`);
        const cart = await this.prismaService.cart.findUnique({
            where: { userId },
            include: {
                cartItems: {
                    include: {
                        item: true,
                    },
                },
            },
        }) as {
            id: string;
            cartItems: Array<{
                id: string;
                quantity: number;
                item: {
                    id: string;
                    name: string;
                    price: number;
                    image: string;
                    stock: number;
                    type: Category;
                    isOnSale: boolean;
                };
            }>;
        } | null;

        if (!cart) {
            this.logger.error(`Cart not found for userId: ${userId}`);
            throw new HttpException(`Cart not found for userId: ${userId}`, 404);
        }

        const items: CartItemDto[] = cart.cartItems.map(cartItem => ({
            itemId: cartItem.item.id,
            name: cartItem.item.name,
            price: cartItem.item.price,
            image: cartItem.item.image,
            quantity: cartItem.quantity,
            totalPrice: cartItem.quantity * cartItem.item.price,
            stock: cartItem.item.stock,
            type: cartItem.item.type,
            isOnSale: cartItem.item.isOnSale,
        }));

        return {
            userId,
            items,
            totalPrice: items.reduce((total, item) => total + item.totalPrice, 0),
            cartId: cart.id,
        };
    }

    async removeItemFromCart(userId: string, itemId: string): Promise<CartItemsResponse> {
        this.logger.info(`Remove Item from Cart: userId=${userId}, itemId=${itemId}`);
        const cart = await this.prismaService.cart.findUnique({
            where: { userId },
            include: {
                cartItems: {
                    include: {
                        item: true,
                    },
                },
            },
        }) as {
            id: string;
            cartItems: Array<{
                id: string;
                quantity: number;
                item: {
                    id: string;
                    name: string;
                    price: number;
                    image: string;
                    stock: number;
                    type: Category;
                    isOnSale: boolean;
                };
            }>;
        } | null;

        if (!cart) {
            this.logger.error(`Cart not found for userId: ${userId}`);
            throw new HttpException(`Cart not found for userId: ${userId}`, 404);
        }

        const cartItem = cart.cartItems.find(item => item.item.id === itemId);
        if (!cartItem) {
            this.logger.error(`Item not found in cart for userId=${userId}, itemId=${itemId}`);
            throw new HttpException(`Item not found in cart for userId=${userId}, itemId=${itemId}`, 404);
        }

        await this.prismaService.cartItem.delete({
            where: { id: cartItem.id },
        });

        await this.prismaService.item.update({
            where: { id: itemId },
            data: {
                stock: cartItem.item.stock + cartItem.quantity,
            },
        });

        const updatedCart = await this.prismaService.cart.findUnique({
            where: { id: cart.id },
            include: {
                cartItems: {
                    include: {
                        item: true,
                    },
                },
            },
        }) as {
            id: string;
            cartItems: Array<{
                id: string;
                quantity: number;
                item: {
                    id: string;
                    name: string;
                    price: number;
                    image: string;
                    stock: number;
                    type: Category;
                    isOnSale: boolean;
                };
            }>;
        } | null;

        if (!updatedCart) {
            this.logger.error(`Cart not found after update for userId=${userId}`);
            throw new HttpException(`Cart not found after update for userId=${userId}`, 404);
        }

        const items = updatedCart.cartItems.map(cartItem => ({
            itemId: cartItem.item.id,
            name: cartItem.item.name,
            price: cartItem.item.price,
            image: cartItem.item.image,
            quantity: cartItem.quantity,

            totalPrice: cartItem.quantity * cartItem.item.price,
            stock: cartItem.item.stock,
            type: cartItem.item.type,
            isOnSale: cartItem.item.isOnSale,
        }));
        return {
            userId,
            items,
            totalPrice: items.reduce((total, item) => total + item.totalPrice, 0),
            cartId: updatedCart.id,
        };
    }

    async clearCart(userId: string): Promise<CartItemsResponse> {
        this.logger.info(`Clear Cart for UserId: ${userId}`);

        const cart = await this.prismaService.cart.findFirst({
            where: { userId },
            include: {
                cartItems: {
                    include: {
                        item: true,
                    },
                },
            },
        });

        if (!cart) {
            this.logger.error(`Cart not found for userId: ${userId}`);
            throw new HttpException(`Cart not found for userId: ${userId}`, 404);
        }
        for (const cartItem of cart.cartItems) {
            await this.prismaService.item.update({
                where: { id: cartItem.item.id },
                data: {
                    stock: {
                        increment: cartItem.quantity,
                    },
                },
            });
        }
        await this.prismaService.cartItem.deleteMany({
            where: {
                cartId: cart.id,
            },
        });
        return {
            userId: cart.userId,
            items: [],
            totalPrice: 0,
            cartId: cart.id,
        };
    }

    async quantityIncrement(userId: string, itemId: string): Promise<CartItemsResponse> {
        this.logger.info(`Increment quantity for Item: userId=${userId}, itemId=${itemId}`);
        const cart = await this.prismaService.cart.findUnique({
            where: { userId },
        })

        if (!cart) {
            this.logger.error(`Cart not found for userId: ${userId}`);
            throw new HttpException(`Cart not found for userId: ${userId}`, 404);
        }
        const cartItem = await this.prismaService.cartItem.findUnique({
            where: {
                cartId_itemId: {
                    cartId: cart.id,
                    itemId: itemId,
                },
            },
            include: {
                item: true,
            },
        });

        if (!cartItem) {
            this.logger.error(`Cart item not found for userId=${userId}, itemId=${itemId}`);
            throw new HttpException(`Cart item not found for userId=${userId}, itemId=${itemId}`, 404);
        }

        if (cartItem.item.stock <= cartItem.quantity) {
            this.logger.error(`Insufficient stock for item: ${itemId}`);
            throw new HttpException(`Insufficient stock for item: ${itemId}`, 400);
        }

        const updatedCartItem = await this.prismaService.cartItem.update({
            where: {
                id: cartItem.id,
            },
            data: {
                quantity: cartItem.quantity + 1,
            },
            include: {
                item: true,
            },
        });

        await this.prismaService.item.update({
            where: { id: itemId },
            data: {
                stock: updatedCartItem.item.stock - 1,
            },
        });
        
        const updatedCart = await this.prismaService.cart.findUnique({
            where: { id: cart.id },
            include: {
                cartItems: {
                    include: {
                        item: true,
                    },
                },
            },
        }) as {
            id: string;
            cartItems: Array<{
                id: string;
                quantity: number;
                item: {
                    id: string;
                    name: string;
                    price: number;
                    image: string;
                    stock: number;
                    type: Category;
                    isOnSale: boolean;
                };
            }>;
        } | null;
        if (!updatedCart) {
            this.logger.error(`Cart not found after update for userId=${userId}`);
            throw new HttpException(`Cart not found after update for userId=${userId}`, 404);
        }
        const items: CartItemDto[] = updatedCart.cartItems.map(cartItem => ({
            itemId: cartItem.item.id,
            name: cartItem.item.name,
            price: cartItem.item.price,
            image: cartItem.item.image,
            quantity: cartItem.quantity,
            totalPrice: cartItem.quantity * cartItem.item.price,
            stock: cartItem.item.stock,
            type: cartItem.item.type,
            isOnSale: cartItem.item.isOnSale,
        }));
        return {
            userId,
            items,
            totalPrice: items.reduce((total, item) => total + item.totalPrice, 0),
            cartId: updatedCart.id,
        };
    }
    async quantityDecrement(userId: string, itemId: string): Promise<CartItemsResponse> {
        this.logger.info(`Increment quantity for Item: userId=${userId}, itemId=${itemId}`);
        const cart = await this.prismaService.cart.findUnique({
            where: { userId },
        })

        if (!cart) {
            this.logger.error(`Cart not found for userId: ${userId}`);
            throw new HttpException(`Cart not found for userId: ${userId}`, 404);
        }
        const cartItem = await this.prismaService.cartItem.findUnique({
            where: {
                cartId_itemId: {
                    cartId: cart.id,
                    itemId: itemId,
                },
            },
            include: {
                item: true,
            },
        });

        if (!cartItem) {
            this.logger.error(`Cart item not found for userId=${userId}, itemId=${itemId}`);
            throw new HttpException(`Cart item not found for userId=${userId}, itemId=${itemId}`, 404);
        }

     

        const updatedCartItem = await this.prismaService.cartItem.update({
            where: {
                id: cartItem.id,
            },
            data: {
                quantity: cartItem.quantity - 1,
            },
            include: {
                item: true,
            },
        });

        await this.prismaService.item.update({
            where: { id: itemId },
            data: {
                stock: updatedCartItem.item.stock + 1,
            },
        });
        
        const updatedCart = await this.prismaService.cart.findUnique({
            where: { id: cart.id },
            include: {
                cartItems: {
                    include: {
                        item: true,
                    },
                },
            },
        }) as {
            id: string;
            cartItems: Array<{
                id: string;
                quantity: number;
                item: {
                    id: string;
                    name: string;
                    price: number;
                    image: string;
                    stock: number;
                    type: Category;
                    isOnSale: boolean;
                };
            }>;
        } | null;
        if (!updatedCart) {
            this.logger.error(`Cart not found after update for userId=${userId}`);
            throw new HttpException(`Cart not found after update for userId=${userId}`, 404);
        }
        const items: CartItemDto[] = updatedCart.cartItems.map(cartItem => ({
            itemId: cartItem.item.id,
            name: cartItem.item.name,
            price: cartItem.item.price,
            image: cartItem.item.image,
            quantity: cartItem.quantity,
            totalPrice: cartItem.quantity * cartItem.item.price,
            stock: cartItem.item.stock,
            type: cartItem.item.type,
            isOnSale: cartItem.item.isOnSale,
        }));
        return {
            userId,
            items,
            totalPrice: items.reduce((total, item) => total + item.totalPrice, 0),
            cartId: updatedCart.id,
        }
    }
}