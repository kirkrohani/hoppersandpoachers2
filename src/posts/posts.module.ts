import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './providers/posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsRepository } from './posts.repository';
import { UsersModule } from '../users/users.module';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { TagsModule } from 'src/tags/tags.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostsRepository, MetaOption]),
    UsersModule,
    TagsModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
