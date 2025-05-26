import { NestMiddleware } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
export declare class AuthMiddleware implements NestMiddleware {
    private prismaService;
    constructor(prismaService: PrismaService);
    use(req: any, res: any, next: (error?: any) => void): Promise<void>;
}
