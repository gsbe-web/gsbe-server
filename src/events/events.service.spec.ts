jest.mock('@shared/generator');

import { CloudinaryService } from '@cloudinary/cloudinary.service';
import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { createSlug } from '@shared/generator';
import { getExamplesFromDto } from '@utils/helpers';
import { UploadApiResponse } from 'cloudinary';
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended';
import mongoose, { Model } from 'mongoose';
import { Readable } from 'stream';

import { GetCalendarEventsDto, GetEventDto, UpdateEventDto } from './dto';
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

  describe('editEvent', () => {
    it('should update an event', async () => {
      // Arrange
      const data = getExamplesFromDto(GetEventDto);
      eventModelMock.findById.calledWith(data.id).mockResolvedValue(data);

      const payload = getExamplesFromDto(UpdateEventDto);
      payload.description = faker.food.description();
      payload.title = null;
      data.description = payload.description;

      eventModelMock.findByIdAndUpdate.mockResolvedValue(data);

      // Act
      const response = await service.editEvent(data.id, payload, null);

      // Assert
      expect(eventModelMock.findById).toHaveBeenCalled();
      expect(eventModelMock.findById).toHaveBeenCalledWith(data.id);
      expect(eventModelMock.findByIdAndUpdate).toHaveBeenCalled();
      expect(eventModelMock.findByIdAndUpdate).toHaveBeenCalledWith(
        data.id,
        payload,
        { new: true },
      );
      expect(response).toEqual(data);
    });

    it('should update a slug', async () => {
      // Arrange
      const data = getExamplesFromDto(GetEventDto);
      eventModelMock.findById.calledWith(data.id).mockResolvedValue(data);

      const payload = getExamplesFromDto(UpdateEventDto);
      payload.title = faker.book.title();
      const expectedSlug = createSlug(payload.title);
      (createSlug as jest.Mock).mockReturnValue(expectedSlug);
      data.title = payload.title;
      data.slug = expectedSlug;

      eventModelMock.findByIdAndUpdate.mockResolvedValue(payload);
      // Act
      const response = await service.editEvent(data.id, payload);
      // Assert
      expect(eventModelMock.findById).toHaveBeenCalled();
      expect(eventModelMock.findById).toHaveBeenCalledWith(data.id);
      expect(eventModelMock.findByIdAndUpdate).toHaveBeenCalled();
      expect(eventModelMock.findByIdAndUpdate).toHaveBeenCalledWith(
        data.id,
        payload,
        { new: true },
      );
      payload.slug = expectedSlug;
      expect(response).toEqual(payload);
    });

    it("should update an event's picture", async () => {
      // Arrange
      const data = getExamplesFromDto(GetEventDto);
      const payload = getExamplesFromDto(UpdateEventDto);
      payload.title = null;

      const file: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'image.jpeg',
        encoding: '7-bit',
        mimetype: 'text/plain',
        size: 68,
        stream: new Readable(),
        destination: 'cloudinary_assets',
        filename: 'image.jpeg',
        path: '/assets/cloudinary_assets',
        buffer: Buffer.from(faker.book.title()),
      };
      const publicId = faker.database.mongodbObjectId();
      const secureUrl = faker.image.url();

      eventModelMock.findById.calledWith(data.id).mockResolvedValue(data);

      cloudinaryServiceMock.updateFileContent
        .calledWith(file, data.imageId)
        .mockResolvedValue({
          public_id: publicId,
          secure_url: secureUrl,
        } as UploadApiResponse);

      eventModelMock.findByIdAndUpdate.mockResolvedValue({
        ...payload,
        imageId: publicId,
        imageUrl: secureUrl,
      });
      // Act
      const response = await service.editEvent(data.id, payload, file);

      // Assert
      expect(eventModelMock.findById).toHaveBeenCalled();
      expect(eventModelMock.findById).toHaveBeenCalledWith(data.id);
      expect(cloudinaryServiceMock.updateFileContent).toHaveBeenCalled();
      expect(cloudinaryServiceMock.updateFileContent).toHaveBeenCalledWith(
        file,
        data.imageId,
      );
      expect(eventModelMock.findByIdAndUpdate).toHaveBeenCalled();
      expect(eventModelMock.findByIdAndUpdate).toHaveBeenCalledWith(
        data.id,
        payload,
        { new: true },
      );
      expect(response).toEqual({
        ...payload,
        imageId: publicId,
        imageUrl: secureUrl,
      });
    });

    it('should throw a NotFoundException if event is not found', async () => {
      // Arrange
      const id = new mongoose.Types.ObjectId().toString();
      const payload = getExamplesFromDto(UpdateEventDto);
      eventModelMock.findById.calledWith(id).mockResolvedValue(null);
      try {
        // Act
        await service.editEvent(id, payload);
        fail('supposed to have thrown a NotFoundException');
      } catch (error) {
        // Assert
        expect(eventModelMock.findById).toHaveBeenCalled();
        expect(eventModelMock.findById).toHaveBeenCalledWith(id);
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('Event not found');
      }
    });
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
      const data = getExamplesFromDto(GetEventDto);
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
