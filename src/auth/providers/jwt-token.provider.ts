import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { User } from 'src/users/user.entity';
import { Request } from 'express';

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
      },
      {
        audience,
        issuer,
        secret,
        expiresIn: token_ttl,
      },
    );

    return accessToken;
  }

  validateToken(request: Request): string | undefined {
    //first string is the bearer and the second is the token
    const [bearer, token] = request.headers.authorization?.split(' ') ?? [];

    return token;
  }
}
