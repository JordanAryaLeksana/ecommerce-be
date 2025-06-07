import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { UserRole } from "src/model/user.model";


export class RolesGuards implements CanActivate{
    constructor(private readonly roles: UserRole[], private Reflector: Reflector){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiresRoles  = this.Reflector.get<UserRole[]>('roles',context.getHandler())

        if(!requiresRoles){
            return true;
        }
        const request = context.switchToHttp().getRequest<{ user?: { role?: UserRole } }>();
        const user = request.user;

        if (!user || !user.role) {
            return false;
        }

        return requiresRoles.includes(user.role);
    }
}