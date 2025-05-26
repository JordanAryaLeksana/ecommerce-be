import { BarangService } from './barang.service';
import { WebResponse } from 'src/model/web.model';
import { ItemsRequest, ItemsResponse } from 'src/model/barang.model';
export declare class BarangController {
    private barangService;
    constructor(barangService: BarangService);
    addItems(request: ItemsRequest): Promise<WebResponse<ItemsResponse>>;
    getItemsById(id: string): Promise<WebResponse<ItemsResponse>>;
    getItemsByTypeAndId(type: string, name: string): Promise<WebResponse<ItemsResponse>>;
    getItemsByType(type: string): Promise<WebResponse<ItemsResponse[]>>;
    getAllItems(): Promise<WebResponse<ItemsResponse[]>>;
    deleteItems(id: string): Promise<WebResponse<ItemsResponse>>;
    updateItems(id: string, request: ItemsRequest): Promise<WebResponse<ItemsResponse>>;
}
