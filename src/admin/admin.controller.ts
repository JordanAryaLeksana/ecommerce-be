import { Body, Controller, Get, Post, Delete, Param,Put } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AccessTokenAuth } from '../common/Accesstoken.auth.guard';
import { RolesGuards } from '../common/Roles.guard';
import { Roles } from '../common/Roles.decorator';
import { UseGuards } from '@nestjs/common';
import { WebResponse } from '../model/web.model';
import { UserResponse, RegisterUserRequest, UserRole } from '../model/user.model';
import { BarangService } from '../item/barang.service';
import { CartService } from '../cart/cart.service';
import { ItemsRequest, ItemsResponse } from '../model/barang.model';
@Controller('api/admin')
export class AdminController {
    constructor(
        private readonly adminService: AdminService,
        private readonly itemsService: BarangService,
        private readonly cartService: CartService
    ) { }
    
    @Roles(UserRole.ADMIN)
    @Post('/register-admin')
    async registerAdmin(@Body() request: RegisterUserRequest): Promise<UserResponse> {
        const result = await this.adminService.adminRegister(request);
        return {
            ...result,
        };
    }

    @UseGuards(AccessTokenAuth, RolesGuards)
    @Roles(UserRole.ADMIN)
    @Post('/login-admin')
    async loginAdmin(@Body() request: RegisterUserRequest): Promise<WebResponse<UserResponse>> {
        const result = await this.adminService.adminLogin(request);
        return {
            ...result,
        };
    }

    @UseGuards(AccessTokenAuth, RolesGuards)
    @Roles(UserRole.ADMIN)
    @Get('/dashboard')
    async getDashboard(): Promise<WebResponse<any>> {
        const totalItems = await this.itemsService.getAllItems();
        const totalUsers = await this.adminService.getAllUsers()
        return {
            data: {
                totalItems,
                totalUsers,
            }
        };
    }

    @Post('/dashboard/addItems')
    @UseGuards(AccessTokenAuth, RolesGuards)
    @Roles(UserRole.ADMIN)
    async addItems(@Body() request: ItemsRequest): Promise<WebResponse<ItemsResponse>> {
        const result = await this.itemsService.addItems(request);

        return {
            data: result,
        };
    }
    @UseGuards(AccessTokenAuth)
    @Roles(UserRole.ADMIN)
    @Delete('/dahsboard/deleteItems')
    async deleteItems(id: string): Promise<WebResponse<ItemsResponse>> {
        const result = await this.itemsService.DeleteItems(id)
        return {
            data: result,
        };
    }
    @UseGuards(AccessTokenAuth, RolesGuards)
    @Roles(UserRole.ADMIN)
    @Put('/updateItems/:id')
    async updateItems(@Param('id') id: string, @Body() request: ItemsRequest): Promise<WebResponse<ItemsResponse>> {
        const result = await this.itemsService.updateItems(id, request);
        return {
            data: result,
        };
    }

}
