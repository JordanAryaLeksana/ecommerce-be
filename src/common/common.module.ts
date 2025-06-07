import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import {ConfigModule} from '@nestjs/config';
import * as winston from 'winston';
import { PrismaService } from './prisma.service';
import { ValidationService } from './validation.service';
import { ErrorFilter } from './error.filter';
import { AuthMiddleware } from './auth.middleware';
import { JwtModule } from '@nestjs/jwt';
import { AccessToken } from './access.token';
import { RefreshToken } from './refresh.token';
@Global()
@Module({
    imports: [
        WinstonModule.forRoot({
           format: winston.format.json(),
              transports: [
                new winston.transports.Console()
              ]    
        }),     
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        JwtModule.register({
              secret: process.env.JWT_SECRET,
              signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME || '1h' },
            }),
    ],
    providers: [PrismaService, ValidationService, 
        {
            provide: 'APP_FILTER',
            useClass: ErrorFilter
        },
        AccessToken,
        RefreshToken
    ],
     exports: [PrismaService, AccessToken, RefreshToken, ValidationService, JwtModule],
})
export class CommonModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
       consumer.apply(AuthMiddleware).forRoutes('/api/*')
    }
}
