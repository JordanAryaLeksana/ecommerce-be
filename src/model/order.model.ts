import { Status } from '@prisma/client';

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
    status: Status;
}




export interface CreateOrderRequest {
    userId: string;
    items: {
        itemId: string;
        name: string;
        quantity: number;
        price: number;
    }[];
    total: number;
    status: keyof typeof Status;
}
