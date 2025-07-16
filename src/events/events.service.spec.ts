import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';

import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaService } from '../prisma/prisma.service';
import { getExamplesFromDto } from '../utils/helpers';
import { GetCalendarEventsDto } from './dto';
import { EventsService } from './events.service';

describe('EventsService', () => {
  let service: EventsService;
  const prismaMock = mockDeep<PrismaClient>();
  const cloudinaryServiceMock = mockDeep<CloudinaryService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: CloudinaryService, useValue: cloudinaryServiceMock },
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchCalendarEvents', () => {
    it('should return a list of calendar events', async () => {
      //arrange
      const data = [getExamplesFromDto(GetCalendarEventsDto)];
      prismaMock.event.findMany.mockResolvedValue(data as any);
      const today = new Date();

      //act
      const response = await service.getCalendarEvents(today);

      //assert
      expect(response).toEqual(data);
    });
  });
});
