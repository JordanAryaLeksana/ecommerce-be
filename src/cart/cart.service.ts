import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ValidationService } from '../common/validation.service';
import { CartValidation } from './cart.validation';
import { PrismaService } from '../common/prisma.service';
import { CartItemDto, CartItemsRequest, CartItemsResponse, checkoutCartRequest, checkoutCartResponse } from '../model/cart.model';
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
            items,
            totalPrice: items.reduce((total, item) => total + item.totalPrice, 0),
            cartId: cart.id,
        };
    }

    async removeItemFromCart(itemId: string, cartId: string): Promise<CartItemsResponse> {
        this.logger.info(`Remove Item from Cart: itemId=${cartId}`);
        const cart = await this.prismaService.cart.findFirst({
            where: {
                cartItems: {
                    some: {
                        id: cartId,
                    },
                },
            },
            include: {
                cartItems: {
                    include: {
                        item: true,
                    },
                },
            },
        })

        if (!cart) {
            this.logger.error(`Cart not found for userId: ${itemId}`);
            throw new HttpException(`Cart not found for itemId: ${itemId}`, 404);
        }

        const cartItem = cart.cartItems.find(item => item.item.id === itemId);
        if (!cartItem) {
            this.logger.error(`Item not found in cart for itemId=${itemId}, itemId=${itemId}`);
            throw new HttpException(`Item not found in cart for itemId=${itemId}, itemId=${itemId}`, 404);
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
            this.logger.error(`Cart not found after update for itemId=${itemId}`);
            throw new HttpException(`Cart not found after update for itemId=${itemId}`, 404);
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
            items: [],
            totalPrice: 0,
            cartId: cart.id,
        };
    }


    async UpdateCartItemQuantity(cartId: string, itemId: string, quantity: number): Promise<CartItemsResponse> {
        this.logger.info(`Update Cart Item Quantity: cartId=${cartId}, itemId=${itemId}, quantity=${quantity}`);

        const cart = await this.prismaService.cart.findUnique({
            where: { id: cartId },
            include: {
                cartItems: {
                    include: {
                        item: true,
                    },
                },
            },
        });

        if (!cart) {
            this.logger.error(`Cart not found for cartId: ${cartId}`);
            throw new HttpException(`Cart not found for cartId: ${cartId}`, 404);
        }

        const cartItem = cart.cartItems.find(item => item.item.id === itemId);
        if (!cartItem) {
            this.logger.error(`Item not found in cart for itemId=${itemId}`);
            throw new HttpException(`Item not found in cart for itemId=${itemId}`, 404);
        }

        if (cartItem.item.stock < quantity) {
            this.logger.error(`Insufficient stock for item: ${itemId}`);
            throw new HttpException(`Insufficient stock for item: ${itemId}`, 400);
        }

        await this.prismaService.cartItem.update({
            where: { id: cartItem.id },
            data: { quantity },
        });

        await this.prismaService.item.update({
            where: { id: itemId },
            data: { stock: cartItem.item.stock - quantity },
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
            this.logger.error(`Cart not found after update for cartId=${cartId}`);
            throw new HttpException(`Cart not found after update for cartId=${cartId}`, 404);
        }

        const UpdateItems = updatedCart.cartItems.map(cartItem => ({
            itemId: cartItem.item.id,
            name: cartItem.item.name,
            price: cartItem.item.price,
            image: cartItem.item.image,
            quantity: cartItem.quantity,
            totalPrice: cartItem.quantity * cartItem.item.price,
            stock: cartItem.item.stock,
            type: cartItem.item.type,
            isOnSale: cartItem.item.isOnSale,
        }))

        const totalPrice = UpdateItems.reduce((total, item) => total + item.totalPrice, 0)
        return {
            items: UpdateItems,
            totalPrice: totalPrice,
            cartId: updatedCart.id,
        }
    }


    async checkoutCart(request: checkoutCartRequest): Promise<checkoutCartResponse> {
        this.logger.info(`Checkout Cart: ${JSON.stringify(request)}`);
        const validated: checkoutCartRequest = this.validationService.validate<checkoutCartRequest>(
            CartValidation.checkoutCartSchema,
            request
        );

        const cart = await this.prismaService.cart.findUnique({
            where: { userId: validated.userId },
            include: {
                cartItems: {
                    include: {
                        item: true,
                    },
                },
            },
        });

        if (!cart) {
            this.logger.error(`Cart not found for userId: ${validated.userId}`);
            throw new HttpException(`Cart not found for userId: ${validated.userId}`, 404);
        }
        if (cart.cartItems.length === 0) {
            this.logger.error(`Cart is empty for userId: ${validated.userId}`);
            throw new HttpException(`Cart is empty for userId: ${validated.userId}`, 400);
        }

        const items = cart.cartItems.map(cartItem => ({
            itemId: cartItem.item.id,
            name: cartItem.item.name,
            quantity: cartItem.quantity,
            price: cartItem.item.price,
        }));
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        if (total !== validated.total) {
            this.logger.error(`Total price mismatch for checkout: expected ${total}, got ${validated.total}`);
            throw new HttpException(`Total price mismatch for checkout: expected ${total}, got ${validated.total}`, 400);
        }
        const order = await this.prismaService.order.create({
            data: {
                userId: validated.userId,
                total: validated.total,
                status: validated.status,
                orderItems: {
                    create: items.map(item => ({
                        itemId: item.itemId,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
            include: {
                orderItems: true,
            },
        });
        this.logger.info(`Order created: ${JSON.stringify(order)}`);
        await this.prismaService.cartItem.deleteMany({
            where: {
                cartId: cart.id,
            },
        });
        await this.prismaService.cart.update({
            where: { id: cart.id },
            data: {
                cartItems: {
                    deleteMany: {},
                },
            },
        });
        return {
            userId: order.userId,
            orderId: order.id,
            items: order.orderItems.map(item => ({
                itemId: item.itemId,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                image: '', 
                totalPrice: item.price * item.quantity,
            })),
            status: order.status,
            orderDate: order.createdAt,
            totalPrice: order.total,
        };
        
    }
}