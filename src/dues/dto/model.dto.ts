import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { GenericResponseDto } from '@shared/dto';
import {
  IsDateString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class DueDto extends OmitType(GenericResponseDto, ['slug']) {
  @ApiProperty({
    description: 'First name of the member.',
    example: 'Ebenezer',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the member.',
    example: 'Domey',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Membership ID of the member.',
    example: 'MEM123456',
  })
  @IsString()
  membershipId: string;

  @ApiProperty({
    description: 'Email address of the member.',
    example: 'ebenezer@example.com',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'Payment reference code.',
    example: 'REF987654',
  })
  @IsString()
  @IsOptional()
  reference?: string;

  @ApiPropertyOptional({
    description: 'Currency of the payment.',
    example: 'GHS',
  })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({
    description: 'Amount paid.',
    example: 20000,
  })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiPropertyOptional({
    description: 'Status of the payment.',
    example: 'success',
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({
    description: 'Date and time payment was made.',
    example: '2025-07-23T07:05:06.000Z',
  })
  @IsDateString()
  @IsOptional()
  paidAt?: Date;

  @ApiPropertyOptional({
    description: 'Access code for the payment.',
    example: 'ACCESS123',
  })
  @IsString()
  @IsOptional()
  accessCode?: string;

  @ApiPropertyOptional({
    description: 'Authorization URL for the payment.',
    example: 'https://paystack.com/pay/abc123',
  })
  @IsString()
  @IsOptional()
  authorizationUrl?: string;

  @ApiPropertyOptional({
    description: 'Payment channel used.',
    example: 'mobile_money',
  })
  @IsString()
  @IsOptional()
  channel?: string;

  @ApiPropertyOptional({
    description: 'Payment method used.',
    example: 'paystack',
  })
  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @ApiPropertyOptional({
    description: 'Source number for mobile money.',
    example: '0551234567',
  })
  @IsString()
  @IsOptional()
  sourceNumber?: string;

  @ApiPropertyOptional({
    description: 'Bank name for the payment.',
    example: 'MTN',
  })
  @IsString()
  @IsOptional()
  bankName?: string;

  @ApiProperty({
    description: 'Payment provider.',
    example: 'paystack',
    default: 'paystack',
  })
  @IsString()
  provider: string;
}
