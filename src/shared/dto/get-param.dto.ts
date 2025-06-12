import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class GetParam {
  @ApiProperty({
    example: '66ea4674fc8f7bc2668164c4',
    description: 'id of the item to be retrieved',
  })
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}
