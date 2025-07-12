import { OmitType } from '@nestjs/swagger';

import { PublicationsDto } from './model.dto';

export class CreatePublicationDto extends OmitType(PublicationsDto, [
  'likes',
]) {}
