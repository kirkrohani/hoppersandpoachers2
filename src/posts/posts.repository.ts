import { Brackets, EntityRepository, Repository } from 'typeorm';
import { Post } from './post.entity';
import { PostStatus } from './enums/postStatus.enum';
import { CreatePostDTO } from './dtos/create-post.dto';
import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UpdatePostStatusDTO } from './dtos/update-post-status.dto';
import { GetPostsFilterDTO } from './dtos/get-posts-filter.dto';
import { User } from '../users/user.entity';
import { error } from 'console';
import { Tag } from 'src/tags/tag.entity';

@EntityRepository(Post)
export class PostsRepository extends Repository<Post> {
  private logger = new Logger('PostsRepository', { timestamp: true });

  /**
   * GET ALL POSTS
   * @param filters getPosts selects all posts from Posts table if no filters are passed in
   * @param user
   * @returns
   */
  async getPosts(filters: GetPostsFilterDTO, user: User): Promise<Post[]> {
    const { status, search } = filters;
    const query = this.createQueryBuilder('post');
    if (user) {
      query.where({ user });
    }

    if (status) {
      query.andWhere('post.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where(
            'LOWER(post.title) LIKE LOWER(:search) OR LOWER(post.description) LIKE LOWER(:search)',
            { search: `%${search}%` },
          );
        }),
      );
    }
    try {
      //allows us to eager load metaOptions with the Post
      query.leftJoinAndSelect('post.metaOptions', 'metaoption');
      query.leftJoinAndSelect('post.author', 'user');
      query.leftJoinAndSelect('post.tags', 'tags');

      const posts = await query.getMany();
      return posts;
    } catch (error) {
      this.logger.error(
        `Error in getPosts() called with user ${JSON.stringify(user)} and search filters ${JSON.stringify(filters)}`,
        error,
      );
      throw new InternalServerErrorException();
    }
  }

  async getPostById(postId: string, user: User | null): Promise<Post> {
    this.logger.verbose(`Inside Posts Repository get post by Id: ${postId} `);
    try {
      this.find();
      const foundPost = await this.findOne({
        where: { id: postId },
      });

      if (!foundPost) {
        this.logger.error(
          `POST NOT FOUND: getPostById() called with user ${JSON.stringify(user)} and postId: ${postId}`,
          error,
        );
        throw new NotFoundException();
      }
      return foundPost;
    } catch (error) {
      this.logger.error(
        `Error in posts repository getPostById() called with user ${JSON.stringify(user)} and postId: ${postId}`,
        error,
      );
    }
  }

  async createPost(
    createPostDto: CreatePostDTO,
    author: User,
    tags: Tag[],
  ): Promise<Post> {
    const post = this.create({ ...createPostDto, author: author, tags: tags });

    try {
      this.logger.verbose('Saving Post to DB: ', post);
      await this.save(post);
      return post;
    } catch (error) {
      this.logger.error(
        `Error in createPost() saving post to DB and create post data: ${JSON.stringify(createPostDto)}`,
        error,
      );
      throw new InternalServerErrorException();
    }
  }

  /**
   * REMOVE POST BY ID
   * @param postId
   */
  async removePost(postId: string): Promise<void> {
    try {
      const result = await this.delete({ id: postId });

      if (result?.affected === 0) {
        throw new NotFoundException();
      }
    } catch (error) {
      this.logger.error(
        `Error in removePost() deleting post from DB post id: ${postId}`,
        error,
      );
      throw new InternalServerErrorException();
    }
  }

  async updatePostStatus(
    postId: string,
    postStatus: UpdatePostStatusDTO,
    user: User,
  ): Promise<Post> {
    try {
      const post = await this.getPostById(postId, user);

      post.status = postStatus.status;
      await this.save(post);
      return post;
    } catch (error) {
      this.logger.error(
        `Error in updatePostStatus() getting post by id or saving updated post status from DB for user ${JSON.stringify(user)} and  post id: ${postId}`,
        error,
      );
      throw new InternalServerErrorException();
    }
  }
}
