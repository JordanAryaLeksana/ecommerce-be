import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class TestService{
    constructor(
        private prismaService: PrismaService){}
        async deleteUser(){
            await this.prismaService.user.deleteMany({
                where:{
                    name: "test"
                }
            })
        }
        async createUser(){
            await this.prismaService.user.createMany({
                data:{
                    name: "test",
                    email: "@test",
                    password: await bcrypt.hash('test', 10)
                }
            })
        }
    }