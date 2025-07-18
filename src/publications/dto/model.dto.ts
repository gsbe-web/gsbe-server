import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString, MinDate } from 'class-validator';

export class PublicationsDto {
  @ApiResponseProperty({
    example: '66f4563bbf5de67f47ece4f5',
  })
  id: string;

  @ApiResponseProperty({
    example: 'healthcare-innovation-in-africa',
  })
  slug: string;

  @ApiProperty({
    example: new Date(new Date().getTime() + 24 * 60000),
    description: 'Publications date',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value && new Date(value))
  @IsDate()
  @MinDate(new Date())
  dateTimePosted: Date;

  @ApiProperty({
    example: 'Healthcare Innovation in Africa',
    description: 'Publications title',
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: `Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
    description: 'Publications body',
  })
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: 'The name of the blog author',
    description: 'Jane Smith',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: '/images/blogger_dp.jpeg',
    description: 'URL to the profile image of the author',
  })
  @IsString()
  profileImageUrl: string;

  @ApiResponseProperty({
    example: '1oUI7XZhMRUqwEeMSkpSJXCbqWlh8o13D',
  })
  postImageId: string;

  @ApiResponseProperty({
    example:
      'https://res.cloudinary.com/demo/image/upload/v1618849234/sample.jpg',
  })
  postImageUrl: string;

  @ApiResponseProperty({
    example: 150,
  })
  views: number;

  @ApiResponseProperty({
    example: 10,
  })
  comments: number;

  @ApiProperty({
    description: 'The updated like count for the Publications post',
    example: 30,
  })
  likes: number;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}
