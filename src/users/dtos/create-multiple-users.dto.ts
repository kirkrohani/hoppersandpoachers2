import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateUserDTO } from './create-user.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UsersCreateMultipleDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUserDTO)
  @ApiProperty({
    type: 'array',
    required: true,
    items: {
      type: 'User',
    },
  })
  @IsNotEmpty()
  users: CreateUserDTO[];
}
