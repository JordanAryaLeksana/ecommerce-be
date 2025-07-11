import { Category } from '@prisma/client';
import { z, ZodType } from 'zod';


export class CartValidation {
    static readonly addToCartSchema: ZodType = z.object({
        userId: z.string(),
        itemId: z.string(),
        name: z.string(),
        price: z.number().positive(),
        image: z.string().url(),
        type: z.nativeEnum(Category,
            {
                errorMap: (issue, ctx) => {
                    if (issue.code === 'invalid_enum_value') {
                        return { message: `Invalid category: ${ctx.data}` };
                    }
                    return { message: ctx.defaultError };
                },
            }
        ),
        stock: z.number().int().positive().optional(),
        isOnSale: z.boolean().optional(),
        totalPrice: z.number().positive().optional(),
        cartId: z
            .union([z.string(), z.literal('')])
            .optional(),
        quantity: z.number().int().positive(),
    });
    static readonly checkoutCartSchema: ZodType = z.object({
        userId: z.string(),
        items: z.array(
            z.object({
                itemId: z.string(),
                name: z.string(),
                quantity: z.number().int().positive(),
                price: z.number().positive(),
            })
        ),
        total: z.number().positive(),
        status: z.nativeEnum(Category, {
            errorMap: (issue, ctx) => {
                if (issue.code === 'invalid_enum_value') {
                    return { message: `Invalid status: ${ctx.data}` };
                }
                return { message: ctx.defaultError };
            },
        }),
    });
}