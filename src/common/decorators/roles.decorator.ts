import { SetMetadata } from '@nestjs/common';
import { ROLES } from 'common/constants/enum/roles.enum';

export const ROLE_KEY = 'roles';
export const Roles = (...roles: ROLES[]) => SetMetadata(ROLE_KEY, roles);
