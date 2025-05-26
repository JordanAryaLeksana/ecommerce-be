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
exports.BarangService = void 0;
exports.parseCategory = parseCategory;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const nest_winston_1 = require("nest-winston");
const winston_1 = require("winston");
const prisma_service_1 = require("../common/prisma.service");
const barang_validation_1 = require("./barang.validation");
const validation_service_1 = require("../common/validation.service");
function parseCategory(category) {
    if (!Object.values(client_1.Category).includes(category)) {
        throw new common_1.BadRequestException(`Invalid category type: ${category}`);
    }
    return category;
}
let BarangService = class BarangService {
    prismaService;
    validationService;
    logger;
    constructor(prismaService, validationService, logger) {
        this.prismaService = prismaService;
        this.validationService = validationService;
        this.logger = logger;
    }
    async addItems(request) {
        this.logger.info(`Add Items: ${JSON.stringify(request)}`);
        if (!(request.type in client_1.Category)) {
            throw new common_1.BadRequestException(`Invalid category type: ${request.type}`);
        }
        try {
            const validated = this.validationService.validate(barang_validation_1.ItemsValidation.CREATE, request);
            const parsedCategory = parseCategory(validated.type);
            if (parsedCategory === client_1.Category.books && !request.writer) {
                throw new common_1.UnprocessableEntityException('Writer is required for book items');
            }
            const item = await this.prismaService.item.create({
                data: {
                    name: validated.name,
                    image: validated.image,
                    description: validated.description,
                    price: validated.price || 0,
                    stock: validated.stock || 0,
                    type: parseCategory(validated.type),
                },
            });
            switch (validated.type) {
                case client_1.Category.books:
                    await this.prismaService.books.create({
                        data: {
                            writer: validated.writer,
                            year: new Date().getFullYear(),
                            barang: { connect: { id: item.id } },
                        },
                    });
                    break;
                case client_1.Category.projects:
                    await this.prismaService.projects.create({
                        data: {
                            barang: { connect: { id: item.id } },
                        },
                    });
                    break;
                case client_1.Category.tools:
                    await this.prismaService.tools.create({
                        data: {
                            barang: { connect: { id: item.id } },
                        },
                    });
                    break;
                default:
                    throw new common_1.BadRequestException(`Unsupported category type`);
            }
            const result = await this.prismaService.item.findUnique({
                where: { id: item.id },
                include: {
                    book: true,
                    final_project: true,
                    tool: true,
                },
            });
            if (!result) {
                throw new common_1.NotFoundException(`Barang with id ${item.id} not found`);
            }
            const { book, final_project, tool, ...rest } = result;
            return {
                item: [{
                        ...rest,
                        books: book,
                        finalproject: final_project,
                        tools: tool,
                    }]
            };
        }
        catch (err) {
            this.logger.error('Failed to add item', {
                error: err instanceof Error ? err.message : String(err)
            });
            if (err instanceof common_1.BadRequestException ||
                err instanceof common_1.ConflictException ||
                err instanceof common_1.NotFoundException ||
                err instanceof common_1.UnprocessableEntityException) {
                throw err;
            }
            if (err instanceof Error) {
                this.logger.error(err.message);
                throw new common_1.InternalServerErrorException(err.message);
            }
            throw new common_1.InternalServerErrorException('Unexpected error occurred while adding item');
        }
    }
    async getItemsById(id) {
        const result = await this.prismaService.item.findUnique({
            where: {
                id: id,
            },
            include: {
                book: true,
                final_project: true,
                tool: true,
            }
        });
        if (result?.stock === 0) {
            throw new common_1.NotFoundException(`Barang with id ${id} not available`);
        }
        if (!result) {
            throw new common_1.ConflictException(`Barang with id ${id} not found`);
        }
        console.log(result);
        const { book, final_project, tool, ...rest } = result;
        return {
            item: [{
                    ...rest,
                    books: book,
                    finalproject: final_project,
                    tools: tool,
                }],
        };
    }
    async getItemsByTypeandName(type, name) {
        const result = await this.prismaService.item.findMany({
            where: {
                type: type,
                name: {
                    contains: name,
                    mode: 'insensitive',
                },
            },
            include: {
                book: true,
                final_project: true,
                tool: true,
            }
        });
        if (!result || result.length === 0) {
            throw new common_1.NotFoundException(`Barang with type ${type} and name ${name} not found`);
        }
        return {
            item: result.map((item) => {
                const { book, final_project, tool, ...rest } = item;
                return {
                    ...rest,
                    books: book,
                    finalproject: final_project,
                    tools: tool,
                };
            }),
        };
    }
    ;
    async DeleteItems(id) {
        this.logger.info(`Delete Items: ${id}`);
        const findItems = await this.prismaService.item.findUnique({
            where: {
                id: id,
            },
            include: {
                book: true,
                final_project: true,
                tool: true,
            }
        });
        if (!findItems) {
            throw new common_1.NotFoundException(`Barang with id ${id} not found`);
        }
        const result = await this.prismaService.item.delete({
            where: {
                id: id,
            },
            include: {
                book: true,
                final_project: true,
                tool: true,
            }
        });
        if (!result) {
            throw new common_1.ConflictException(`Barang with id ${id} not found`);
        }
        const { book, final_project, tool, ...rest } = result;
        return {
            item: [{
                    ...rest,
                    books: book,
                    finalproject: final_project,
                    tools: tool,
                }],
        };
    }
    async getAllItems() {
        const result = await this.prismaService.item.findMany({
            include: {
                book: true,
                final_project: true,
                tool: true,
            },
        });
        return {
            item: result.map((item) => {
                const { book, final_project, tool, ...rest } = item;
                return {
                    ...rest,
                    books: book,
                    finalproject: final_project,
                    tools: tool,
                };
            }),
        };
    }
    async updateItems(id, request) {
        const validated = this.validationService.validate(barang_validation_1.ItemsValidation.UPDATE, request);
        if (validated.type === client_1.Category.books && !validated.writer) {
            throw new common_1.UnprocessableEntityException('Writer is required for book items');
        }
        const item = await this.prismaService.item.update({
            where: { id: id },
            data: {
                name: validated.name,
                image: validated.image,
                description: validated.description,
                price: validated.price || 0,
                stock: validated.stock || 0,
                type: parseCategory(validated.type)
            },
        });
        switch (validated.type) {
            case client_1.Category.books:
                await this.prismaService.books.update({
                    where: { id: item.id },
                    data: {
                        writer: validated.writer,
                        year: new Date().getFullYear(),
                    },
                });
                break;
            case client_1.Category.projects:
                await this.prismaService.projects.update({
                    where: { id: item.id },
                    data: {},
                });
                break;
            case client_1.Category.tools:
                await this.prismaService.tools.update({
                    where: { id: item.id },
                    data: {},
                });
                break;
            default:
                throw new common_1.BadRequestException(`Unsupported category type`);
        }
        const updatedItem = await this.prismaService.item.findUnique({
            where: { id: item.id },
            include: {
                book: true,
                final_project: true,
                tool: true,
            },
        });
        if (!updatedItem) {
            throw new common_1.NotFoundException(`Barang with id ${item.id} not found`);
        }
        if (updatedItem.stock === 0) {
            throw new common_1.NotFoundException(`Barang with id ${id} not available`);
        }
        const { book, final_project, tool, ...rest } = updatedItem;
        return {
            item: [{
                    ...rest,
                    books: book,
                    finalproject: final_project,
                    tools: tool,
                }],
        };
    }
    async getItemsByCategory(category) {
        const result = await this.prismaService.item.findMany({
            where: {
                type: category,
            },
            include: {
                book: true,
                final_project: true,
                tool: true,
            },
        });
        if (!result) {
            throw new common_1.NotFoundException(`Barang with category ${category} not found`);
        }
        return {
            item: result.map((item) => {
                const { book, final_project, tool, ...rest } = item;
                return {
                    ...rest,
                    books: book,
                    finalproject: final_project,
                    tools: tool,
                };
            }),
        };
    }
};
exports.BarangService = BarangService;
exports.BarangService = BarangService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        validation_service_1.ValidationService,
        winston_1.Logger])
], BarangService);
//# sourceMappingURL=barang.service.js.map