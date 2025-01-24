import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreatePostDTO } from '../dtos/create-post.dto';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsService } from 'src/tags/providers/tags.service';
import { UsersService } from 'src/users/providers/users.service';
import { Repository } from 'typeorm';
import { iActiveUser } from 'src/auth/interfaces/active-user.interface';
import { ERROR_MESSAGES } from 'src/utils/errors';

@Injectable()
export class CreatePostProvider {
  private logger = new Logger('CreatePostProvider', { timestamp: true });

  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    private usersService: UsersService,
    private tagsService: TagsService,
  ) {}
  /**
   *
   * CREATE POST Method which creates new posts
   * @param createPostDto
   * @param user
   * @returns
   */
  async createPost(
    createPostDto: CreatePostDTO,
    user: iActiveUser,
  ): Promise<Post> {
    let author = undefined;
    let tags = undefined;
    try {
      //Find User obj from db
      author = await this.usersService.findOneById(user.sub);

      //Get all Tags objects from DB
      tags = await this.tagsService.findTags(createPostDto.tags);
    } catch (error) {
      throw new ConflictException(error);
    }

    //Ensure that the tags passed in have already been created in DB
    if (createPostDto.tags?.length !== tags?.length) {
      throw new BadRequestException(ERROR_MESSAGES.TAGS_NOT_CORRECT);
    }

    const post = this.postsRepository.create({
      ...createPostDto,
      author: author,
      tags: tags,
    });

    try {
      this.logger.verbose(`Saving Post ${createPostDto.title} to Database`);
      await this.postsRepository.save(post);
      return post;
    } catch (error) {
      this.logger.error(
        `Error in createPost() saving post to DB and create post data: ${JSON.stringify(createPostDto)}`,
        error,
      );
      throw new ConflictException(error, {
        description: ERROR_MESSAGES.DUPLICATE_FIELD,
      });
    }
  }
}
