import { PickType } from '@nestjs/swagger';

import { PublicationsDto } from './model.dto';

export class GetLikesDto extends PickType(PublicationsDto, ['likes']) {}

export class GetPublicationDto extends PublicationsDto {}
