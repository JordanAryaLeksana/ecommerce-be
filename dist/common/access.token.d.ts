import { Strategy, StrategyOptionsWithRequest } from "passport-jwt";
import { UserResponse } from "../model/user.model";
import { ConfigService } from "@nestjs/config";
declare const AccessToken_base: new (...args: [opt: StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class AccessToken extends AccessToken_base {
    private configService;
    constructor(configService: ConfigService);
    validate(payload: UserResponse): UserResponse;
}
export {};
