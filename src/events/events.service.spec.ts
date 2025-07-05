import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleDriveService } from '../google-drive/google-drive.service';
import { getExamplesFromDto } from '../utils/helpers';
import { GetCalendarEventsDto } from './dto';
import { endOfMonth, startOfMonth } from 'date-fns';

describe('EventsService', () => {
  let service: EventsService;
  const prismaMock = mockDeep<PrismaClient>();
  const googleDriveServiceMock = mockDeep<GoogleDriveService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: GoogleDriveService, useValue: googleDriveServiceMock },
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
      const startDate = startOfMonth(today);
      const endDate = endOfMonth(today);

      //act
      const response = await service.getCalendarEvents(today);

      //assert
      expect(prismaMock.event.findMany).toHaveBeenCalledWith({
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          date: true,
          title: true,
          slug: true,
        },
      });
      expect(response).toEqual(response);
    });
  });
});
