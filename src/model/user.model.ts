
export enum UserRole{
    ADMIN = 'admin',
    USER = 'user',
}
export class RegisterUserRequest {
    role: UserRole;
    password: string;
    name: string;
    email: string;
}

export class UserResponse {
    id?: string;
    name: string;
    token?: Tokens;
    email: string; 
    role?: UserRole;
}

export class Tokens{
    accessToken: string | null;
    refreshToken: string | null;
    id?: string;
}
export class LoginRequest{
    password: string;
    email: string;
}

