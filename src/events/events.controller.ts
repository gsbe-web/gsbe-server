import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Delete,
  Query,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  ApiSuccessResponseDto,
  ApiSuccessResponseNull,
  PaginatedDataResponseDto,
} from '../utils/responses/success.responses';
import { Event } from '@prisma/client';
import {
  ApiCreatedSuccessResponse,
  ApiDeletedSucessResponse,
  ApiSuccessResponse,
} from '../shared/decorators/success-response.decorator';
import { GetParam } from '../shared/dto/get-param.dto';
import { CreateEventDto, GetEventsDto, UpdateEventDto } from './dto';
import { ApiOkResponsePaginated } from '../shared/decorators/paginated-response.decorator';
import { QueryDto } from '../news/dto/pagination-query.dto';

@ApiTags('Events Controller')
@Controller('events')
export class EventsController {
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
    const response = await this.eventsService.addEvent(dto, file);
    return new ApiSuccessResponseDto<Event>(
      response,
      HttpStatus.CREATED,
      'Event created successfully',
    );
  }

  //TODO:: Include validators to make sure only images are sent
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
    const response = await this.eventsService.editEvent(params.id, dto, file);
    return new ApiSuccessResponseDto<Event>(
      response,
      HttpStatus.OK,
      'Event updated successfully',
    );
  }

  @Get()
  @ApiOkResponsePaginated({
    type: GetEventsDto,
    description: 'Events retrieved succesfully',
  })
  async getEvents(@Query() dto: QueryDto) {
    const response = await this.eventsService.getEvents(dto);
    return new ApiSuccessResponseDto<PaginatedDataResponseDto<Event[]>>(
      response,
      HttpStatus.OK,
      'All Events retrieved successfully',
    );
  }

  @Get(':id')
  @ApiSuccessResponse({
    type: GetEventsDto,
    description: 'Event successfully retrieved',
  })
  async getEventById(@Param('id') id: string) {
    const response = await this.eventsService.getEventById(id);
    return new ApiSuccessResponseDto<Event>(
      response,
      HttpStatus.OK,
      `Event with id: ${id} has been retrieved`,
    );
  }

  @Get('/slug/:slug')
  @ApiSuccessResponse({
    type: GetEventsDto,
    description: 'Event successfully retrieved',
  })
  async getEventBySlug(@Param('slug') slug: string) {
    const response = await this.eventsService.getEventBySlug(slug);
    return new ApiSuccessResponseDto<Event>(
      response,
      HttpStatus.OK,
      `Event with id: ${slug} has been retrieved`,
    );
  }

  @Delete(':id')
  @ApiDeletedSucessResponse({
    description: 'Event deleted successfully',
  })
  async removeEvent(@Param() params: GetParam) {
    const _response = await this.eventsService.deleteEventById(params.id);
    return new ApiSuccessResponseNull(
      HttpStatus.OK,
      'event deleted successfully',
    );
  }
}
