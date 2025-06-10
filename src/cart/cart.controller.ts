import { Controller, UseGuards, Post, Body, Get, Delete, Param } from '@nestjs/common';
import { CartService } from './cart.service';
import { AccessTokenAuth } from 'src/common/Accesstoken.auth.guard';
import { CartItemsRequest, CartItemsResponse } from 'src/model/cart.model';
import { WebResponse } from 'src/model/web.model';
import { Roles } from 'src/common/Roles.decorator';
import { RolesGuards } from 'src/common/Roles.guard';
import { UserRole } from 'src/model/user.model';


@Controller('/api/cart')
export class CartController {
    constructor(
        private readonly cartService: CartService,

    ) { }
    @UseGuards(AccessTokenAuth, RolesGuards)
    @Post('/addToCart')
    @Roles(UserRole.USER, UserRole.ADMIN)
    async addToCart(@Body() request: CartItemsRequest): Promise<WebResponse<CartItemsResponse>> {
        const result = await this.cartService.addToCart(request);
        return {
            data: result,
        };
    }

    @UseGuards(AccessTokenAuth, RolesGuards)
    @Get('/getCart/:userId')
    @Roles(UserRole.USER, UserRole.ADMIN)
    async getCart(@Param('userId') userId: string): Promise<WebResponse<CartItemsResponse>> {
        const result = await this.cartService.getCartByUserId(userId);
        return {
            data: result,
        };
    }

    @UseGuards(AccessTokenAuth, RolesGuards)
    @Delete('/clearCart/:userId')
    @Roles(UserRole.USER, UserRole.ADMIN)
    async deleteCart(@Param('userId') userId: string): Promise<WebResponse<CartItemsResponse>> {
        const result = await this.cartService.clearCart(userId);
        return {
            data: result,
        };
    }

    @UseGuards(AccessTokenAuth, RolesGuards)
    @Get('/decreaseQuantity/:cartId/:productId')
    @Roles(UserRole.USER, UserRole.ADMIN)
    async decreaseQuantity(
        @Param('cartId') cartId: string,
        @Param('productId') productId: string
    ): Promise<WebResponse<CartItemsResponse>> {
        const result = await this.cartService.quantityDecrement(cartId, productId);
        return {
            data: result,
        };
    }
    @UseGuards(AccessTokenAuth, RolesGuards)
    @Get('/increaseQuantity/:cartId/:productId')
    @Roles(UserRole.USER, UserRole.ADMIN)
    async increaseQuantity(
        @Param('cartId') cartId: string,
        @Param('productId') productId: string
    ): Promise<WebResponse<CartItemsResponse>> {
        const result = await this.cartService.quantityIncrement(cartId, productId);
        return {
            data: result,
        };
    }
}
