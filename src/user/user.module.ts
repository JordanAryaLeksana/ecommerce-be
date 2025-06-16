import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

import { ConfigModule } from '@nestjs/config';
import { CommonModule } from '../common/common.module';
import { AdminModule } from '../admin/admin.module';
import { AdminService } from '../admin/admin.service';



@Module({
  imports: [
    CommonModule,
    ConfigModule, 
    AdminModule
  ],
  controllers: [UserController],
  providers: [UserService, AdminService]
})
export class UserModule {}
