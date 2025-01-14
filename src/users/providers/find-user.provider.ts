import {
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { ERROR_MESSAGES } from 'src/utils/errors';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FindUserProvider {
  constructor(
    /**
     * Inject UserRepository
     */
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * FIND ONE USER BY EMAIL - method which finds one specific user by their email from the database
   * @param email
   * @returns Promise<User>
   */
  async findOneByEmail(email: string): Promise<any> {
    let user: User | undefined = undefined;
    try {
      user = await this.usersRepository.findOne({
        where: { email: email },
      });
    } catch (error) {
      throw new RequestTimeoutException(ERROR_MESSAGES.UNABLE_TO_PROCESS, {
        description: 'Error connecting to the database',
      });
    }

    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.USER_DOES_NOT_EXIST);
    }
    return user;
  }
}
