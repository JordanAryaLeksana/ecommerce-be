import { Module } from '@nestjs/common';

import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CommonModule } from 'src/common/common.module';
import { CartValidation } from './cart.validation';

@Module({
  imports: [
    CommonModule,
  ],
  controllers: [CartController],
  providers: [CartService, CartValidation]
})
export class CartModule {}
