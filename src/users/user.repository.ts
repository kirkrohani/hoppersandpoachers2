import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDTO } from './dtos/create-user.dto';
import { ConflictException, RequestTimeoutException } from '@nestjs/common';
import { ERROR_MESSAGES } from 'src/utils/errors';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(userCreds: CreateUserDTO): Promise<User> {
    const { username, password, firstname, lastname, email } = userCreds;
    // const salt = await bcrypt.genSalt();
    // const hashedPassword = await bcrypt.hash(password, salt);
    let user = this.create({
      username,
      password: password,
      firstname,
      lastname,
      email,
    });

    try {
      user = await this.save(user);
    } catch (error) {
      throw new RequestTimeoutException(ERROR_MESSAGES.UNABLE_TO_PROCESS, {
        description: 'Error connecting to the database',
      });
    }
    return user;
  }

  async findUserById(userId: string): Promise<User> {
    try {
      return await this.findOne({
        where: { id: userId },
      });
    } catch (error) {
      throw new RequestTimeoutException(ERROR_MESSAGES.UNABLE_TO_PROCESS, {
        description: 'Error connecting to the database',
      });
    }
  }

  async findUser(username: string): Promise<User> {
    try {
      return await this.findOne({
        where: { username: username },
      });
    } catch (error) {
      throw new RequestTimeoutException(ERROR_MESSAGES.UNABLE_TO_PROCESS, {
        description: 'Error connecting to the database',
      });
    }
  }
}
