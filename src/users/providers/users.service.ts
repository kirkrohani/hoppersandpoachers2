import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from '.././dtos/create-user.dto';
import { ERROR_MESSAGES } from '../../utils/errors';

import { User } from '../user.entity';
import { GetUserIdParamDTO } from '../dtos/get-user-id-param.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { ConfigType } from '@nestjs/config';
import profileConfig from '../config/profile.config';
import { Repository, DataSource } from 'typeorm';
import { CreateMultipleUsersProvider } from './create-user-multiple.provider';
import { UsersCreateMultipleDTO } from '../dtos/create-multiple-users.dto';
import { CreateUserProvider } from './create-user.provider';
import { FindUserProvider } from './find-user.provider';

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
     * Injecting usersRepository
     */
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    /**
     * Inject profile config
     */
    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,

    /**
     * Inject Datasource
     */
    private readonly dataSource: DataSource,

    /**
     * Inject createMultipleUserProvider
     */
    private readonly createMultipleUserProvider: CreateMultipleUsersProvider,

    /**
     * Inject createUserProvider
     */
    private readonly createUserProvider: CreateUserProvider,

    /**
     * Inject findUserProvider
     */
    private readonly findUserProvider: FindUserProvider,
  ) {}

  /**
   * CREATE SINGLE USER - Method to create a new user in database
   * @param createUserDto
   * @returns Promise<void>
   */
  async createUser(createUserDto: CreateUserDTO): Promise<User> {
    return await this.createUserProvider.createUser(createUserDto);
  }

  /**
   * CREATE MANY USERS - creates multiple users using QueryRunner
   * @param createUsersDto
   */
  async createMultipleUsers(
    createMultipleUsersDto: UsersCreateMultipleDTO,
  ): Promise<User[]> {
    return await this.createMultipleUserProvider.createMultipleUsers(
      createMultipleUsersDto,
    );
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
   * FIND ONE USER BY USER ID - method which finds one specific user by their user id from the database
   * @param username
   * @returns Promise<User>
   */
  async findOneById(userId: string): Promise<any> {
    try {
      return await this.usersRepository.findOne({
        where: { id: userId },
      });
    } catch (error) {
      throw new RequestTimeoutException(ERROR_MESSAGES.UNABLE_TO_PROCESS, {
        description: 'Error connecting to the database',
      });
    }
  }

  /**
   * FIND ONE USER BY EMAIL - method which finds one specific user by their email from the database
   * @param email
   * @returns Promise<User>
   */
  async findOneByEmail(email: string): Promise<User> {
    return await this.findUserProvider.findOneByEmail(email);
  }
}
