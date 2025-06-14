import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ValidationService } from 'src/common/validation.service';
import { CommonModule } from 'src/common/common.module';
import { PrismaService } from 'src/common/prisma.service';
@Module({
  imports: [
    CommonModule
  ],
  controllers: [OrderController],
  providers: [OrderService, ValidationService, PrismaService],
  exports: [OrderService, ValidationService]
})
export class OrderModule {}
