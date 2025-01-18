import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './providers/posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { TagsModule } from 'src/tags/tags.module';
import { Post } from './post.entity';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { CreatePostProvider } from './providers/create-post.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, MetaOption]),
    UsersModule,
    TagsModule,
    PaginationModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, CreatePostProvider],
})
export class PostsModule {}
