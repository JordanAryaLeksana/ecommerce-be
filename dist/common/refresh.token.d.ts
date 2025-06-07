import { Strategy, StrategyOptionsWithRequest } from "passport-jwt";
import { UserResponse } from "../model/user.model";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";
declare const RefreshToken_base: new (...args: [opt: StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class RefreshToken extends RefreshToken_base {
    private configService;
    constructor(configService: ConfigService);
    validate(req: Request, payload: UserResponse): {
        refreshToken: string | undefined;
        id?: string;
        name: string;
        token?: import("../model/user.model").Tokens;
        email: string;
    };
}
export {};
