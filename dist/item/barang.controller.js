"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarangController = void 0;
const common_1 = require("@nestjs/common");
const barang_service_1 = require("./barang.service");
const Accesstoken_auth_guard_1 = require("../common/Accesstoken.auth.guard");
let BarangController = class BarangController {
    barangService;
    constructor(barangService) {
        this.barangService = barangService;
    }
    async addItems(request) {
        const result = await this.barangService.addItems(request);
        return {
            data: result,
        };
    }
    async getItemsById(id) {
        const result = await this.barangService.getItemsById(id);
        return {
            data: result,
        };
    }
    async getItemsByTypeAndId(type, name) {
        const result = await this.barangService.getItemsByTypeandName(type, name);
        return {
            data: result,
        };
    }
    async getItemsByType(type) {
        const result = await this.barangService.getItemsByCategory(type);
        return {
            data: Array.isArray(result) ? result : [result],
        };
    }
    async getAllItems() {
        const result = await this.barangService.getAllItems();
        return {
            data: Array.isArray(result) ? result : [result],
        };
    }
    async deleteItems(id) {
        const result = await this.barangService.DeleteItems(id);
        return {
            data: result,
        };
    }
    async updateItems(id, request) {
        const result = await this.barangService.updateItems(id, request);
        return {
            data: result,
        };
    }
};
exports.BarangController = BarangController;
__decorate([
    (0, common_1.UseGuards)(Accesstoken_auth_guard_1.AccessTokenAuth),
    (0, common_1.Post)('/addItems'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BarangController.prototype, "addItems", null);
__decorate([
    (0, common_1.Get)('/getItems/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BarangController.prototype, "getItemsById", null);
__decorate([
    (0, common_1.UseGuards)(Accesstoken_auth_guard_1.AccessTokenAuth),
    (0, common_1.Get)('/getItemsbyTypeandName/:type/:name'),
    __param(0, (0, common_1.Param)('type')),
    __param(1, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BarangController.prototype, "getItemsByTypeAndId", null);
__decorate([
    (0, common_1.UseGuards)(Accesstoken_auth_guard_1.AccessTokenAuth),
    (0, common_1.Get)('/getItemsByType/:type'),
    __param(0, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BarangController.prototype, "getItemsByType", null);
__decorate([
    (0, common_1.UseGuards)(Accesstoken_auth_guard_1.AccessTokenAuth),
    (0, common_1.Get)('/getAllItems'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BarangController.prototype, "getAllItems", null);
__decorate([
    (0, common_1.UseGuards)(Accesstoken_auth_guard_1.AccessTokenAuth),
    (0, common_1.Delete)('/deleteItems'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BarangController.prototype, "deleteItems", null);
__decorate([
    (0, common_1.UseGuards)(Accesstoken_auth_guard_1.AccessTokenAuth),
    (0, common_1.Put)('/updateItems/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BarangController.prototype, "updateItems", null);
exports.BarangController = BarangController = __decorate([
    (0, common_1.Controller)('/api/items'),
    __metadata("design:paramtypes", [barang_service_1.BarangService])
], BarangController);
//# sourceMappingURL=barang.controller.js.map