import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { DataSource } from 'typeorm';
import { UsersCreateMultipleDTO } from '../dtos/create-multiple-users.dto';

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

    //Create QueryRunner instance
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    queryRunner.startTransaction();
    try {
      for (const user of creatMultipleeUsersDto.users) {
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
    return newUsers;
  }
}
