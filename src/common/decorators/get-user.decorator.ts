import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});

import { JwtPayload } from 'jsonwebtoken';
import { RolesEnum } from '@app/modules/users/enums';

export interface ApiJwtPayload extends JwtPayload {
  id: string;
  firstName: string;
  lastName: string;
  role: RolesEnum;
  email: string;
}
