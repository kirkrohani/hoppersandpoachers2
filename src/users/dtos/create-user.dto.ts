import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ERROR_MESSAGES } from '../../utils/errors';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  /** USERNAME */
  @ApiProperty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @IsNotEmpty()
  username: string;

  /** PASSWORD */
  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: ERROR_MESSAGES.PASSWORD_NOT_STRONG,
  })
  @IsNotEmpty()
  password: string;

  /** FIRSTNAME */
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(96)
  firstname: string;

  /** LASTNAME */
  @ApiProperty()
  @IsOptional()
  @MinLength(3)
  @MaxLength(96)
  lastname: string;

  /** EMAIL */
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(96)
  email: string;
}
