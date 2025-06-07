"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginRequest = exports.Tokens = exports.UserResponse = exports.RegisterUserRequest = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["USER"] = "USER";
})(UserRole || (exports.UserRole = UserRole = {}));
class RegisterUserRequest {
    role;
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
    role;
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