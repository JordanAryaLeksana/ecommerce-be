import {z, ZodType} from 'zod';
import { OrderStatus } from '@prisma/client';
export class OrderValidation {
    static createOrderSchema: ZodType = z.object({
        userId: z.string().min(1, "User ID is required"),
        items: z.array(
        z.object({
            itemId: z.string().min(1, "Item ID is required"),
            name: z.string().min(1, "Item name is required"),
            quantity: z.number().int().positive("Quantity must be a positive integer"),
            price: z.number().positive("Price must be a positive number")
        })
        ),
        totalPrice: z.number().positive("Total price must be a positive number"),
        orderDate: z.string(),
        status: z.nativeEnum(OrderStatus, {
            errorMap: (issue, ctx) => {
                if (issue.code === 'invalid_enum_value') {
                    return { message: `Invalid order status: ${ctx.data}` };
                }
                return { message: ctx.defaultError };
            }
        })
    });
}