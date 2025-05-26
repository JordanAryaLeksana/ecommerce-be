"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemsValidation = void 0;
const zod_1 = require("zod");
const baseSchema = zod_1.z.object({
    type: zod_1.z.enum(['books', 'projects', 'tools']),
    name: zod_1.z.string().min(1).max(100),
    price: zod_1.z.number().min(0),
    stock: zod_1.z.number().min(0),
    description: zod_1.z.string().min(1).max(1000),
    image: zod_1.z.string().url(),
    writer: zod_1.z.string().min(1).max(100).optional(),
});
class ItemsValidation {
    static CREATE = baseSchema.superRefine((data, ctx) => {
        if (data.type === 'books' && !data.writer) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: 'Writer is required when type is books',
                path: ['writer'],
            });
        }
    });
    static UPDATE = zod_1.z.object({
        type: zod_1.z.enum(['books', 'projects', 'tools']).optional(),
        name: zod_1.z.string().min(1).max(100).optional(),
        price: zod_1.z.number().min(0).optional(),
        stock: zod_1.z.number().min(0).optional(),
        description: zod_1.z.string().min(1).max(1000).optional(),
        image: zod_1.z.string().url().optional(),
        writer: zod_1.z.string().min(1).max(100).optional(),
    });
}
exports.ItemsValidation = ItemsValidation;
//# sourceMappingURL=barang.validation.js.map