import { Injectable } from '@nestjs/common';
import { CreatePostDTO } from '../dtos/create-post.dto';
import { GetPostsFilterDTO } from '../dtos/get-posts-filter.dto';
import { PostsRepository } from '../posts.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { User } from '../../users/user.entity';
import { UsersService } from 'src/users/providers/users.service';
import { UpdatePostDTO } from '../dtos/update-post.dto';
import { TagsService } from 'src/tags/providers/tags.service';
import { UpdatePostStatusDTO } from '../dtos/update-post-status.dto';

@Injectable()
export class PostsService {
  constructor(
    /**
     * Inject PostsRepository
     */
    @InjectRepository(PostsRepository)
    private postsRepository: PostsRepository,

    /**
     * Inject User Service
     */
    private usersService: UsersService,

    /**
     * Inject Tags Service
     */
    private tagsService: TagsService,
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

    return this.postsRepository.createPost(createPostDto, author, tags);
  }

  /**
   * GET POSTS method retrieves all posts if no filters are passed in
   * @param filters
   * @returns Post[]
   */
  async getPosts(filters: GetPostsFilterDTO): Promise<Post[]> {
    return await this.postsRepository.getPosts(filters, null);
  }

  async getPostsByUser(
    filters: GetPostsFilterDTO,
    user: User,
  ): Promise<Post[]> {
    return await this.postsRepository.getPosts(filters, user);
  }

  async getPostById(postId: string): Promise<Post> {
    return await this.postsRepository.getPostById(postId, null);
  }

  /**
   * REMOVE POST BY ID
   * @param postId
   */
  async removePostById(postId: string): Promise<void> {
    await this.postsRepository.removePost(postId);
  }

  async updatePostStatus(
    postId: string,
    postStatus: UpdatePostStatusDTO,
    user: User,
  ): Promise<Post> {
    return await this.postsRepository.updatePostStatus(
      postId,
      postStatus,
      user,
    );
  }

  /**
   * UPDATE POST
   * @param updatePostDto
   * @returns updated Promise<Post>
   */
  async updatePost(updatePostDto: UpdatePostDTO): Promise<Post> {
    const tags = await this.tagsService.findTags(updatePostDto.tags);

    const post = await this.postsRepository.findOne({
      id: updatePostDto.id,
    });

    post.title = updatePostDto.title ?? post.title;
    post.content = updatePostDto.content ?? post.content;
    post.status = updatePostDto.status ?? post.status;
    post.postType = updatePostDto.postType ?? post.postType;
    post.slug = updatePostDto.slug ?? post.slug;
    post.featuredImageUrl =
      updatePostDto.featuredImageUrl ?? post.featuredImageUrl;
    post.publishedOn = updatePostDto.publishedOn ?? post.publishedOn;
    post.tags = tags;

    return await this.postsRepository.save(post);
  }
}
