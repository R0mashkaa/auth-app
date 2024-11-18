import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from '@app/modules/users/enums';

export const Roles = (...roles: RolesEnum[]) => SetMetadata('roles', roles);
