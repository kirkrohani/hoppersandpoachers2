import { SetMetadata } from '@nestjs/common';
import { AUTH_TYPE } from 'src/utils/constants';
import { AuthType } from '../enums/auth-type.enum';

export const AuthDecorator = (...authTypes: AuthType[]) =>
  SetMetadata(AUTH_TYPE, authTypes);
