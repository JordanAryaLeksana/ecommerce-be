import { Controller, Post, Body, Get } from '@nestjs/common';
import { BarangService } from './barang.service';
import { WebResponse } from 'src/model/web.model';
import { ItemsRequest, ItemsResponse } from 'src/model/barang.model';
@Controller('/api/items')
export class BarangController {
    constructor(private barangService: BarangService) {}

    @Post('/addItems')
    async addItems(@Body() request: ItemsRequest): Promise<WebResponse<ItemsResponse>> {
        const result = await this.barangService.addItems(request);
        return {
            data: result,
        };
    }

    @Get('/getItems')
    async getItems(id: string): Promise<WebResponse<ItemsResponse>> {
        const result = await this.barangService.getItemsById(id)
        return {
            data: result,
        };
    }
    
   

}
