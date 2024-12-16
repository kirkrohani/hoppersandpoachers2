import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class GetUserIdParamDTO {
  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  id?: number;
}
