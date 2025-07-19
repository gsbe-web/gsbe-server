import { CloudinaryService } from '@cloudinary/cloudinary.service';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { getExamplesFromDto } from '@utils/helpers';
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended';
import { Model } from 'mongoose';

import { GetCalendarEventsDto } from './dto';
import { Event } from './entities';
import { EventsService } from './events.service';

describe('EventsService', () => {
  let service: EventsService;
  let eventModelMock: DeepMockProxy<Model<Event>>;
  let cloudinaryServiceMock: DeepMockProxy<CloudinaryService>;

  beforeEach(async () => {
    eventModelMock = mockDeep<Model<Event>>();
    cloudinaryServiceMock = mockDeep<CloudinaryService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: CloudinaryService, useValue: cloudinaryServiceMock },
        { provide: getModelToken(Event.name), useValue: eventModelMock },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    mockReset(eventModelMock);
    mockReset(cloudinaryServiceMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchCalendarEvents', () => {
    it('should return a list of calendar events', async () => {
      //arrange
      const data = [getExamplesFromDto(GetCalendarEventsDto)];
      const mockQuery = {
        select: jest.fn().mockResolvedValue(data),
      };

      eventModelMock.find.mockReturnValue(mockQuery as any);
      const today = new Date();

      //act
      const response = await service.getCalendarEvents(today);

      //assert
      expect(response).toEqual(data);
    });
  });
});
