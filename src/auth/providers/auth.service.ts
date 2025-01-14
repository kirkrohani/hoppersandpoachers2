import { Inject, Injectable, forwardRef } from '@nestjs/common';

import { UsersService } from 'src/users/providers/users.service';
import { SignInDTO } from '../dtos/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    // Injecting UserService
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  public async signIn(signInDto: SignInDTO) {
    //find user using email id
    const user = await this.usersService.findOneByEmail(signInDto.email);
    //throw Exception if user not found
    //compare password sent with hashed password in DB
  }

  public isAuth() {
    return true;
  }
}
