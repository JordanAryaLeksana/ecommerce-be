"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const nest_winston_1 = require("nest-winston");
const prisma_service_1 = require("../common/prisma.service");
const winston_1 = require("winston");
const user_validation_1 = require("./user.validation");
const validation_service_1 = require("../common/validation.service");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let UserService = class UserService {
    validationService;
    jwtService;
    configService;
    logger;
    prismaService;
    constructor(validationService, jwtService, configService, logger, prismaService) {
        this.validationService = validationService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.logger = logger;
        this.prismaService = prismaService;
    }
    async register(request) {
        this.logger.info(`Register New User: ${JSON.stringify(request)}`);
        const registerRequest = this.validationService.validate(user_validation_1.UserValidation.REGISTER, request);
        console.log(registerRequest);
        const totalUserWithSameUsername = await this.prismaService.user.count({
            where: {
                name: registerRequest.name
            }
        });
        if (totalUserWithSameUsername != 0) {
            throw new common_1.HttpException("Username already exists", 400);
        }
        const totalUserWithSameEmail = await this.prismaService.user.count({
            where: {
                email: registerRequest.email
            }
        });
        if (totalUserWithSameEmail !== 0) {
            throw new common_1.HttpException("Email already exists", 400);
        }
        const hashedPassword = await bcrypt.hash(registerRequest.password, 10);
        registerRequest.password = hashedPassword;
        try {
            const user = await this.prismaService.user.create({
                data: registerRequest
            });
            return {
                name: user.name,
                email: user.email,
            };
        }
        catch (e) {
            this.logger.error(`Error creating user: ${e}`);
            throw new common_1.HttpException('Failed to register user', 500);
        }
    }
    async getTokens(id, email, name) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({
                id: id,
                name: name,
                email: email
            }, {
                secret: process.env.JWT_ACCESS_TOKEN_SECRET,
                expiresIn: process.env.JWT_EXPIRES,
            }),
            this.jwtService.signAsync({
                id: id,
                name: name,
                email: email
            }, {
                secret: process.env.JWT_SECRET,
                expiresIn: '3d'
            })
        ]);
        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        };
    }
    async updateRefreshToken(id, refreshToken) {
        const hash = await bcrypt.hash(refreshToken, 10);
        await this.prismaService.user.update({
            where: {
                id: id
            },
            data: {
                RefreshToken: hash,
                AccessToken: null
            }
        });
    }
    async refreshTokens(userId, refreshToken) {
        const user = await this.prismaService.user.findUnique({
            where: { id: userId }
        });
        if (!user || !user.RefreshToken) {
            throw new common_1.HttpException('Access Denied', 403);
        }
        const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.RefreshToken);
        if (!isRefreshTokenValid) {
            throw new common_1.HttpException('Invalid Refresh Token', 403);
        }
        const tokens = await this.getTokens(user.id, user.email, user.name);
        if (!tokens.refreshToken) {
            throw new common_1.HttpException("Refresh token is missing", 500);
        }
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }
    async login(request) {
        this.logger.info(`Login User: ${JSON.stringify(request)}`);
        this.logger.error(`Login User: ${JSON.stringify(request)}`);
        const LoginRequest = this.validationService.validate(user_validation_1.UserValidation.LOGIN, request);
        const user = await this.prismaService.user.findUnique({
            where: {
                email: LoginRequest.email
            }
        });
        if (!user) {
            throw new common_1.HttpException("User not found", 400);
        }
        const passwordMatch = await bcrypt.compare(LoginRequest.password, user.password);
        if (!passwordMatch) {
            throw new common_1.HttpException("Invalid password", 401);
        }
        const token = await this.getTokens(user.id, user.email, user.name);
        if (!token.refreshToken) {
            throw new common_1.HttpException("Refresh token is missing", 500);
        }
        await this.updateRefreshToken(user.id, token.refreshToken);
        await this.prismaService.user.update({
            where: {
                email: LoginRequest.email
            },
            data: {
                AccessToken: token.accessToken
            }
        });
        return {
            data: {
                name: user.name,
                email: user.email,
                token: token
            }
        };
    }
    async get(user) {
        await Promise.resolve();
        return {
            name: user.name,
            email: user.email,
        };
    }
    async logout(user) {
        await this.prismaService.user.update({
            where: { id: user.id },
            data: {
                RefreshToken: null,
                AccessToken: null
            }
        });
        return {
            data: {
                name: user.name,
                email: user.email,
                token: {
                    accessToken: null,
                    refreshToken: null
                }
            }
        };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __metadata("design:paramtypes", [validation_service_1.ValidationService,
        jwt_1.JwtService,
        config_1.ConfigService,
        winston_1.Logger,
        prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map