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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const user_model_1 = require("../model/user.model");
const auth_decorator_1 = require("../common/auth.decorator");
const Accesstoken_auth_guard_1 = require("../common/Accesstoken.auth.guard");
const public_decorator_1 = require("../common/public.decorator");
const user_model_2 = require("../model/user.model");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async register(request) {
        const result = await this.userService.register(request);
        return {
            data: result
        };
    }
    async refreshToken(token) {
        if (!token.id || !token.refreshToken) {
            return {
                error: 'Missing user id or refresh token'
            };
        }
        console.log("masuk", token);
        const result = await this.userService.refreshTokens(token.id, token.refreshToken);
        return {
            data: result,
        };
    }
    async login(request) {
        const result = await this.userService.login(request);
        console.log("controller", result);
        if (result.error) {
            return {
                error: result.error
            };
        }
        if (result.data) {
            console.log("controller", result.data);
            return {
                data: result.data,
            };
        }
        return {
            error: "Unexpected response from login service"
        };
    }
    async get(user) {
        const result = await this.userService.get(user);
        return {
            data: result
        };
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('/register'),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_model_1.RegisterUserRequest]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('/refresh-token'),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_model_2.Tokens]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)('/login'),
    (0, public_decorator_1.Public)(),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_model_1.LoginRequest]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('/current'),
    (0, common_1.UseGuards)(Accesstoken_auth_guard_1.AccessTokenAuth),
    (0, common_1.HttpCode)(200),
    __param(0, (0, auth_decorator_1.Auth)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "get", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('/api/users'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map