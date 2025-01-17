import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtTokenProvider } from 'src/auth/providers/jwt-token.provider';
import { REQUEST_USER_KEY } from 'src/utils/constants';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    /**
     * Inject JwtTokenProvider
     */
    private readonly jwtTokenProvider: JwtTokenProvider,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    //Get the request object to pass to validateToken
    const request = context.switchToHttp().getRequest();

    //call validateToken to determine if valid and get the payload
    const validatedToken = await this.jwtTokenProvider.validateToken(request);
    if (!validatedToken || !validatedToken.valid) {
      throw new UnauthorizedException();
    }

    request[REQUEST_USER_KEY] = validatedToken.payload;

    return true;
  }
}
