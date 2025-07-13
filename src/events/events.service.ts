import { Injectable, NotFoundException } from '@nestjs/common';
import { Event } from '@prisma/client';
import { endOfMonth, startOfMonth } from 'date-fns';

import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from '../shared/dto/pagination.dto';
import { createSlug } from '../shared/generator';
import { generateFilter } from '../utils/helpers';
import { PaginatedDataResponseDto } from '../utils/responses/success.responses';
import { GetCalendarEventsDto } from './dto';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private prisma: PrismaService,
  ) {}

  async addEvent(
    dto: CreateEventDto,
    file: Express.Multer.File,
  ): Promise<Event> {
    const image = await this.cloudinaryService.uploadFile(file);
    const fileId = image.public_id;

    const slug: string = createSlug(dto.title);
    const event = await this.prisma.event.create({
      data: {
        slug,
        imageId: fileId,
        imageUrl: image.secure_url,
        ...dto,
      },
    });
    return event;
  }

  async editEvent(
    id: string,
    dto: UpdateEventDto,
    file: Express.Multer.File,
  ): Promise<Event> {
    const event = await this.prisma.event.findFirst({
      where: {
        id,
      },
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    if (file) {
      const newImage = await this.cloudinaryService.updateFileContent(
        file,
        event.imageId,
      );
      dto.imageId = newImage.public_id;
      dto.imageUrl = newImage.secure_url;
    }
    if (dto.title) {
      const slug: string = dto.title && createSlug(dto.title);
      dto.slug = slug;
    }
    const updatedEvent = await this.prisma.event.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });
    return updatedEvent;
  }

  async getEvents(dto: QueryDto): Promise<PaginatedDataResponseDto<Event[]>> {
    const queryFilter = generateFilter(dto);

    const findOptions: object = {
      where: {
        ...queryFilter.searchFilter,
      },
      ...queryFilter.pageFilter,
    };
    const events = await this.prisma.event.findMany({
      ...findOptions,
    });

    const eventsCount = await this.prisma.event.count({
      where: {
        ...queryFilter.searchFilter,
      },
    });
    return new PaginatedDataResponseDto<Event[]>(
      events,
      dto.page,
      dto.pageSize,
      eventsCount,
    );
  }

  async getEventById(id: string): Promise<Event> {
    const event = await this.prisma.event.findUnique({
      where: {
        id: id,
      },
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async getEventBySlug(slug: string): Promise<Event> {
    const event = await this.prisma.event.findFirst({
      where: {
        slug,
      },
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async getCalendarEvents(date: Date): Promise<GetCalendarEventsDto[]> {
    const startDate = startOfMonth(date);
    const endDate = endOfMonth(date);
    const calendarEvents = await this.prisma.event.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        date: true,
        title: true,
        slug: true,
      },
    });
    return calendarEvents;
  }

  async deleteEventById(id: string) {
    const event = await this.prisma.event.findFirst({
      where: { id },
    });
    if (!event) {
      throw new NotFoundException('event not found');
    }
    const _deleteEvent = await this.prisma.event.delete({
      where: { id },
    });
    await this.cloudinaryService.deleteFile(event.imageId);
    return true;
  }
}
