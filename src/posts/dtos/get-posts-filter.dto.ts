import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PostStatus } from '../enums/postStatus.enum';
import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { PaginationQueryDTO } from 'src/common/pagination/pagination-query.dto';

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

export class GetPostsDTO extends IntersectionType(
  GetPostsFilterDTO,
  PaginationQueryDTO,
) {}
