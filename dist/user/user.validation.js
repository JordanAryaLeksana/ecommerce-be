"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
class UserValidation {
    static REGISTER = zod_1.z.object({
        password: zod_1.z.string().min(6).max(100),
        email: zod_1.z.string().email(),
        name: zod_1.z.string().min(1).max(100)
    });
    static LOGIN = zod_1.z.object({
        password: zod_1.z.string().min(6).max(100),
        email: zod_1.z.string().email()
    });
}
exports.UserValidation = UserValidation;
//# sourceMappingURL=user.validation.js.map