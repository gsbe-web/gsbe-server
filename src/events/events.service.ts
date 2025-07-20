import { CloudinaryService } from '@cloudinary/cloudinary.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QueryDto } from '@shared/dto';
import { createSlug } from '@shared/generator';
import { generateFilter } from '@utils/helpers';
import { PaginatedDataResponseDto } from '@utils/responses';
import { endOfMonth, startOfMonth } from 'date-fns';
import { Model } from 'mongoose';

import { CreateEventDto, UpdateEventDto } from './dto';
import { Event } from './entities';

@Injectable()
export class EventsService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    @InjectModel(Event.name) private eventModel: Model<Event>,
  ) {}

  async addEvent(
    dto: CreateEventDto,
    file: Express.Multer.File,
  ): Promise<Event> {
    const image = await this.cloudinaryService.uploadFile(file);
    dto.imageId = image.public_id;
    dto.imageUrl = image.secure_url;

    dto.slug = createSlug(dto.title);

    const event = await this.eventModel.create({ ...dto });
    return event;
  }

  async editEvent(
    id: string,
    dto: UpdateEventDto,
    file: Express.Multer.File,
  ): Promise<Event> {
    const event = await this.eventModel.findById(id);
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
    const updatedEvent = await this.eventModel.findByIdAndUpdate(id, {
      ...dto,
    });
    return updatedEvent;
  }

  async getEvents(dto: QueryDto): Promise<PaginatedDataResponseDto<Event[]>> {
    const queryFilter = generateFilter(dto);
    const events = await this.eventModel
      .find({
        ...queryFilter.searchFilter,
      })
      .skip(queryFilter.pageFilter.skip)
      .limit(queryFilter.pageFilter.take)
      .sort(queryFilter.pageFilter.orderBy);

    const eventsCount = await this.eventModel.countDocuments({
      ...queryFilter.searchFilter,
    });

    return new PaginatedDataResponseDto<Event[]>(
      events,
      dto.page,
      dto.pageSize,
      eventsCount,
    );
  }

  async getEventById(id: string): Promise<Event> {
    const event = await this.eventModel.findById(id);
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async getEventBySlug(slug: string): Promise<Event> {
    const event = await this.eventModel.findOne({ slug });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async getCalendarEvents(date: Date): Promise<Event[]> {
    const startDate = startOfMonth(date);
    const endDate = endOfMonth(date);
    const calendarEvents = await this.eventModel
      .find({
        date: { $gte: startDate, $lte: endDate },
      })
      .select('date title slug');
    return calendarEvents;
  }

  async deleteEventById(id: string) {
    const event = await this.eventModel.findByIdAndDelete(id);
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    await this.cloudinaryService.deleteFile(event.imageId);
    return true;
  }
}
