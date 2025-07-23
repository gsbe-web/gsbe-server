import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

import { Currency } from '../enum';

export class CreateDueDto {
  @ApiProperty({
    example: 'John',
    description: 'The first name of the due payer',
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the due payer',
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    example: 'GSBE-2025-4823',
    description: 'The membership ID of the due payer',
  })
  @IsNotEmpty()
  @IsString()
  membershipId: string;

  @ApiProperty({
    example: 'email@example.com',
    description: 'The email of the due payer',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 200,
    description: 'The amount paid',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.1)
  amount: number;

  @ApiProperty({
    example: 'GHS',
    enum: Currency,
    description: 'The currency of the payment',
  })
  @IsNotEmpty()
  @IsEnum(Currency)
  currency: Currency;
}

export class MakePaymentDto extends PickType(CreateDueDto, [
  'amount',
  'currency',
]) {}
