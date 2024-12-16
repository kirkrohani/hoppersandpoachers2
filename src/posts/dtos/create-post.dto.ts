import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { PostType } from '../enums/postType.enum';
import { PostStatus } from '../enums/postStatus.enum';
import { ERROR_MESSAGES } from '../../utils/errors';
import { CreateMetaOptionsDTO } from 'src/meta-options/dtos/create-post-meta-options.dto';
import { Type } from 'class-transformer';

export class CreatePostDTO {
  /**
   * Title
   */
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(512)
  title: string;

  /**
   * Description
   */
  @IsString()
  @IsOptional()
  @ApiProperty()
  @IsString()
  @MinLength(12)
  @MaxLength(512)
  description?: string;

  /**
   * Post Type
   */
  @IsEnum(PostType)
  @IsNotEmpty()
  @ApiProperty({
    enum: PostType,
  })
  postType: PostType;

  /**
   * Slug
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(256)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: ERROR_MESSAGES.SLUG_MESSAGE,
  })
  slug: string;

  /**
   * Status
   * Type: Enum
   */
  @IsEnum(PostStatus)
  @IsNotEmpty()
  @ApiProperty({
    enum: PostStatus,
  })
  status: PostStatus;

  /**
   * Content
   */
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  content?: string;

  /**
   * Schema
   */
  @IsOptional()
  @ApiPropertyOptional()
  @IsJSON()
  schema?: string;

  /**
   * Featured Image URL
   */
  @IsOptional()
  @ApiPropertyOptional()
  @IsUrl()
  @MaxLength(1024)
  featuredImageUrl?: string;

  /**
   * Published On
   * Type: Date
   */
  @IsISO8601()
  @IsOptional()
  @ApiPropertyOptional()
  publishedOn?: Date;

  /**
   * Tags
   * Type: number[]
   */
  @IsOptional()
  @ApiPropertyOptional()
  @IsArray()
  tags?: string[];

  /**
   * Meta Options
   * Type: CreateMetaOptionsDTO
   */
  @IsOptional()
  @ApiPropertyOptional({
    type: 'object',
    required: false,
    items: {
      type: 'object',
      properties: {
        metavalue: {
          type: 'json',
          description: 'The metaValue is a JSON string',
          example: '{"sidebarEnabled": true,}',
        },
      },
    },
  })
  @ValidateNested({ each: true })
  @Type(() => CreateMetaOptionsDTO)
  metaOptions?: CreateMetaOptionsDTO | null;

  @IsString()
  @IsOptional()
  parentId?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'uuid',
    required: true,
  })
  authorId: string;
}
