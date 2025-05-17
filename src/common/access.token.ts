import {  PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt, StrategyOptionsWithRequest } from "passport-jwt";
import { UserResponse } from "../model/user.model";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AccessToken extends PassportStrategy(Strategy, 'jwt'){
    constructor(private configService: ConfigService){
        super(
            {
                ignoreExpiration: false,
                jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken() ,
                secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET,
            } as StrategyOptionsWithRequest
        )
    }
    validate(payload: UserResponse){    
        return payload;
    }
}