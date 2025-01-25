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
    const { audience, issuer, secret, accessTokenTtl } = this.jwtConfiguration;
    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
      } as iActiveUser,
      {
        audience,
        issuer,
        secret,
        expiresIn: accessTokenTtl,
      },
    );

    return accessToken;
  }

  async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    const { audience, issuer, secret } = this.jwtConfiguration;

    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience,
        issuer,
        secret,
        expiresIn: expiresIn,
      },
    );
  }

  async validateToken(
    request: Request,
  ): Promise<{ valid: boolean; payload: string }> {
    //extract the token from the request
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
    } else {
      throw new UnauthorizedException();
    }
    return {
      valid: payload ? true : false,
      payload,
    };
  }
}
