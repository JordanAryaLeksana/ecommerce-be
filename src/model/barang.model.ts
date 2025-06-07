import { Category } from "@prisma/client";

export interface Items {
    type: Category;
    name: string;
    price: number;
    rating: number;
    image: string;
    isHot: boolean;
    isNew: boolean;
    isFeatured: boolean;
    isOnSale: boolean;
    stock: number;
    description: string; 
    createdAt: Date;
    updatedAt: Date;
}

export interface ItemsRequest {
    type: string;
    name: string;
    price: number;
    stock: number;
    isHot?: boolean;
    isNew?: boolean;
    isFeatured?: boolean;
    rating?: number;
    description: string;
    image: string;
}

export interface ItemsResponse {
    item: Items[];
}