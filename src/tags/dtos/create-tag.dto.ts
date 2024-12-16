import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ERROR_MESSAGES } from 'src/utils/errors';

export class CreateTagDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(256)
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(512)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: ERROR_MESSAGES.SLUG_MESSAGE,
  })
  slug: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  @IsString()
  description?: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsJSON()
  schema?: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsUrl()
  @MaxLength(1024)
  featuredImageUrl?: string;
}
