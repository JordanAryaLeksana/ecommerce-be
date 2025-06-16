import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ValidationService } from '../common/validation.service';
import { CommonModule } from '../common/common.module';
import { PrismaService } from '../common/prisma.service';
@Module({
  imports: [
    CommonModule
  ],
  controllers: [OrderController],
  providers: [OrderService, ValidationService, PrismaService],
  exports: [OrderService, ValidationService]
})
export class OrderModule {}
