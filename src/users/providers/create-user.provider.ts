import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { ERROR_MESSAGES } from 'src/utils/errors';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class CreateUserProvider {
  constructor(
    /**
     * Inject User Repository
     */
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    /**
     * Inject HashingProvider
     */
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}

  /**
   * CREATE SINGLE USER - Method to create a new user in database
   * @param createUserDto
   * @returns Promise<void>
   */
  async createUser(createUserDto: CreateUserDTO): Promise<User> {
    let existingUser = undefined;

    // check if this user already exists in db
    try {
      existingUser = await this.usersRepository.findOne({
        where: { username: createUserDto.username },
      });
    } catch (error) {
      throw new RequestTimeoutException(ERROR_MESSAGES.UNABLE_TO_PROCESS, {
        description: 'Error connecting to the database',
      });
    }
    // if user exists throw an exception otherwise create user in db
    if (existingUser) {
      throw new ConflictException(ERROR_MESSAGES.DUPLICATE_USERNAME);
    } else {
      // User hashing provider to salt and hash password before storage
      const user = this.usersRepository.create({
        ...createUserDto,
        password: await this.hashingProvider.hashPassword(
          createUserDto.password,
        ),
      });
      return await this.usersRepository.save(user);
    }
  }
}
