import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessTokenGuard } from '../access-token/access-token.guard';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { AUTH_TYPE } from 'src/utils/constants';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private logger = new Logger('AuthenticationGuard');

  private static readonly defaultAuthType = AuthType.Bearer;

  /**
   * This Map determines the different Guards for the various auth types
   */
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

  /**
   * This method uses reflection to get all the different methods and classes from the
   * execution context and then determines their auth types
   * Based on their auth type it executes the canActivate method per their type
   * If even one auth type returns true in it's canActivate then it allows the reoute
   * @param context
   * @returns boolean
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes = this.reflector.getAllAndOverride(AUTH_TYPE, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [AuthenticationGuard.defaultAuthType];

    const guards = authTypes.map((type) => this.authTypeGuardsMap[type]).flat();

    const error = new UnauthorizedException();
    for (const guard of guards) {
      const activationAllowed = await Promise.resolve(
        guard.canActivate(context),
      ).catch((err) => {
        error: err;
      });

      if (activationAllowed) {
        this.logger.verbose('Activation allow, Guard will allow route through');
        return true;
      }
    }
    throw error;
  }
}
