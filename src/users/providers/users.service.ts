import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '.././user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from '.././dtos/create-user.dto';
import { ERROR_CODES, ERROR_MESSAGES } from '../../utils/errors';

import { User } from '../user.entity';
import { GetUserIdParamDTO } from '../dtos/get-user-id-param.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { ConfigType } from '@nestjs/config';
import profileConfig from '../config/profile.config';

/**
 * Users Service connects to users table and performs business services on users object
 */
@Injectable()
export class UsersService {
  /**
   * @constructor
   * @param authService
   * @param userRepo
   * @param jwtService
   */
  constructor(
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,

    /**
     * Inject User Repo
     */
    @InjectRepository(UserRepository)
    private userRepo: UserRepository,

    /**
     * Inject profile config
     */
    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,
  ) {}

  /**
   * USER SIGN UP - Method to create a new user in database
   * @param createUserDto
   * @returns Promise<void>
   */
  async userSignUp(createUserDto: CreateUserDTO): Promise<User> {
    // check for duplicate username, throw error if dupe
    try {
      return await this.userRepo.createUser(createUserDto);
    } catch (error) {
      if (error.code === ERROR_CODES.DUPLICATE_USERNAME.toString()) {
        throw new ConflictException(ERROR_MESSAGES.DUPLICATE_USERNAME);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  /**
   *  USER SIGN IN - method to sign in / authenticate an existing user
   * @param createUserDto
   * @returns Promise<{ signedToken: string }>
   */
  async userSignIn(
    createUserDto: CreateUserDTO,
  ): Promise<{ signedToken: string }> {
    const { username, password } = createUserDto;
    const user: User = await this.userRepo.findOne({ username });

    if (user) {
      // const authTokenPayload: iJWTPayload = { username };
      // const signedToken: string = await this.jwtService.sign(authTokenPayload);
      // return { signedToken };
      return null;
    } else {
      throw new UnauthorizedException(ERROR_MESSAGES.LOGIN_FAILED);
    }
  }

  /**
   * FIND ALL USERS - method which returns and array of all users from database
   * @param getUserIdParamDto
   * @param limit
   * @param page
   * @returns Promise<any>
   */
  async findAll(
    getUserIdParamDto: GetUserIdParamDTO,
    limit: number,
    page: number,
  ): Promise<any> {
    // const isAuth = this.authService.isAuthenticated();
    console.log('Profile Config: ', this.profileConfiguration);
    return [
      {
        firstname: 'Kirk',
        lastname: 'Rohani',
        email: 'krohani@gmail.com',
      },
      {
        firstname: 'Kirk2',
        lastname: 'Rohani2',
        email: 'krohani2@gmail.com',
      },
    ];
  }

  /**
   * method which finds one specific user by their user id from the database
   * @param username
   * @returns Promise<User>
   */
  async findOneById(userId: string): Promise<any> {
    return await this.userRepo.findUserById(userId);
  }
}
