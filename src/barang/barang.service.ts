import { Injectable, Inject } from '@nestjs/common';
import { ItemsRequest, ItemsResponse } from 'src/model/barang.model';
import { Category, PrismaClient } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import { ItemsValidation } from './barang.validation';
import { ValidationService } from 'src/common/validation.service';
@Injectable()
export class BarangService {
  constructor(
    private prismaService: PrismaService & PrismaClient,
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) { }

  async addItems(request: ItemsRequest): Promise<ItemsResponse> {
    this.logger.info(`Add Items: ${JSON.stringify(request)}`);
    const validated: ItemsRequest = this.validationService.validate<ItemsRequest>(
      ItemsValidation.CREATE,
      request
    );

    const item = await this.prismaService.item.create({
      data: {
        name: validated.name,
        image: validated.image,
        description: validated.description,
        price: validated.price || 0,
        stock: validated.stock || 0,
        type: validated.type,
      }
    })


    if (validated.type === Category.books) {
      await this.prismaService.books.create({
        data: {
          writer: validated.writer!,
          year: new Date().getFullYear(),
          barang: {
            connect: { id: item.id },
          },
        }
      });


    } else if (validated.type === Category.projects) {
      await this.prismaService.projects.create({
        data: {
          barang: {
            connect: { id: item.id },
          },
        },
      });
    } else if (validated.type === Category.tools) {
      await this.prismaService.tools.create({
        data: {
          barang: {
            connect: { id: item.id },
          },
        },
      });
    }


    const result = await this.prismaService.item.findUnique({
      where: {
        id: item.id,
      },
      include: {
        book: true,
        final_project: true,
        tool: true,
      }
    })

    if (!result) {
      throw new Error(`Barang with id ${item.id} not found, 404`);
    }

    return {
      data: [{
        ...result,
        books: result.book,
        finalproject: result.final_project,
        tools: result.tool,
      }],
    };
  }
  async getItemsById(id: string): Promise<ItemsResponse>{
    const result = await this.prismaService.item.findUnique({
      where:{
        id: id,
      },
      include:{
        book: true,
        final_project: true,
        tool: true,
      }
    })
    if (!result) {
      throw new Error(`Barang not found, 404`);
    }
    return {
      data: [{
        ...result,
        books: result.book,
        finalproject: result.final_project,
        tools: result.tool,
      }],
    };
   
  }
}
