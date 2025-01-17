import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtTokenProvider } from 'src/auth/providers/jwt-token.provider';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    /**
     * Inject JwtTokenProvider
     */
    private readonly jwtTokenProvider: JwtTokenProvider,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.jwtTokenProvider.validateToken(request);

    return true;
  }
}
