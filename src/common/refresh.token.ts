import {  PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt, StrategyOptionsWithRequest } from "passport-jwt";
import { UserResponse } from "../model/user.model";
import { Injectable } from "@nestjs/common";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";
// import { Request } from "express";
@Injectable()
export class RefreshToken extends PassportStrategy(Strategy, 'jwt-refresh'){
    constructor(private configService: ConfigService){
        super(
            {
                jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken() ,
                secretOrKey: configService.get<string>('JWT_SECRET'),
            } as StrategyOptionsWithRequest
        )
    }
    validate(req: Request,payload: UserResponse){
       const refreshToken = req.get('Authorization')?.replace('Bearer', '').trim()
        return {
            ...payload,
            refreshToken
        }
    }
}