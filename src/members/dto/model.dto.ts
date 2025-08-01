import {
  ApiProperty,
  ApiPropertyOptional,
  ApiResponseProperty,
} from '@nestjs/swagger';
import { GenericResponseDto } from '@shared/dto';
import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
} from 'class-validator';

export enum MemberType {
  EXECUTIVE = 'EXECUTIVE',
  GENERAL = 'GENERAL',
}
export class MemberDto extends GenericResponseDto {
  @ApiProperty({
    description: 'The type of member in the organization.',
    example: 'EXECUTIVE',
    enum: MemberType,
  })
  @IsNotEmpty()
  @IsEnum(MemberType)
  type: MemberType;

  @ApiProperty({
    description: 'Full name of the member.',
    example: 'Jane Doe',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The gender of the member',
    example: 'Female',
    enum: ['Male', 'Female'],
  })
  @IsNotEmpty()
  @IsIn(['Male', 'Female'])
  gender: 'Male' | 'Female';

  @ApiPropertyOptional({
    description:
      'Role or position held by the member (required for executives).',
    example: 'President',
  })
  @ValidateIf((o) => o.type === MemberType.EXECUTIVE)
  @IsOptional()
  role: string;

  @ApiPropertyOptional({
    description: 'Brief biography or description of the member.',
    example: 'Experienced leader with a background in project management.',
  })
  @IsOptional()
  description: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Profile image file for the member (optional, binary upload).',
  })
  @IsOptional()
  file: Express.Multer.File;

  @ApiPropertyOptional({
    description: 'Contact email address of the member.',
    example: 'jane.doe@example.com',
  })
  @IsOptional()
  email: string;

  @ApiPropertyOptional({
    description: 'LinkedIn profile URL of the member.',
    example: 'https://linkedin.com/in/janedoe',
  })
  @IsOptional()
  linkedinUrl: string;

  @ApiPropertyOptional({
    description: 'Twitter profile URL of the member.',
    example: 'https://twitter.com/janedoe',
  })
  @IsOptional()
  twitterUrl: string;

  @ApiPropertyOptional({
    description: 'Instagram profile URL of the member.',
    example: 'https://instagram.com/janedoe',
  })
  @IsOptional()
  instagramUrl: string;

  @ApiResponseProperty({
    example: 'img_12345',
  })
  imageId: string;

  @ApiResponseProperty({
    example: 'https://example.com/images/jane.jpg',
  })
  imageUrl: string;
}
