export declare enum UserRole {
    ADMIN = "ADMIN",
    USER = "USER"
}
export declare class RegisterUserRequest {
    role: UserRole;
    password: string;
    name: string;
    email: string;
}
export declare class UserResponse {
    id?: string;
    name: string;
    token?: Tokens;
    email: string;
    role?: UserRole;
}
export declare class Tokens {
    accessToken: string | null;
    refreshToken: string | null;
    id?: string;
}
export declare class LoginRequest {
    password: string;
    email: string;
}
