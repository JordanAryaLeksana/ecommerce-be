import { Module } from '@nestjs/common';
import { AlatController } from './alat.controller';
import { AlatService } from './alat.service';

@Module({
  controllers: [AlatController],
  providers: [AlatService],
})
export class AlatModule {}
