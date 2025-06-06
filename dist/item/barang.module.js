"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarangModule = void 0;
const common_1 = require("@nestjs/common");
const barang_controller_1 = require("./barang.controller");
const barang_service_1 = require("./barang.service");
const barang_validation_1 = require("./barang.validation");
const common_module_1 = require("../common/common.module");
let BarangModule = class BarangModule {
};
exports.BarangModule = BarangModule;
exports.BarangModule = BarangModule = __decorate([
    (0, common_1.Module)({
        imports: [
            common_module_1.CommonModule,
        ],
        controllers: [barang_controller_1.BarangController],
        providers: [barang_service_1.BarangService, barang_validation_1.ItemsValidation],
        exports: [barang_service_1.BarangService, barang_validation_1.ItemsValidation]
    })
], BarangModule);
//# sourceMappingURL=barang.module.js.map