import { Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderRequest, OrderResponse } from 'src/model/order.model';
import { WebResponse } from 'src/model/web.model';
@Controller('order')
export class OrderController {
    constructor(
        private readonly orderService: OrderService,    
    ){}
    @Post('/createOrder')
    async createOrder(request: CreateOrderRequest): Promise<WebResponse<OrderResponse>> {
        const result = await this.orderService.createOrder(request);
        return {
            data: result,
        };
    }

}
