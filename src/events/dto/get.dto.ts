import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';
import { addMinutes } from 'date-fns';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class GetEventsDto extends CreateEventDto {}

export class GetCalendarEventsQueryDto {
  @ApiProperty({ example: new Date() })
  @IsNotEmpty()
  @Type(() => Date)
  date: Date;
}

export class GetCalendarEventsDto {
  @ApiResponseProperty({
    example: '66ea4674fc8f7bc2668164c4',
  })
  id: string;

  @ApiResponseProperty({
    example: addMinutes(new Date(), 24),
  })
  date: Date;

  @ApiResponseProperty({
    example: '1st African Regional Biomedical Engineering Conference Kenya',
  })
  title: string;

  @ApiResponseProperty({
    example: '1st-african-regional-biomedical-engineering-conference-kenya',
  })
  slug: string;
}
