
export class RegisterUserRequest {
    password: string;
    name: string;
    email: string;
}

export class UserResponse {
    name: string;
    token?: Tokens;
    email: string; 
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

