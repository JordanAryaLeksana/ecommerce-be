import {z, ZodType} from "zod";


export class ItemsValidation {
    static readonly CREATE: ZodType = z.object({
        type: z.enum(['BOOKS', 'FINAL_PROJECT', 'TOOLS']),
        name: z.string().min(1).max(100),
        price: z.number().min(0),
        stock: z.number().min(0),
        description: z.string().min(1).max(1000),
        image: z.string().url(),
    })
    static readonly UPDATE: ZodType = z.object({
        type: z.enum(['BOOKS', 'FINAL_PROJECT', 'TOOLS']).optional(),
        name: z.string().min(1).max(100).optional(),
        price: z.number().min(0).optional(),
        stock: z.number().min(0).optional(),
        description: z.string().min(1).max(1000).optional(),
        image: z.string().url().optional(),
    })
}