import { OmitType } from '@nestjs/swagger';
import { GetNewsDto } from './get-news.dto';

export class CreateNewsDto extends OmitType(GetNewsDto, ['likes']) {}
