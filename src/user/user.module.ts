import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AccessToken } from '../common/access.token';
import { RefreshToken } from '../common/refresh.token';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from '../common/common.module';



@Module({
  imports: [
    CommonModule,
    ConfigModule, 
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME || '1h' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, AccessToken, RefreshToken]
})
export class UserModule {}
