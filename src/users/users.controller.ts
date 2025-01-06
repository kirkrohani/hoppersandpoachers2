import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './providers/users.service';
import { CreateUserDTO } from './dtos/create-user.dto';
import { GetUserIdParamDTO } from './dtos/get-user-id-param.dto';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { User } from './user.entity';
import { UsersCreateMultipleDTO } from './dtos/create-multiple-users.dto';

@Controller('users')
@ApiTags('USERS')
export class UsersController {
  private logger = new Logger('UsersController');

  /*
   Final Endpoint - /users/:id?limit=10&page=1
   Param id - optional
   Query limit - integer, default 10
   Query page - integer, default 1
  */
  constructor(private usersService: UsersService) {}

  @Get('/:id?')
  @ApiOperation({
    summary: 'fetches a list of registered users in the application',
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: 'the number of results returned per query',
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
    description: 'the page number that is to be loaded',
  })
  getUsers(
    @Param() getUserIdParamDto: GetUserIdParamDTO,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number,
  ): Promise<any> {
    return this.usersService.findAll(getUserIdParamDto, limit, page);
  }

  @Post('/signup')
  createUser(@Body() createUserDto: CreateUserDTO): Promise<User> {
    this.logger.verbose(`userSignUp for user ${JSON.stringify(createUserDto)}`);
    return this.usersService.createUser(createUserDto);
  }

  @Post('/signupMultiple')
  createManyUsers(
    @Body() createMultipleUsersDto: UsersCreateMultipleDTO,
  ): Promise<User[]> {
    this.logger.verbose(`userSignUp for multiple users`);
    return this.usersService.createMultipleUsers(createMultipleUsersDto);
  }

  @Post('/signin')
  async userSignIn(
    @Body() userCreds: CreateUserDTO,
  ): Promise<{ signedToken: string }> {
    return await this.usersService.userSignIn(userCreds);
  }

  @Patch()
  async updateUser(@Body() updateUserDto: UpdateUserDTO) {
    return updateUserDto;
  }
}
