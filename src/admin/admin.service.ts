import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { Logger } from 'winston';
import * as bcrypt from 'bcrypt';
import { LoginRequest, RegisterUserRequest, Tokens, UserResponse, UserRole } from 'src/model/user.model';
import { ValidationService } from 'src/common/validation.service';
import { UserValidation } from 'src/user/user.validation';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { WebResponse } from 'src/model/web.model';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
@Injectable()
export class AdminService {
    constructor(
        private readonly validationService: ValidationService,
        private readonly jwtService: JwtService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly prismaService: PrismaService,
    ) { }

    async adminRegister(request: RegisterUserRequest): Promise<UserResponse> {
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
                name: registerRequest.name,
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
            return {
                // id: user.id,
                name: user.name,
                email: user.email,
                role: UserRole.ADMIN,

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
                    role: UserRole.ADMIN
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
                    email: email,
                    role: UserRole.ADMIN
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

    async adminLogin(request: LoginRequest): Promise<WebResponse<UserResponse>> {
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
        if (user.role !== 'ADMIN') {
            throw new HttpException("Only admin can login", 403);
        }
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
                role: UserRole.ADMIN,
                token: token
            }
        }

    }

    async logout(user: User): Promise<WebResponse<UserResponse>> {
        await this.prismaService.user.update({
            where: {
                id: user.id,
                role:"ADMIN"
            },
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
                role: UserRole.ADMIN,
                token: {
                    accessToken: null,
                    refreshToken: null
                }
            }
        };
    }

    async getAllAdmins(): Promise<UserResponse[]> {
        const admins = await this.prismaService.user.findMany({
            where: {
                role: "ADMIN"
            }
        });

        return admins.map(admin => ({
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: UserRole.ADMIN,
        }));
    }

    async getAllUsers(): Promise<UserResponse[]> {
        const users = await this.prismaService.user.findMany({
            where: {
                role: "USER"
            }
        })
        return users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: UserRole.USER,
        }));
    }
    
}