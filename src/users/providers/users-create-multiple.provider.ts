import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { DataSource } from 'typeorm';
import { UsersCreateMultipleDTO } from '../dtos/create-multiple-users.dto';
import { ERROR_MESSAGES } from 'src/utils/errors';

@Injectable()
export class UsersCreateMultpleProvider {
  constructor(
    /**
     * Inject Datasource
     */
    private readonly dataSource: DataSource,
  ) {}

  /**
   * CREATE MANY USERS - creates multiple users using QueryRunner
   * @param createUsersDto
   */
  async createMultipleUsers(
    creatMultipleeUsersDto: UsersCreateMultipleDTO,
  ): Promise<User[]> {
    const newUsers: User[] = [];
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
    } catch (error) {
      throw new RequestTimeoutException(ERROR_MESSAGES.COULD_NOT_CONNECT_TO_DB);
    }

    try {
      for (const user of creatMultipleeUsersDto.users) {
        const newUser = queryRunner.manager.create(User, user);
        const result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ConflictException(ERROR_MESSAGES.TRANSACTION_FAILED, {
        description: JSON.stringify(error),
      });
    } finally {
      await queryRunner.release();
    }
    return newUsers;
  }
}
