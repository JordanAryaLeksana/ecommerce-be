import { PrismaService } from '../common/prisma.service';
import { LoginRequest, RegisterUserRequest, Tokens, UserResponse } from '../model/user.model';
import { Logger } from 'winston';
import { ValidationService } from '../common/validation.service';
import { WebResponse } from 'src/model/web.model';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
export declare class UserService {
    private validationService;
    private jwtService;
    private configService;
    private logger;
    private prismaService;
    constructor(validationService: ValidationService, jwtService: JwtService, configService: ConfigService, logger: Logger, prismaService: PrismaService);
    register(request: RegisterUserRequest): Promise<UserResponse>;
    getTokens(id: string, email: string, name: string): Promise<Tokens>;
    updateRefreshToken(id: string, refreshToken: string): Promise<void>;
    refreshTokens(userId: string, refreshToken: string): Promise<Tokens>;
    login(request: LoginRequest): Promise<WebResponse<UserResponse>>;
    get(user: User): Promise<UserResponse>;
    logout(user: User): Promise<WebResponse<UserResponse>>;
}
