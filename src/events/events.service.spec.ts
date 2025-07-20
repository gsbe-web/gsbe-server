import { CloudinaryService } from '@cloudinary/cloudinary.service';
import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { getExamplesFromDto } from '@utils/helpers';
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended';
import mongoose, { Model } from 'mongoose';

import { GetCalendarEventsDto, GetEventsDto } from './dto';
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

  describe('deleteEvent', () => {
    it('should remove an event', async () => {
      // Arrange
      const data = getExamplesFromDto(GetEventsDto);
      eventModelMock.findByIdAndDelete
        .calledWith(data.id)
        .mockResolvedValue(data);
      cloudinaryServiceMock.deleteFile
        .calledWith(data.imageId)
        .mockResolvedValue(undefined);
      // Act
      const response = await service.deleteEventById(data.id);
      // Assert
      expect(eventModelMock.findByIdAndDelete).toHaveBeenCalled();
      expect(eventModelMock.findByIdAndDelete).toHaveBeenCalledWith(data.id);
      expect(cloudinaryServiceMock.deleteFile).toHaveBeenCalled();
      expect(cloudinaryServiceMock.deleteFile).toHaveBeenCalledWith(
        data.imageId,
      );
      expect(response).toEqual(true);
    });

    it('should throw an event if the id is not found', async () => {
      // Arrange
      const id = new mongoose.Types.ObjectId().toString();
      eventModelMock.findByIdAndDelete.calledWith(id).mockResolvedValue(null);
      cloudinaryServiceMock.deleteFile.mockResolvedValue(undefined);

      try {
        // Act
        await service.deleteEventById(id);
        fail('Expected NotFoundExceptionToBeThrown');
      } catch (error) {
        // Assert
        expect(eventModelMock.findByIdAndDelete).toHaveBeenCalled();
        expect(eventModelMock.findByIdAndDelete).toHaveBeenCalledWith(id);
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Event not found');
      }
    });
  });
});
