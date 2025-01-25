import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { SignInDTO } from '../dtos/signin.dto';
import { HashingProvider } from './hashing.provider';
import { ERROR_MESSAGES } from 'src/utils/errors';
import { JwtTokenProvider } from './jwt-token.provider';

@Injectable()
export class SignInProvider {
  constructor(
    // Injecting UserService
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    /**
     * Inject HashingProvider
     */
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,

    /**
     * Inject JwtTokenProvider
     */
    private readonly jwtTokenProvider: JwtTokenProvider,
  ) {}

  /**
   * Method which finds the user in the db and then compares the encrypted password in the db
   * with the password that is passed in
   * @param signInDto
   * @returns boolean
   */
  public async signIn(signInDto: SignInDTO): Promise<{ accessToken: string }> {
    const user = await this.usersService.findOneByEmail(signInDto.email);
    const { password } = signInDto;
    let isAuthenticated = false;

    try {
      isAuthenticated = await this.hashingProvider.comparePassword(
        password,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: ERROR_MESSAGES.PASSWORD_INCORRECT,
      });
    }

    if (!isAuthenticated) {
      throw new UnauthorizedException(ERROR_MESSAGES.PASSWORD_INCORRECT);
    }

    const accessToken = await this.jwtTokenProvider.generateToken(user);
    return {
      accessToken: accessToken,
    };
  }
}
