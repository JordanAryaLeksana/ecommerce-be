import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { ConfigModule } from '@nestjs/config';
import { BarangModule } from 'src/item/barang.module';
import { CartModule } from 'src/cart/cart.module';


// import { ValidationService } from 'src/common/validation.service';
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
