import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PostStatus } from '../enums/postStatus.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetPostsFilterDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
}
