import { z, ZodType } from "zod";
import { UserRole } from "../model/user.model";
 export class UserValidation {
    static readonly REGISTER: ZodType = z.object({
        password: z.string().min(6).max(100),
        email: z.string().email(),
        name: z.string().min(1).max(100),
        role: z.nativeEnum(UserRole).optional().default(UserRole.USER)
    })
    static readonly LOGIN: ZodType = z.object({
        password: z.string().min(6).max(100),
        email: z.string().email(),
        role: z.nativeEnum(UserRole).optional().default(UserRole.USER)
    })

 }