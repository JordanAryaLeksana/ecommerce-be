import { Controller, Post, Body, Get, Delete, Put, Param } from '@nestjs/common';
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

    @Get('/getItems/:id')
    async getItemsById(@Param('id') id: string): Promise<WebResponse<ItemsResponse>> {
        const result = await this.barangService.getItemsById(id)
        return {
            data: result,
        };
    }    

    
    @Get('/getAllItems')
    async getAllItems(): Promise<WebResponse<ItemsResponse[]>> {
        const result = await this.barangService.getAllItems()
        return {
            data: Array.isArray(result) ? result : [result],
        };
    }
    @Delete('/deleteItems')
    async deleteItems(id: string): Promise<WebResponse<ItemsResponse>> {
        const result = await this.barangService.DeleteItems(id)
        return {
            data: result,
        };
    }

    @Put('/updateItems/:id')
    async updateItems(@Param('id') id: string, @Body() request: ItemsRequest): Promise<WebResponse<ItemsResponse>> {
        const result = await this.barangService.updateItems(id, request);
        return {
            data: result,
        };
    }    
}

