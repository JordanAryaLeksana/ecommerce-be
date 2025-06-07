import { z, ZodType } from 'zod';


export class CartValidation {
    static readonly addToCartSchema: ZodType = z.object({
        userId: z.string(),
        itemId: z.string(),
        cartId: z
            .union([z.string().uuid(), z.literal('')])
            .optional(),
        quantity: z.number().int().positive(),
    });
}