import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsNotEmpty } from 'class-validator';

export class CreateMetaOptionsDTO {
  @IsNotEmpty()
  @IsJSON()
  @ApiProperty()
  metaValue: string;
}
