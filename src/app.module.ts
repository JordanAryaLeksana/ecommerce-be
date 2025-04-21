import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { AccessTokenAuth } from './common/Accesstoken.auth.guard';


@Module({
  imports: [CommonModule, UserModule],
  controllers: [],
  providers: [{
    provide: 'APP_GUARD',
    useClass: AccessTokenAuth,
  }],
})
export class AppModule {}
