import { PartialType, PickType } from '@nestjs/swagger';

import { CreatePublicationDto } from './create.dto';
import { PublicationsDto } from './model.dto';

export class UpdatePublicationDto extends PartialType(CreatePublicationDto) {}

export class UpdateLikesDto extends PartialType(
  PickType(PublicationsDto, ['likes']),
) {}
