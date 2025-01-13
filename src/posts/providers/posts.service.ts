import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreatePostDTO } from '../dtos/create-post.dto';
import { GetPostsFilterDTO } from '../dtos/get-posts-filter.dto';
import { GetPostsDTO } from '../dtos/get-posts-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { User } from '../../users/user.entity';
import { UsersService } from 'src/users/providers/users.service';
import { UpdatePostDTO } from '../dtos/update-post.dto';
import { TagsService } from 'src/tags/providers/tags.service';
import { UpdatePostStatusDTO } from '../dtos/update-post-status.dto';
import { ERROR_MESSAGES } from 'src/utils/errors';
import { Repository, Brackets } from 'typeorm';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { iPaginated } from 'src/common/pagination/interfaces/pagination.interface';
@Injectable()
export class PostsService {
  private logger = new Logger('PostsService', { timestamp: true });

  constructor(
    /**
     * Inject PostsRepository
     */
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    /**
     * Inject User Service
     */
    private usersService: UsersService,

    /**
     * Inject Tags Service
     */
    private tagsService: TagsService,

    /**
     * Inject Pagination Provider
     */
    private readonly paginationProvider: PaginationProvider,
  ) {}

  /**
   *
   * CREATE POST Method which creates new posts
   * @param createPostDto
   * @param user
   * @returns
   */
  async createPost(createPostDto: CreatePostDTO): Promise<Post> {
    //Find User obj from db
    const author = await this.usersService.findOneById(createPostDto.authorId);

    //Get all Tags objects from DB
    const tags = await this.tagsService.findTags(createPostDto.tags);

    const post = this.postsRepository.create({
      ...createPostDto,
      author: author,
      tags: tags,
    });

    try {
      this.logger.verbose('Saving Post to DB: ', post);
      await this.postsRepository.save(post);
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
   * GET POSTS method retrieves all posts if no filters are passed in
   * @param filters
   * @returns Post[]
   */
  async getPosts(
    postQuery: GetPostsDTO,
    user: User,
  ): Promise<iPaginated<Post>> {
    const paginatedPosts = await this.paginationProvider.paginateQuery(
      {
        limit: postQuery.limit,
        page: postQuery.page,
      },
      this.postsRepository,
    );

    return paginatedPosts;
  }

  async getPostsByUser(
    filters: GetPostsFilterDTO,
    user: User,
  ): Promise<Post[]> {
    const { status, search } = filters;
    const query = this.postsRepository.createQueryBuilder('post');
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

  async getPostById(postId: string): Promise<Post> {
    this.logger.verbose(`Inside Posts Repository get post by Id: ${postId} `);
    try {
      this.postsRepository.find();
      const foundPost = await this.postsRepository.findOne({
        where: { id: postId },
      });

      if (!foundPost) {
        this.logger.error(
          `POST NOT FOUND: getPostById() called  postId: ${postId}`,
        );
        throw new NotFoundException();
      }
      return foundPost;
    } catch (error) {
      this.logger.error(
        `Error in posts repository getPostById() called and postId: ${postId}`,
        error,
      );
    }
  }

  /**
   * REMOVE POST BY ID
   * @param postId
   */
  async removePostById(postId: string): Promise<void> {
    try {
      const result = await this.postsRepository.delete({ id: postId });

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
      const post = await this.getPostById(postId);

      post.status = postStatus.status;
      await this.postsRepository.save(post);
      return post;
    } catch (error) {
      this.logger.error(
        `Error in updatePostStatus() getting post by id or saving updated post status from DB for user ${JSON.stringify(user)} and  post id: ${postId}`,
        error,
      );
      throw new InternalServerErrorException();
    }
  }

  /**
   * UPDATE POST
   * @param updatePostDto
   * @returns updated Promise<Post>
   */
  async updatePost(updatePostDto: UpdatePostDTO): Promise<Post> {
    let tags = undefined;
    let post = undefined;
    tags = await this.tagsService.findTags(updatePostDto.tags);

    if (!tags || tags?.length !== updatePostDto.tags?.length) {
      throw new BadRequestException(ERROR_MESSAGES.TAGS_NOT_CORRECT);
    }

    post = await this.getPostById(updatePostDto.id);
    if (!post) {
      throw new BadRequestException(ERROR_MESSAGES.POST_NOT_FOUND);
    }

    post.title = updatePostDto.title ?? post.title;
    post.content = updatePostDto.content ?? post.content;
    post.status = updatePostDto.status ?? post.status;
    post.postType = updatePostDto.postType ?? post.postType;
    post.slug = updatePostDto.slug ?? post.slug;
    post.featuredImageUrl =
      updatePostDto.featuredImageUrl ?? post.featuredImageUrl;
    post.publishedOn = updatePostDto.publishedOn ?? post.publishedOn;
    post.tags = tags;

    try {
      return await this.postsRepository.save(post);
    } catch (error) {
      throw new RequestTimeoutException(ERROR_MESSAGES.UNABLE_TO_PROCESS);
    }
  }
}
