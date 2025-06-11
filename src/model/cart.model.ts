import { Category } from '@prisma/client';

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
