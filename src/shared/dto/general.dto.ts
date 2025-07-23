import { faker } from '@faker-js/faker';
import { ApiResponseProperty } from '@nestjs/swagger';
import { createSlug } from '@shared/generator';

export class GenericResponseDto {
  @ApiResponseProperty({
    example: faker.database.mongodbObjectId(),
  })
  id: string;

  @ApiResponseProperty({
    example: createSlug(faker.book.title()),
  })
  slug: string;

  @ApiResponseProperty({
    example: new Date(),
  })
  createdAt: Date;

  @ApiResponseProperty({
    example: new Date(),
  })
  updatedAt: Date;
}
