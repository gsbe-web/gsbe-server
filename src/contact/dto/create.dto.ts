import { faker } from '@faker-js/faker/.';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({
    example: faker.person.fullName(),
    description: 'The full name of the sender',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: faker.internet.email(),
    description: 'The email of the sender',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: faker.book.title(),
    description: 'The subject of the message being sent',
  })
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    example: faker.phone.number({ style: 'international' }),
    description: 'The phone number of the sender',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({
    example: faker.food.description(),
    description: 'The message body',
  })
  @IsNotEmpty()
  message: string;
}
