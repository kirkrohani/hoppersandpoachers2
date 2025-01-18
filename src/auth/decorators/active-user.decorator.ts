import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { iActiveUser } from '../interfaces/active-user.interface';
import { REQUEST_USER_KEY } from 'src/utils/constants';

export const ActiveUser = createParamDecorator(
  (field: keyof iActiveUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: iActiveUser = request[REQUEST_USER_KEY];

    return field ? user?.[field] : user;
  },
);
