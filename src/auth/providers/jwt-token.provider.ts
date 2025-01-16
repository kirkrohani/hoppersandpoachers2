import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { User } from 'src/users/user.entity';

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
}
