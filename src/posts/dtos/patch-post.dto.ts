import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreatePostDTO } from './create-post.dto';

export class PatchPostDto extends PartialType(CreatePostDTO) {
  @ApiProperty({
    description: 'The ID of the post that needs to be updated',
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}
