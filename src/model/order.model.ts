import { OrderStatus } from '@prisma/client';

export interface OrderResponse {
    orderId: string;
    userId: string;
    items: {
        itemId: string;
        name: string;
        quantity: number;
        price: number;
    }[];
    totalPrice: number;
    orderDate: Date;
    status: keyof typeof OrderStatus;
}




export interface CreateOrderRequest {
    userId: string;
    items: {
        itemId: string;
        name: string;
        quantity: number;
        price: number;
    }[];
    totalPrice: number;
    status: keyof typeof OrderStatus;
}
