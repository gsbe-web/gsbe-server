import {
  IsOptional,
  IsPositive,
  IsInt,
  IsString,
  IsArray,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

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

  @ApiPropertyOptional({
    description: 'Pass in search keyword',
    example: 'Search for',
  })
  @IsOptional()
  @IsString()
  search: string;

  @ApiPropertyOptional({
    description: 'The fields to be searched in',
    example: 'Search for',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  searchFields: string[];

  searchQueries: object[] = [];
}
