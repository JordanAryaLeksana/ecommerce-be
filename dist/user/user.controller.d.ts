import { UserService } from './user.service';
import { WebResponse } from '../model/web.model';
import { LoginRequest, RegisterUserRequest, UserResponse } from '../model/user.model';
import { User } from '@prisma/client';
import { Tokens } from '../model/user.model';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    register(request: RegisterUserRequest): Promise<WebResponse<UserResponse>>;
    refreshToken(token: Tokens): Promise<WebResponse<Tokens>>;
    login(request: LoginRequest): Promise<WebResponse<UserResponse>>;
    get(user: User): Promise<WebResponse<UserResponse>>;
}
