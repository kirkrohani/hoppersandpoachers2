import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Patch,
  Query,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { CreatePostDTO } from './dtos/create-post.dto';
import { GetPostsDTO, GetPostsFilterDTO } from './dtos/get-posts-filter.dto';
import { UpdatePostStatusDTO } from './dtos/update-post-status.dto';
import { Post as PostMessage } from './post.entity';
import { GetUser } from 'src/users/get-user.decorator';
import { User } from '../users/user.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdatePostDTO } from './dtos/update-post.dto';

@Controller('posts')
@ApiTags('POSTS')
export class PostsController {
  private logger = new Logger('PostsController');

  constructor(private postsService: PostsService) {}

  @Get('/all')
  getPosts(@Query() postQuery: GetPostsDTO): Promise<PostMessage[]> {
    console.log('postQuery: ', postQuery);

    return this.postsService.getPosts(postQuery, null);
  }

  @Get()
  getPostsByUser(
    @Query() filters: GetPostsDTO,
    @GetUser() user: User,
  ): Promise<PostMessage[]> {
    this.logger.verbose(`${user.username} called getPostsByUser().`);
    return this.postsService.getPostsByUser(filters, user);
  }

  @Get('/:postId')
  getPostById(@Param('postId') postId: string): Promise<PostMessage> {
    this.logger.verbose(`getPostsById() for post id: ${postId}`);
    const post = this.postsService.getPostById(postId);
    return post;
  }

  /**
   * CREATE POST
   * @param createPostDTO
   * @returns PostMessage
   */
  @ApiResponse({
    status: 201,
    description: 'You receive a 201 if post was created successfully',
  })
  @ApiOperation({
    summary: 'create a new blog post',
  })
  @Post()
  createPost(@Body() createPostDTO: CreatePostDTO): Promise<PostMessage> {
    this.logger.verbose(' Posts Controller createPost() method. ');
    return this.postsService.createPost(createPostDTO);
  }

  /**
   * DELETE POST
   * @param postId
   * @returns void
   */
  @ApiResponse({
    status: 200,
    description:
      'You receive a 200 if the post and its meta-option was successfully deleted',
  })
  @ApiOperation({
    summary: 'delete a post',
  })
  @Delete('/:postId')
  removePostById(@Param('postId') postId: string): Promise<void> {
    this.logger.verbose(` Posts Controller remove post id: ${postId}`);
    return this.postsService.removePostById(postId);
  }

  /**
   * UPDATE POST STATUS
   * @param postId
   * @param postStatus
   * @param user
   * @returns Post
   */
  @Patch('/:postId/status')
  updatePostStatus(
    @Param('postId') postId: string,
    @Body() postStatus: UpdatePostStatusDTO,
    @GetUser() user: User,
  ): Promise<PostMessage> {
    this.logger.verbose(
      `${user.username} called updatePostStatus() to status: ${JSON.stringify(postStatus)}`,
    );
    return this.postsService.updatePostStatus(postId, postStatus, user);
  }

  /**
   * UPDATE POST
   * @param updatePostDto
   * @returns updated Post Object
   */
  @ApiResponse({
    status: 200,
    description: 'You receive a 200 if post was updated successfully',
  })
  @ApiOperation({
    summary: 'update an existing blog post',
  })
  @Patch()
  async updatePost(@Body() updatePostDto: UpdatePostDTO): Promise<PostMessage> {
    this.logger.verbose(
      'Posts Controller - updatePost() method ',
      updatePostDto,
    );
    return this.postsService.updatePost(updatePostDto);
  }
}
