import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ItemsRequest, ItemsResponse } from 'src/model/barang.model';
import { Category } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import { ItemsValidation } from './barang.validation';
import { ValidationService } from 'src/common/validation.service';



export function parseCategory(category: string): Category {
  if (!Object.values(Category).includes(category as Category)) {
    throw new BadRequestException(`Invalid category type: ${category}`);
  }
  return category as Category;
}

@Injectable()
export class BarangService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) { }


  async addItems(request: ItemsRequest): Promise<ItemsResponse> {

    this.logger.info(`Add Items: ${JSON.stringify(request)}`);
    if (!(request.type in Category)) {
      throw new BadRequestException(`Invalid category type: ${request.type}`);
    }
    const validated: ItemsRequest = this.validationService.validate<ItemsRequest>(
      ItemsValidation.CREATE,
      request
    );

    const addingItem = await this.prismaService.item.create({
      data: {
        name: validated.name,
        image: validated.image,
        description: validated.description,
        rating: validated.rating || 0,
        isHot: validated.isHot || false,
        isNew: validated.isNew || false,
        isFeatured: validated.isFeatured || false,
        price: validated.price || 0,
        stock: validated.stock || 0,
        type: parseCategory(validated.type),
      },
    })
    if (validated.stock === 0 || validated.stock === undefined) {
      throw new UnprocessableEntityException(`Stock must be greater than 0`);
    }

    if (!addingItem) {
      throw new InternalServerErrorException(`Failed to add item`);
    }
    return {
      item: [{
        ...addingItem
      }],
    }

  }

  async getItemsById(id: string): Promise<ItemsResponse> {
    const result = await this.prismaService.item.findUnique({
      where: {
        id: id,
      },
    })

    if (result?.stock === 0) {
      throw new NotFoundException(`Barang with id ${id} not available`);
    }

    if (!result) {
      throw new ConflictException(`Barang with id ${id} not found`);
    }

    return {
      item: [{
        ...result,
      }],
    };
  }

  async getItemsByTypeandName(type: string, name: string): Promise<ItemsResponse> {
    const result = await this.prismaService.item.findMany({
      where: {
        type: type as Category,
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });
    if (!result || result.length === 0) {
      throw new NotFoundException(`Barang with type ${type} and name ${name} not found`);
    }
    return {
      item: result.map((item) => {
        return {
          ...item
        };
      }),
    }
  };
  async DeleteItems(id: string): Promise<ItemsResponse> {
    this.logger.info(`Delete Items: ${id}`);

    const findItems = await this.prismaService.item.findUnique({
      where: {
        id: id,
      },
    })
    if (!findItems) {
      throw new NotFoundException(`Barang with id ${id} not found`);
    }
    const result = await this.prismaService.item.delete({
      where: {
        id: id,
      },
    })


    if (!result) {
      throw new ConflictException(`Barang with id ${id} not found`);
    }


    return {
      item: [{
        ...result
      }],
    };
  }

  async getAllItems(): Promise<ItemsResponse> {
    const result = await this.prismaService.item.findMany();
    return {
      item: result.map((item) => {
        return {
          ...item
        };
      }),
    };

  }

  async updateItems(id: string, request: ItemsRequest): Promise<ItemsResponse> {
    const validated: ItemsRequest = this.validationService.validate<ItemsRequest>(
      ItemsValidation.UPDATE,
      request
    );

    const item = await this.prismaService.item.update({
      where: { id: id },
      data: {
        name: validated.name,
        image: validated.image,
        rating: validated.rating || 0,
        isHot: validated.isHot || false,
        isNew: validated.isNew || false,
        isFeatured: validated.isFeatured || false,
        description: validated.description,
        price: validated.price || 0,
        stock: validated.stock || 0,
        type: parseCategory(validated.type)
      },
    });

    const updatedItem = await this.prismaService.item.findUnique({
      where: { id: item.id },
    });

    if (!updatedItem) {
      throw new NotFoundException(`Barang with id ${item.id} not found`);
    }
    if (updatedItem.stock === 0) {
      throw new NotFoundException(`Barang with id ${id} not available`);
    }

    return {
      item: [{
        ...updatedItem,
      }],
    };
  }

  async getItemsByCategory(category: string): Promise<ItemsResponse> {
    const result = await this.prismaService.item.findMany({
      where: {
        type: category as Category,
      },
    });

    if (!result) {
      throw new NotFoundException(`Barang with category ${category} not found`);
    }

    return {
      item: result.map((item) => {

        return {
          ...item
        };
      }),
    };
  }

  async cart(id: string): Promise<ItemsResponse> {
    const result = await this.prismaService.item.findUnique({
      where: {
        id: id,
      },
    });

    if (!result) {
      throw new NotFoundException(`Barang with id ${id} not found`);
    }

    if (result.stock === 0) {
      throw new NotFoundException(`Barang with id ${id} not available`);
    }

    return {
      item: [{
        ...result,
      }],
    };
  }
}


