import { ItemsRequest, ItemsResponse } from 'src/model/barang.model';
import { Category } from '@prisma/client';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
export declare function parseCategory(category: string): Category;
export declare class BarangService {
    private prismaService;
    private validationService;
    private logger;
    constructor(prismaService: PrismaService, validationService: ValidationService, logger: Logger);
    addItems(request: ItemsRequest): Promise<ItemsResponse>;
    getItemsById(id: string): Promise<ItemsResponse>;
    getItemsByTypeandName(type: string, name: string): Promise<ItemsResponse>;
    DeleteItems(id: string): Promise<ItemsResponse>;
    getAllItems(): Promise<ItemsResponse>;
    updateItems(id: string, request: ItemsRequest): Promise<ItemsResponse>;
    getItemsByCategory(category: string): Promise<ItemsResponse>;
}
