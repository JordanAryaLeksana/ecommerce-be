"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonModule = void 0;
const common_1 = require("@nestjs/common");
const nest_winston_1 = require("nest-winston");
const config_1 = require("@nestjs/config");
const winston = require("winston");
const prisma_service_1 = require("./prisma.service");
const validation_service_1 = require("./validation.service");
const error_filter_1 = require("./error.filter");
const auth_middleware_1 = require("./auth.middleware");
const jwt_1 = require("@nestjs/jwt");
const access_token_1 = require("./access.token");
const refresh_token_1 = require("./refresh.token");
let CommonModule = class CommonModule {
    configure(consumer) {
        consumer.apply(auth_middleware_1.AuthMiddleware).forRoutes('/api/*');
    }
};
exports.CommonModule = CommonModule;
exports.CommonModule = CommonModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            nest_winston_1.WinstonModule.forRoot({
                format: winston.format.json(),
                transports: [
                    new winston.transports.Console()
                ]
            }),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME || '1h' },
            }),
        ],
        providers: [prisma_service_1.PrismaService, validation_service_1.ValidationService,
            {
                provide: 'APP_FILTER',
                useClass: error_filter_1.ErrorFilter
            },
            access_token_1.AccessToken,
            refresh_token_1.RefreshToken
        ],
        exports: [prisma_service_1.PrismaService, access_token_1.AccessToken, refresh_token_1.RefreshToken, validation_service_1.ValidationService, jwt_1.JwtModule],
    })
], CommonModule);
//# sourceMappingURL=common.module.js.map