import { SetMetadata } from "@nestjs/common";
import { UserRole } from "../model/user.model";


export const Roles = (...roles: UserRole[]) => {
    return SetMetadata('roles', roles);
}