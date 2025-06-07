import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { LoginRequest, RegisterUserRequest, Tokens, UserResponse } from '../model/user.model';
import { Logger } from 'winston';
import { UserValidation } from './user.validation';
import { ValidationService } from '../common/validation.service';
import * as bcrypt from 'bcryptjs';
import { WebResponse } from 'src/model/web.model';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { UserRole } from 'src/model/user.model';

@Injectable()
export class UserService {
    constructor(
        private validationService: ValidationService,
        private jwtService: JwtService,
        private configService: ConfigService,
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService) { }

    async register(request: RegisterUserRequest): Promise<UserResponse> {
        this.logger.info(`Register New User: ${JSON.stringify(request)}`);
    
        const registerRequest: RegisterUserRequest = this.validationService.validate<RegisterUserRequest>(UserValidation.REGISTER, request)
        console.log(registerRequest)
        const totalUserWithSameUsername = await this.prismaService.user.count({
            where: {
                name: registerRequest.name
            }
        })
        if (totalUserWithSameUsername != 0) {
            throw new HttpException("Username already exists", 400)
        }
        const totalUserWithSameEmail = await this.prismaService.user.count({
            where: {
                email: registerRequest.email
            }
        });
        if (totalUserWithSameEmail !== 0) {
            throw new HttpException("Email already exists", 400);
        }

        const hashedPassword: string = await bcrypt.hash(registerRequest.password, 10)
        registerRequest.password = hashedPassword
        try {
            const user = await this.prismaService.user.create({
                data: registerRequest
            })
            if (user.role !== 'USER') {
                throw new HttpException("Only user can register", 403);
            }

            return {
                // id: user.id,
                name: user.name,
                email: user.email,
            };
        } catch (e) {
            this.logger.error(`Error creating user: ${e}`)
            throw new HttpException('Failed to register user', 500);
        }

    }

    async getTokens(id: string, email: string, name: string): Promise<Tokens> {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    id: id,
                    name: name,
                    email: email,
                    role: UserRole.USER
                },
                {
                    secret: process.env.JWT_ACCESS_TOKEN_SECRET,
                    expiresIn: process.env.JWT_EXPIRES,
                },
            ),
            this.jwtService.signAsync(
                {
                    id: id,
                    name: name,
                    email: email
                },
                {
                    secret: process.env.JWT_SECRET,
                    expiresIn: '3d'
                }
            )
        ])
        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    }

    async updateRefreshToken(id: string, refreshToken: string) {
        const hash = await bcrypt.hash(refreshToken, 10)
        await this.prismaService.user.update({
            where: {
                id: id
            },
            data: {
                RefreshToken: hash,
                AccessToken: null
            }
        })
    }

    async refreshTokens(userId: string, refreshToken: string): Promise<Tokens> {
        const user = await this.prismaService.user.findUnique({
            where: { id: userId }
        });

        if (!user || !user.RefreshToken) {
            throw new HttpException('Access Denied', 403);
        }

        const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.RefreshToken);
        if (!isRefreshTokenValid) {
            throw new HttpException('Invalid Refresh Token', 403);
        }

        const tokens = await this.getTokens(user.id, user.email, user.name);
        if (!tokens.refreshToken) {
            throw new HttpException("Refresh token is missing", 500);
        }
        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    async login(request: LoginRequest): Promise<WebResponse<UserResponse>> {
        this.logger.info(`Login User: ${JSON.stringify(request)}`)
        const LoginRequest: LoginRequest = this.validationService.validate<LoginRequest>(UserValidation.LOGIN, request)
        const user = await this.prismaService.user.findUnique({
            where: {
                email: LoginRequest.email
            }
        })
        if (!user) {
            throw new HttpException("User not found", 400)
        }

        const passwordMatch = await bcrypt.compare(LoginRequest.password, user.password)
        if (!passwordMatch) {
            throw new HttpException("Invalid password", 401)
        }

        const token = await this.getTokens(user.id, user.email, user.name);
        if (!token.refreshToken) {
            throw new HttpException("Refresh token is missing", 500);
        }
        await this.updateRefreshToken(user.id, token.refreshToken)

        await this.prismaService.user.update({
            where: {
                email: LoginRequest.email
            },
            data: {
                AccessToken: token.accessToken
            }
        })
        return {
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: UserRole.USER,
                token: token
            }
        }

    }
    async get(user: User): Promise<UserResponse> {
        await Promise.resolve()
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: UserRole.USER
        }
    }

    async logout(user: User): Promise<WebResponse<UserResponse>> {
        await this.prismaService.user.update({
            where: { id: user.id },
            data: {
                RefreshToken: null,
                AccessToken: null
            }
        });

        return {
            data: {
                // id: user.id,
                name: user.name,
                email: user.email,
                role: UserRole.USER,
                token: {
                    accessToken: null,
                    refreshToken: null
                }
            }
        };
    }

}
