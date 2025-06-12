import { IsOptional, IsPositive, IsInt } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryDto {
  @ApiPropertyOptional({ description: 'Page number', default: 1, example: 1 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    default: 5,
    example: 5,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  pageSize: number = 5;
}
