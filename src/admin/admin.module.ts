import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { AdminService } from './admin.service';
import { UserValidation } from 'src/user/user.validation';
import { AdminController } from './admin.controller';

@Module({
    imports:[
        CommonModule,
    ],
    providers:[
        AdminService,
        UserValidation
    ],
    controllers:[
        AdminController
    ],
})
export class AdminModule {}
