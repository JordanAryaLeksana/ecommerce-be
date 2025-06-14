import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderRequest, OrderResponse } from 'src/model/order.model';
import { WebResponse } from 'src/model/web.model';

@Controller('/api/order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('/createOrder')
  async createOrder(
    @Body() request: CreateOrderRequest
  ): Promise<WebResponse<OrderResponse>> {
    const result = await this.orderService.createOrder(request);
    return { data: result };
  }
}
