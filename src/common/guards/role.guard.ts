import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from 'common/decorators/roles.decorator';
import { ROLES } from 'common/constants/enum/roles.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const requiredRoles = this.reflector.get<ROLES[]>(
      ROLE_KEY,
      context.getHandler(),
    );
    const user = context.switchToHttp().getRequest().user;
    if (!user.roles.includes(ROLES.STUDENT)) {
      throw new UnauthorizedException('This account is invalid');
    }
    if (!requiredRoles && user) {
      return true;
    }

    this.matchRoles(requiredRoles, user.roles);
    return true;
  }

  matchRoles(requiredRoles: ROLES[], userRoles: ROLES[]) {
    const result = userRoles.some((role) => {
      return requiredRoles.includes(role);
    });
    if (!result) {
      throw new UnauthorizedException('You do not have the necessary roles');
    }
  }
}
