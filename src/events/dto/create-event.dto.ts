import {
  ApiProperty,
  ApiPropertyOptional,
  ApiResponseProperty,
} from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, MinDate } from 'class-validator';

export class CreateEventDto {
  @ApiResponseProperty({
    example: '66ea4674fc8f7bc2668164c4',
  })
  id: string;

  @ApiResponseProperty({
    example: '1st-african-regional-biomedical-engineering-conference-kenya',
  })
  slug: string;

  @ApiResponseProperty({
    example: '1327IpVY9E0mF9hzb5vO01LRwPnB0_fjI',
  })
  imageId: string;

  @ApiProperty({
    example: '1st African Regional Biomedical Engineering Conference Kenya',
    description: 'The title of the event',
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: new Date(new Date().getTime() + 24 * 60000),
    description: 'The date set for the event',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value && new Date(value))
  @IsDate()
  @MinDate(new Date())
  date: Date;

  @ApiProperty({
    example: 'Techiman area',
    description: 'The location where the event will be held',
  })
  @IsNotEmpty()
  location: string;

  @ApiPropertyOptional({
    example: 'This is some description for some data',
    description: 'The description of an event',
  })
  @IsOptional()
  description: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}
