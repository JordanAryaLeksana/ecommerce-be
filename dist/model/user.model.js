"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginRequest = exports.Tokens = exports.UserResponse = exports.RegisterUserRequest = void 0;
class RegisterUserRequest {
    password;
    name;
    email;
}
exports.RegisterUserRequest = RegisterUserRequest;
class UserResponse {
    id;
    name;
    token;
    email;
}
exports.UserResponse = UserResponse;
class Tokens {
    accessToken;
    refreshToken;
    id;
}
exports.Tokens = Tokens;
class LoginRequest {
    password;
    email;
}
exports.LoginRequest = LoginRequest;
//# sourceMappingURL=user.model.js.map