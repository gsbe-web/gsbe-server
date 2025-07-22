import { PartialType } from '@nestjs/swagger';

import { CreateMemberDto } from './create.dto';

export class UpdateMemberDto extends PartialType(CreateMemberDto) {
  title: any;
}
