import { Inject, Injectable, forwardRef } from '@nestjs/common';

import { UsersService } from 'src/users/providers/users.service';
import { SignInDTO } from '../dtos/signin.dto';
import { SignInProvider } from './sign-in.provider';

@Injectable()
export class AuthService {
  constructor(
    /**
     * Inject SignInProvider
     */
    private readonly singInProvider: SignInProvider,
  ) {}

  public async signIn(signInDto: SignInDTO) {
    return await this.singInProvider.signIn(signInDto);
  }

  public isAuth() {
    return true;
  }
}
