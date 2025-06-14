import { Controller, UseGuards, Post, Body, Get, Delete, Param, Put } from '@nestjs/common';
import { CartService } from './cart.service';
import { AccessTokenAuth } from 'src/common/Accesstoken.auth.guard';
import { CartItemsRequest, CartItemsResponse, checkoutCartRequest, checkoutCartResponse } from 'src/model/cart.model';
import { WebResponse } from 'src/model/web.model';
import { Roles } from 'src/common/Roles.decorator';
import { RolesGuards } from 'src/common/Roles.guard';
import { UserRole } from 'src/model/user.model';
// import { CartItem } from '@prisma/client';


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
    @Roles(UserRole.USER, UserRole.ADMIN)
    @Put('/updateCart/:cardId')
    async updateCart(@Param('cardId') cardId: string, @Body() request: CartItemsRequest, items: string): Promise<WebResponse<CartItemsResponse>> {
        const result = await this.cartService.UpdateCartItemQuantity(cardId, items, request.quantity);
        return {
            data: result,
        };
    }

    @UseGuards(AccessTokenAuth, RolesGuards)
    @Post('/checkoutCart')
    @Roles(UserRole.USER, UserRole.ADMIN)
    async checkoutCart(@Body() request: checkoutCartRequest): Promise<WebResponse<checkoutCartResponse>> {
        const result = await this.cartService.checkoutCart(request);
        return {
            data: result,
        };
    }

}
