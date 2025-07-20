import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  ApiCreatedSuccessResponse,
  ApiDeletedSucessResponse,
  ApiOkResponsePaginated,
  ApiSuccessResponse,
} from '@shared/decorators';
import { GetParam, QueryDto } from '@shared/dto';
import {
  ApiSuccessResponseDto,
  ApiSuccessResponseNull,
  PaginatedDataResponseDto,
  throwError,
} from '@utils/responses';

import {
  CreateEventDto,
  GetCalendarEventsDto,
  GetCalendarEventsQueryDto,
  GetEventDto,
  UpdateEventDto,
} from './dto';
import { Event } from './entities';
import { EventsService } from './events.service';

@ApiTags('Events Controller')
@Controller('events')
export class EventsController {
  private logger = new Logger(EventsController.name);
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    description: 'Event details',
    type: CreateEventDto,
    required: true,
  })
  @ApiCreatedSuccessResponse({
    type: CreateEventDto,
    description: 'Event created successfully',
  })
  async saveEvent(
    @UploadedFile()
    file: Express.Multer.File,
    @Body() dto: CreateEventDto,
  ) {
    try {
      const response = await this.eventsService.addEvent(dto, file);
      return new ApiSuccessResponseDto<Event>(
        response,
        HttpStatus.CREATED,
        'Event created successfully',
      );
    } catch (error) {
      throwError(this.logger, error);
    }
  }

  //TODO:: Include validators to make sure only images are sent soon
  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    description: 'Event details',
    type: UpdateEventDto,
    required: true,
  })
  @ApiSuccessResponse({
    type: UpdateEventDto,
    description: 'Event updated successfully',
  })
  @HttpCode(HttpStatus.OK)
  async updateEvent(
    @Param() params: GetParam,
    @UploadedFile()
    file: Express.Multer.File,
    @Body() dto: UpdateEventDto,
  ) {
    try {
      const response = await this.eventsService.editEvent(params.id, dto, file);
      return new ApiSuccessResponseDto<Event>(
        response,
        HttpStatus.OK,
        'Event updated successfully',
      );
    } catch (error) {
      throwError(this.logger, error);
    }
  }

  @Get('calendar')
  @ApiSuccessResponse({
    type: GetCalendarEventsDto,
    isArray: true,
    description: 'Calendar Events retrieved succesfully',
  })
  async getCalendarEvents(@Query() query: GetCalendarEventsQueryDto) {
    try {
      const response = await this.eventsService.getCalendarEvents(query.date);
      return new ApiSuccessResponseDto(
        response,
        HttpStatus.OK,
        'Calendar Events retrieved successfully',
      );
    } catch (error) {
      throwError(this.logger, error);
    }
  }

  @Get()
  @ApiOkResponsePaginated({
    type: GetEventDto,
    description: 'Events retrieved succesfully',
  })
  async getEvents(@Query() dto: QueryDto) {
    try {
      const response = await this.eventsService.getEvents(dto);
      return new ApiSuccessResponseDto<PaginatedDataResponseDto<Event[]>>(
        response,
        HttpStatus.OK,
        'All Events retrieved successfully',
      );
    } catch (error) {
      throwError(this.logger, error);
    }
  }

  @Get(':id')
  @ApiSuccessResponse({
    type: GetEventDto,
    description: 'Event successfully retrieved',
  })
  async getEventById(@Param() param: GetParam) {
    try {
      const { id } = param;
      const response = await this.eventsService.getEventById(id);
      return new ApiSuccessResponseDto<Event>(
        response,
        HttpStatus.OK,
        `Event has been retrieved successfully`,
      );
    } catch (error) {
      throwError(this.logger, error);
    }
  }

  @Get('/slug/:slug')
  @ApiSuccessResponse({
    type: GetEventDto,
    description: 'Event successfully retrieved',
  })
  async getEventBySlug(@Param('slug') slug: string) {
    try {
      const response = await this.eventsService.getEventBySlug(slug);
      return new ApiSuccessResponseDto<Event>(
        response,
        HttpStatus.OK,
        `Event has been retrieved successfully`,
      );
    } catch (error) {
      throwError(this.logger, error);
    }
  }

  @Delete(':id')
  @ApiDeletedSucessResponse({
    description: 'Event deleted successfully',
  })
  async removeEvent(@Param() params: GetParam) {
    try {
      const _response = await this.eventsService.deleteEventById(params.id);
      return new ApiSuccessResponseNull(
        HttpStatus.OK,
        'Event deleted successfully',
      );
    } catch (error) {
      throwError(this.logger, error);
    }
  }
}
