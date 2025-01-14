import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './providers/users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import profileConfig from './config/profile.config';
import { User } from './user.entity';
import { CreateMultipleUsersProvider } from './providers/create-user-multiple.provider';
import { CreateUserProvider } from './providers/create-user.provider';

@Module({
  imports: [
    ConfigModule.forFeature(profileConfig),
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
  ],
  providers: [UsersService, CreateMultipleUsersProvider, CreateUserProvider],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
