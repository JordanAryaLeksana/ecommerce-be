import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { ConfigModule } from '@nestjs/config';
import { BarangModule } from '../item/barang.module';
import { CartModule } from '../cart/cart.module';


// import { ValidationService } from '../common/validation.service';
@Module({
    imports: [
        CommonModule,
        ConfigModule, 
        BarangModule,
        CartModule
      ],
    providers:[
        AdminService,
    ],
    controllers:[
        AdminController
    ],
})
export class AdminModule {}
