import { Category } from "@prisma/client";

export interface Items {
    type: Category;
    name: string;
    price: number;
    stock: number;
    description: string;
    books: Books[];
    finalproject: finalproject[];
    image: string;
    tools: Tools[];    
    createdAt: Date;
    updatedAt: Date;
}

export interface ItemsRequest {
    type: string;
    writer?: string;
    year?: number;
    name: string;
    price: number;
    stock: number;
    description: string;
    image: string;
}
export interface Books {
    id        : string;
    writer    : string;
    year      : number;
    barang?   : Items;
}

export interface finalproject {
    id        : string;
    barang?    : Items;
}

export interface Tools {
    id        : string;
    barang?    : Items;
}

export interface ItemsResponse {
    data: Items[];
}