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
  ) {}

  /**
   * CREATE SINGLE USER - Method to create a new user in database
   * @param createUserDto
   * @returns Promise<void>
   */
  async createUser(createUserDto: CreateUserDTO): Promise<User> {
    console.log('inside users service');
    let existingUser = undefined;

    // check if this user already exists in db
    try {
      existingUser = await this.usersRepository.findOne({
        where: { username: createUserDto.username },
      });
      console.log('existing user: ', existingUser);
    } catch (error) {
      throw new RequestTimeoutException(ERROR_MESSAGES.UNABLE_TO_PROCESS, {
        description: 'Error connecting to the database',
      });
    }
    // if user exists throw an exception otherwise create user in db
    if (existingUser) {
      throw new ConflictException(ERROR_MESSAGES.DUPLICATE_USERNAME);
    } else {
      const user = this.usersRepository.create(createUserDto);
      return await this.usersRepository.save(user);
    }
  }

  /**
   * CREATE MANY USERS - creates multiple users using QueryRunner
   * @param createUsersDto
   */
  async createManyUsers(createUsersDto: CreateUserDTO[]): Promise<void> {
    const newUsers: User[] = [];

    //Create QueryRunner instance
    const queryRunner = this.dataSource.createQueryRunner();

    //Connect to datasource
    await queryRunner.connect();

    //Start Transaction
    queryRunner.startTransaction();
    try {
      for (const user of createUsersDto) {
        const newUser = queryRunner.manager.create(User, user);
        const result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }
      //If successful - commit
      await queryRunner.commitTransaction();
    } catch (error) {
      //If unsuccessful - rollback
      await queryRunner.rollbackTransaction();
    } finally {
      //Close Transaction
      await queryRunner.release();
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
    const user: User = await this.usersRepository.findOne({
      where: { username: username },
    });

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
}
