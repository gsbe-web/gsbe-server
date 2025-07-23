import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class GetParam {
  @ApiProperty({
    example: faker.database.mongodbObjectId(),
    description: 'id of the resource to be retrieved',
  })
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}
