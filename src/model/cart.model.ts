import { Category } from '@prisma/client';
import { OrderStatus } from '@prisma/client';

export interface CartItemDto {
  itemId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  totalPrice: number;
  stock?: number;
  type?: Category;
  isOnSale?: boolean;
}
export interface CartItemsRequest {
  userId: string;
  itemId: string;
  quantity: number;
}


export interface CartItemsResponse {
  cartId: string;
  items: CartItemDto[];
  totalPrice: number;
}


export interface checkoutCartRequest {
  
  userId: string;
  items: {
    itemId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: keyof typeof OrderStatus;
}

export interface checkoutCartResponse {
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