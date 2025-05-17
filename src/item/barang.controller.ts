import { Controller, Post, Body, Get, Delete, Put, Param, UseGuards } from '@nestjs/common';
import { BarangService } from './barang.service';
import { WebResponse } from 'src/model/web.model';
import { ItemsRequest, ItemsResponse } from 'src/model/barang.model';
import { AccessTokenAuth } from 'src/common/Accesstoken.auth.guard';


@Controller('/api/items')
export class BarangController {
    constructor(private barangService: BarangService) {}

    @UseGuards(AccessTokenAuth)
    @Post('/addItems')
    async addItems(@Body()request: ItemsRequest ): Promise<WebResponse<ItemsResponse>> {
        const result = await this.barangService.addItems(request);
        console.log("barang",result)
        return {
            data: result,
        };
    }
    
    @UseGuards(AccessTokenAuth)
    @Get('/getItems/:id')
    async getItemsById(@Param('id') id: string): Promise<WebResponse<ItemsResponse>> {
        const result = await this.barangService.getItemsById(id)
        return {
            data: result,
        };
    }    

    @UseGuards(AccessTokenAuth)
    @Get('/getItemsByType/:type')
    async getItemsByType(@Param('type') type: string): Promise<WebResponse<ItemsResponse[]>> {
        const result = await this.barangService.getItemsByCategory(type)
        return {
            data: Array.isArray(result) ? result : [result],
        };
    }    
    
    @UseGuards(AccessTokenAuth)
    @Get('/getAllItems')
    async getAllItems(): Promise<WebResponse<ItemsResponse[]>> {
        const result = await this.barangService.getAllItems()
        return {
            data: Array.isArray(result) ? result : [result],
        };
    }
    @UseGuards(AccessTokenAuth)
    @Delete('/deleteItems')
    async deleteItems(id: string): Promise<WebResponse<ItemsResponse>> {
        const result = await this.barangService.DeleteItems(id)
        return {
            data: result,
        };
    }
    
    @UseGuards(AccessTokenAuth)
    @Put('/updateItems/:id')
    async updateItems(@Param('id') id: string, @Body() request: ItemsRequest): Promise<WebResponse<ItemsResponse>> {
        const result = await this.barangService.updateItems(id, request);
        return {
            data: result,
        };
    }    
}
