import { Module } from '@nestjs/common';
import { BarangController } from './barang.controller';
import { BarangService } from './barang.service';
import { ItemsValidation } from './barang.validation';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    CommonModule,
    
  ],
  controllers: [BarangController],
  providers: [BarangService, ItemsValidation],
  exports: [BarangService, ItemsValidation]
})
export class BarangModule {}
