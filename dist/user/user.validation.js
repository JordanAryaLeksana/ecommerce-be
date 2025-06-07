"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const user_model_1 = require("../model/user.model");
class UserValidation {
    static REGISTER = zod_1.z.object({
        password: zod_1.z.string().min(6).max(100),
        email: zod_1.z.string().email(),
        name: zod_1.z.string().min(1).max(100),
        role: zod_1.z.nativeEnum(user_model_1.UserRole).optional().default(user_model_1.UserRole.USER)
    });
    static LOGIN = zod_1.z.object({
        password: zod_1.z.string().min(6).max(100),
        email: zod_1.z.string().email(),
        role: zod_1.z.nativeEnum(user_model_1.UserRole).optional().default(user_model_1.UserRole.USER)
    });
}
exports.UserValidation = UserValidation;
//# sourceMappingURL=user.validation.js.map