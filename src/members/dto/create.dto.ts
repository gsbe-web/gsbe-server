import { OmitType } from '@nestjs/swagger';

import { MemberDto } from './model.dto';

export class CreateMemberDto extends OmitType(MemberDto, [
  'createdAt',
  'updatedAt',
  'id',
]) {}
