/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NestMiddleware } from "@nestjs/common";
import { PrismaService } from "./prisma.service";


@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private prismaService: PrismaService){}
    async use(req: any, res: any, next: (error?: any) => void) {
        const token = req.headers['Authorization'] as string;
        if(token){
            const user = await this.prismaService.user.findFirst({
                where:{
                    // RefreshToken: token,
                    AccessToken: token
                }
            });
            if(user){
                req.user = user ;
                
            };
        }
    next();
    }

    
}