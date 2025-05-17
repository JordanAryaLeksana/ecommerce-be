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
    try {
      const validated: ItemsRequest = this.validationService.validate<ItemsRequest>(
        ItemsValidation.CREATE,
        request
      );
      const parsedCategory = parseCategory(validated.type);
      if (parsedCategory === Category.books && !request.writer) {
        throw new UnprocessableEntityException('Writer is required for book items');
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
        case Category.books:
          await this.prismaService.books.create({
            data: {
              writer: validated.writer!,
              year: new Date().getFullYear(),
              barang: { connect: { id: item.id } },
            },
          });
          break;

        case Category.projects:
          await this.prismaService.projects.create({
            data: {
              barang: { connect: { id: item.id } },
            },
          });
          break;

        case Category.tools:
          await this.prismaService.tools.create({
            data: {
              barang: { connect: { id: item.id } },
            },
          });
          break;

        default:
          throw new BadRequestException(`Unsupported category type`);
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
        throw new NotFoundException(`Barang with id ${item.id} not found`);
      }
      const { book, final_project, tool, ...rest } = result
      return {
        data: [{
          ...rest,
          books: book,
          finalproject: final_project,
          tools: tool,
        }],
      };

    } catch (err: unknown) {
      this.logger.error('Failed to add item', {
        error: err instanceof Error ? err.message : String(err)
      });

      if (err instanceof BadRequestException ||
        err instanceof ConflictException ||
        err instanceof NotFoundException ||
        err instanceof UnprocessableEntityException) {
        throw err;
      }
      if (err instanceof Error) {
        this.logger.error(err.message);
        throw new InternalServerErrorException(err.message);
      }
      throw new InternalServerErrorException('Unexpected error occurred while adding item');
    }
  }
  async getItemsById(id: string): Promise<ItemsResponse> {
    const result = await this.prismaService.item.findUnique({
      where: {
        id: id,
      },
      include: {
        book: true,
        final_project: true,
        tool: true,
      }
    })


    if (result?.stock === 0) {
      throw new NotFoundException(`Barang with id ${id} not available`);
    }

    if (!result) {
      throw new ConflictException(`Barang with id ${id} not found`);
    }
    console.log(result)
    const { book, final_project, tool, ...rest } = result
    return {
      data: [{
        ...rest,
        books: book,
        finalproject: final_project,
        tools: tool,
      }],
    };
  }

  async DeleteItems(id: string): Promise<ItemsResponse> {
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
    })
    if (!findItems) {
      throw new NotFoundException(`Barang with id ${id} not found`);
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
    })


    if (!result) {
      throw new ConflictException(`Barang with id ${id} not found`);
    }

    const { book, final_project, tool, ...rest } = result
    return {
      data: [{
        ...rest,
        books: book,
        finalproject: final_project,
        tools: tool,
      }],
    };
  }

  async getAllItems(): Promise<ItemsResponse> {
    const result = await this.prismaService.item.findMany({
      include: {
        book: true,
        final_project: true,
        tool: true,
      },
    });

    return {
      data: result.map((item) => ({
        ...item,
        books: item.book,
        finalproject: item.final_project,
        tools: item.tool,
      })),
    };
  }

  async updateItems(id: string, request: ItemsRequest): Promise<ItemsResponse> {
    const validated: ItemsRequest = this.validationService.validate<ItemsRequest>(
      ItemsValidation.UPDATE,
      request
    );

    if (validated.type === Category.books && !validated.writer) {
      throw new UnprocessableEntityException('Writer is required for book items');
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
      case Category.books:
        await this.prismaService.books.update({
          where: { id: item.id },
          data: {
            writer: validated.writer!,
            year: new Date().getFullYear(),
          },
        });
        break;

      case Category.projects:
        await this.prismaService.projects.update({
          where: { id: item.id },
          data: {},
        });
        break;

      case Category.tools:
        await this.prismaService.tools.update({
          where: { id: item.id },
          data: {},
        });
        break;

      default:
        throw new BadRequestException(`Unsupported category type`);
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
      throw new NotFoundException(`Barang with id ${item.id} not found`);
    }
    if (updatedItem.stock === 0) {
      throw new NotFoundException(`Barang with id ${id} not available`);
    }
    const { book, final_project, tool, ...rest } = updatedItem
    return {
      data: [{
        ...rest,
        books: book,
        finalproject: final_project,
        tools: tool,
      }],
    };
  }

  async getItemsByCategory(category: string): Promise<ItemsResponse> {
    const result = await this.prismaService.item.findMany({
      where: {
        type: category as Category,
      },
      include: {
        book: true,
        final_project: true,
        tool: true,
      },
    });

    if (!result) {
      throw new NotFoundException(`Barang with category ${category} not found`);
    }
    
    return {
      data: result.map((item) => ({
        ...item,
        books: item.book,
        finalproject: item.final_project,
        tools: item.tool,
      })),
    };
  }
}
