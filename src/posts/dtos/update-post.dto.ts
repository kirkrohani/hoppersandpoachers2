import { CreatePostDTO } from './create-post.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePostDTO extends PartialType(CreatePostDTO) {
  @ApiProperty({
    description: 'UUID in database',
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}
