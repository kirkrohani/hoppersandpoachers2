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
  ) {}

  /**
   * Method which finds the user in the db and then compares the encrypted password in the db
   * with the password that is passed in
   * @param signInDto
   * @returns boolean
   */
  public async signIn(signInDto: SignInDTO): Promise<boolean> {
    //find user using email id
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

    return true;
  }
}
