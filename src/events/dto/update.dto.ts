import { PartialType } from '@nestjs/swagger';

import { CreateEventDto } from './create.dto';

export class UpdateEventDto extends PartialType(CreateEventDto) {}
