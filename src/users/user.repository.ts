import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDTO } from './dtos/create-user.dto';

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
    user = await this.save(user);
    return user;
  }

  async findUserById(userId: string): Promise<User> {
    return await this.findOne({
      where: { id: userId },
    });
  }
}
