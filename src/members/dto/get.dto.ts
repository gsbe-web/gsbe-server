import { OmitType } from '@nestjs/swagger';

import { QueryDto } from '../../shared/dto/pagination.dto';
import { MemberDto } from './model.dto';

export class GetMemberDto extends OmitType(MemberDto, ['file']) {}

export class FindMembersQueryDto extends QueryDto {}
