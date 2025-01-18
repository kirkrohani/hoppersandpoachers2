import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { User } from 'src/users/user.entity';
import { Request } from 'express';
import { iActiveUser } from '../interfaces/active-user.interface';

@Injectable()
export class JwtTokenProvider {
  constructor(
    /**
     * Inject JWTService
     */
    private readonly jwtService: JwtService,

    /**
     * Inject jwtConfig
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async generateToken(user: User): Promise<string> {
    const { audience, issuer, secret, token_ttl } = this.jwtConfiguration;
    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
      } as iActiveUser,
      {
        audience,
        issuer,
        secret,
        expiresIn: token_ttl,
      },
    );

    return accessToken;
  }

  async validateToken(
    request: Request,
  ): Promise<{ valid: boolean; payload: string }> {
    let payload = undefined;
    const [bearer, token] = request.headers.authorization?.split(' ') ?? [];

    if (token) {
      try {
        payload = await this.jwtService.verifyAsync(
          token,
          this.jwtConfiguration,
        );
      } catch (error) {
        throw new UnauthorizedException();
      }
    }
    return {
      valid: token ? true : false,
      payload,
    };
  }
}
