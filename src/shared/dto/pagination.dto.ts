import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class QueryDto {
  @ApiPropertyOptional({ description: 'Page number', default: 1, example: 1 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    default: 10,
    example: 10,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  pageSize: number = 10;

  @ApiPropertyOptional({
    description: 'Pass in search keyword',
  })
  @IsOptional()
  @IsString()
  search: string;

  @ApiPropertyOptional({
    description: 'The fields to be searched in',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  searchFields: string[];

  searchQueries: object[] = [];
}
