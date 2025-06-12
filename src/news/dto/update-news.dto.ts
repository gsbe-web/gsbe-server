import { PartialType, PickType } from '@nestjs/swagger';
import { GetNewsDto } from './get-news.dto';
import { CreateNewsDto } from './create-news.dto';

export class UpdateNewsDto extends PartialType(CreateNewsDto) {}

export class UpdateLikesDto extends PartialType(
  PickType(GetNewsDto, ['likes']),
) {}
