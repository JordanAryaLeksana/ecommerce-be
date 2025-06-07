import { Controller, UseGuards, Post, Body, Get } from '@nestjs/common';
import { CartService } from './cart.service';
import { AccessTokenAuth } from 'src/common/Accesstoken.auth.guard';
import { CartItemsRequest, CartItemsResponse } from 'src/model/cart.model';
import { WebResponse } from 'src/model/web.model';


@Controller('/api/cart')
export class CartController {
    constructor(
        private readonly cartService: CartService,

    ) { }

    @UseGuards(AccessTokenAuth)
    @Post('/addToCart')
    async addToCart(@Body() request: CartItemsRequest): Promise<WebResponse<CartItemsResponse>> {
        const result = await this.cartService.addToCart(request);
        return {
            data: result,
        };
    }


    @Get('/getCart/:userId')
    async getCart(@Body('userId') userId: string): Promise<WebResponse<CartItemsResponse>> {
        const result = await this.cartService.getCartByUserId(userId);
        return {
            data: result,
        };
    }
}
