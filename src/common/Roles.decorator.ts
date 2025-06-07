import { SetMetadata } from "@nestjs/common";
import { UserRole } from "src/model/user.model";


export const Roles = (...roles: UserRole[]) => {
    return SetMetadata('roles', roles);
}