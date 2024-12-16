import { IsEnum } from 'class-validator';
import { PostStatus } from '../enums/postStatus.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostStatusDTO {
  @ApiProperty()
  @IsEnum(PostStatus)
  status: PostStatus;
}
