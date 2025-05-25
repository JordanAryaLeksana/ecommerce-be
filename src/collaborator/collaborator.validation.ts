import { z } from "zod";
import { ZodType } from "zod";

export class CollaboratorValidation {
    static readonly CREATE: ZodType = z.object({
        name: z.string().max(100, { message: "Name must be less than 100 characters" }).min(3, { message: "Name must be at least 3 characters long" }),
        email: z.string().email({ message: "Invalid email address" }).max(100, { message: "Email must be less than 100 characters" }),
        role: z.enum(["ecommerce_expert", "supplier", "influencer", "developer"], { message: "Invalid role" }),
    });
    
    static readonly UPDATE: ZodType = z.object({
        name: z.string().max(100, { message: "Name must be less than 100 characters" }).min(3, { message: "Name must be at least 3 characters long" }).optional(),
        email: z.string().email({ message: "Invalid email address" }).max(100, { message: "Email must be less than 100 characters" }).optional(),
        role: z.enum(["ecommerce_expert", "supplier", "influencer", "developer"], { message: "Invalid role" }).optional(),
    });
}
