import { CreateEventDto } from './dto/create-event.dto';
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Event } from '@prisma/client';
import { UpdateEventDto } from './dto/update-event.dto';
import { createSlug } from '../shared/generator';
import { QueryDto } from '../news/dto/pagination-query.dto';
import { PaginatedDataResponseDto } from '../utils/responses/success.responses';
import { GoogleDriveService } from '../google-drive/google-drive.service';

@Injectable()
export class EventsService {
  constructor(
    private readonly googleDriveService: GoogleDriveService,
    private prisma: PrismaService,
  ) {}

  async addEvent(
    dto: CreateEventDto,
    file: Express.Multer.File,
  ): Promise<Event> {
    try {
      const image = await this.googleDriveService.uploadFile(file);

      const fileId = image.fileId;

      // TODO::  save for later src={`https://drive.google.com/uc?export=view&id=${image.id}`}
      const slug: string = createSlug(dto.title);
      const event = await this.prisma.event.create({
        data: {
          slug,
          imageId: fileId,
          ...dto,
        },
      });
      return event;
    } catch (error) {
      if (error instanceof HttpException) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async editEvent(
    id: string,
    dto: UpdateEventDto,
    file: Express.Multer.File,
  ): Promise<Event> {
    try {
      const event = await this.prisma.event.findFirst({
        where: {
          id,
        },
      });

      if (!event) {
        throw new NotFoundException('Event not found');
      }

      if (file) {
        const newImage = await this.googleDriveService.updateFileContent(
          event.imageId,
          file,
        );
        dto.imageId = newImage.id;
      }

      // TODO::  save for later src={`https://drive.google.com/uc?export=view&id=${image.id}`}
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
    } catch (error) {
      if (error instanceof HttpException) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async getEvents(dto: QueryDto): Promise<PaginatedDataResponseDto<Event[]>> {
    try {
      const offset = (dto.page - 1) * dto.pageSize;
      if (dto.search && dto.searchFields) {
        const searchBodies = dto.searchFields.map((field) => ({
          [field]: {
            contains: dto.search,
            mode: 'insensitive',
          },
        }));
        dto.searchQueries = searchBodies;
      }
      const findOptions: object = {
        where: {
          OR: dto.searchQueries,
        },
        take: dto.pageSize,
        skip: offset,
        orderBy: {
          createdAt: 'desc',
        },
      };
      const events = await this.prisma.event.findMany({
        ...findOptions,
      });
      const eventsCount = await this.prisma.event.count({
        ...findOptions,
      });

      return new PaginatedDataResponseDto<Event[]>(
        events,
        dto.page,
        dto.pageSize,
        eventsCount,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async getEventById(id: string): Promise<Event> {
    try {
      const event = await this.prisma.event.findUnique({
        where: {
          id: id,
        },
      });

      if (!event) {
        throw new NotFoundException('Event not found');
      }

      return event;
    } catch (error) {
      if (error instanceof HttpException) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async getEventBySlug(slug: string): Promise<Event> {
    try {
      const event = await this.prisma.event.findFirst({
        where: {
          slug,
        },
      });

      if (!event) {
        throw new NotFoundException('Event not found');
      }

      return event;
    } catch (error) {
      if (error instanceof HttpException) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async deleteEventById(id: string) {
    try {
      const event = await this.prisma.event.findFirst({
        where: { id },
      });

      if (!event) {
        throw new NotFoundException('event not found');
      }

      const deleteEvent = await this.prisma.event.delete({
        where: { id },
      });
      await this.googleDriveService.deleteFile(deleteEvent.imageId);
      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }
}
