"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollaboratorValidation = void 0;
const zod_1 = require("zod");
class CollaboratorValidation {
    static CREATE = zod_1.z.object({
        name: zod_1.z.string().max(100, { message: "Name must be less than 100 characters" }).min(3, { message: "Name must be at least 3 characters long" }),
        email: zod_1.z.string().email({ message: "Invalid email address" }).max(100, { message: "Email must be less than 100 characters" }),
        role: zod_1.z.enum(["ecommerce_expert", "supplier", "influencer", "developer"], { message: "Invalid role" }),
    });
    static UPDATE = zod_1.z.object({
        name: zod_1.z.string().max(100, { message: "Name must be less than 100 characters" }).min(3, { message: "Name must be at least 3 characters long" }).optional(),
        email: zod_1.z.string().email({ message: "Invalid email address" }).max(100, { message: "Email must be less than 100 characters" }).optional(),
        role: zod_1.z.enum(["ecommerce_expert", "supplier", "influencer", "developer"], { message: "Invalid role" }).optional(),
    });
}
exports.CollaboratorValidation = CollaboratorValidation;
//# sourceMappingURL=collaborator.validation.js.map