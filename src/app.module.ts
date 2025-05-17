import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { AccessTokenAuth } from './common/Accesstoken.auth.guard';
import { BarangModule } from './item/barang.module';


@Module({
  imports: [CommonModule, UserModule, BarangModule],
  controllers: [],
  providers: [{
    provide: 'APP_GUARD',
    useClass: AccessTokenAuth,
  }],
})
export class AppModule {}
