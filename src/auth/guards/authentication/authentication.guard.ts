import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AccessTokenGuard } from '../access-token/access-token.guard';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { AUTH_TYPE } from 'src/utils/constants';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = AuthType.Bearer;

  private readonly authTypeGuardsMap: Record<
    AuthType,
    CanActivate | CanActivate[]
  > = {
    [AuthType.Bearer]: this.accessTokenGuard,
    [AuthType.None]: { canActivate: () => true },
  };

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes = this.reflector.getAllAndOverride(AUTH_TYPE, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [AuthenticationGuard.defaultAuthType];
    console.log('AUTH TYPES: ', authTypes);

    const guards = authTypes.map((type) => this.authTypeGuardsMap[type]).flat();
    console.log('GUARDS: ', guards);

    const error = new UnauthorizedException();
    for (const guard of guards) {
      console.log('current guard: ', guard);
      const activationAllowed = await Promise.resolve(
        guard.canActivate(context),
      ).catch((err) => {
        error: err;
      });

      console.log('activation allowed: ', activationAllowed);
      if (activationAllowed) {
        return true;
      }
    }
    throw error;
  }
}
