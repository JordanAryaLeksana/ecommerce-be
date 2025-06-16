import { Controller,  Get,  Param, UseGuards } from '@nestjs/common';
import { BarangService } from './barang.service';
import { WebResponse } from '../model/web.model';
import {  ItemsResponse } from '../model/barang.model';
import { AccessTokenAuth } from '../common/Accesstoken.auth.guard';
import { RolesGuards } from '../common/Roles.guard';
import { Roles } from '../common/Roles.decorator';
import { UserRole } from '../model/user.model';
import { Category } from '@prisma/client';


@Controller('/api/items')
export class BarangController {
    constructor(private barangService: BarangService) {}


    @UseGuards(AccessTokenAuth, RolesGuards)
    @Roles(UserRole.USER, UserRole.ADMIN)
    @Get('/getItems/:id')
    async getItemsById(@Param('id') id: string): Promise<WebResponse<ItemsResponse>> {
        const result = await this.barangService.getItemsById(id)
        return {
            data: result,
        };
    }    

    @UseGuards(AccessTokenAuth, RolesGuards)
    @Roles(UserRole.USER, UserRole.ADMIN)
    @Get('/getItemsbyTypeandName/:type/:name')
    async getItemsByTypeAndId(@Param('type') type: string, @Param('name') name: string): Promise<WebResponse<ItemsResponse>> {
        const result = await this.barangService.getItemsByTypeandName(type, name)
        return {
            data: result,
        };
    }

    @UseGuards(AccessTokenAuth, RolesGuards)
    @Roles(UserRole.USER, UserRole.ADMIN)
    @Get('/getItemsByType/:type')
    async getItemsByType(@Param('type') type: Category): Promise<WebResponse<ItemsResponse[]>> {
        const result = await this.barangService.getItemsByCategory(type);
        return {
            data: Array.isArray(result) ? result : [result],
        };
    }    


    @UseGuards(AccessTokenAuth, RolesGuards)
    @Roles(UserRole.USER, UserRole.ADMIN)
    @Get('/getAllItems')
    async getAllItems(): Promise<WebResponse<ItemsResponse[]>> {
        const result = await this.barangService.getAllItems()
        console.log("result", result)
        return {
            data: Array.isArray(result) ? result : [result],
        };
    }    
}