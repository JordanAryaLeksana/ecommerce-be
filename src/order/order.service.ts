import { HttpException, Inject, Injectable } from '@nestjs/common';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ValidationService } from 'src/common/validation.service';
import { CreateOrderRequest, OrderResponse } from 'src/model/order.model';
import { Logger } from 'winston';
import { OrderValidation } from './order.validation';
import { PrismaService } from 'src/common/prisma.service';
@Injectable()
export class OrderService {
    constructor(
        private readonly PrismaService: PrismaService,
        private readonly validationService: ValidationService,
        @Inject(WINSTON_MODULE_PROVIDER) private Logger: Logger,
    ) { }

    async createOrder(request: CreateOrderRequest): Promise<OrderResponse> {
        this.Logger.info(`Creating order with request: ${JSON.stringify(request)}`);
        const validationRequest = this.validationService.validate<CreateOrderRequest>(
            OrderValidation.createOrderSchema,
            request
        )

        const checkUserId = await this.PrismaService.user.findUnique({
            where: { id: validationRequest.userId }
        });
        if (!checkUserId) {
            throw new HttpException(
                `User with ID ${validationRequest.userId} not found`,
                404
            );
        }

        const CheckItems = await this.PrismaService.item.findUnique({
            where: {
                id: validationRequest.items[0].itemId
            }
        })

        const CalculatedTotal = validationRequest.items.reduce((sum,item) => {
            return sum + item.price * item.quantity;
        }, 0);
        if (CalculatedTotal !== validationRequest.totalPrice) {
            this.Logger.error(`Total price mismatch for order: expected ${CalculatedTotal}, got ${validationRequest.totalPrice}`);
            throw new HttpException(
                `Total price mismatch for order: expected ${CalculatedTotal}, got ${validationRequest.totalPrice}`,
                400
            );
        }
        if (!CheckItems) {
            throw new HttpException(
                `Item with ID ${validationRequest.items[0].itemId} not found`,
                404
            );
        }

        const order = await this.PrismaService.order.create({
            data: {
                userId: validationRequest.userId,
                orderItems: {
                    create: validationRequest.items.map(item => ({
                        item: {
                            connect: { id: item.itemId }
                        },
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price
                    }))
                },
                total: validationRequest.totalPrice,
                status: validationRequest.status,
            },
            include: {
                orderItems: true
            }
        });


        if (!order) {
            this.Logger.error(`Failed to create order for user ${validationRequest.userId}`);
            throw new HttpException(
                `Failed to create order for user ${validationRequest.userId}`,
                500
            );
        }

        return {
            orderId: order.id,
            userId: order.userId,
            items: order.orderItems.map(item => ({
                itemId: item.itemId,
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),    
            totalPrice: order.total,
            status: order.status,
            orderDate: order.createdAt,
        }
    }
}
