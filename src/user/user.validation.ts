import { z, ZodType } from "zod";

 export class UserValidation {
    static readonly REGISTER: ZodType = z.object({
        password: z.string().min(6).max(100),
        email: z.string().email(),
        name: z.string().min(1).max(100)
    })
    static readonly LOGIN: ZodType = z.object({
        password: z.string().min(6).max(100),
        email: z.string().email()
    })
    
 }