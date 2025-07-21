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

import {
  CreateMemberDto,
  FindMembersQueryDto,
  GetMemberDto,
  MemberDto,
  UpdateMemberDto,
} from './dto';
import { Member } from './entities';
import { MembersService } from './members.service';

describe('MembersService', () => {
  let service: MembersService;
  let memberMock: DeepMockProxy<Model<Member>> = mockDeep<Model<Member>>();
  let cloudinaryServiceMock: DeepMockProxy<CloudinaryService> =
    mockDeep<CloudinaryService>();

  beforeEach(async () => {
    memberMock = mockDeep<Model<Member>>();
    cloudinaryServiceMock = mockDeep<CloudinaryService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembersService,
        {
          provide: getModelToken(Member.name),
          useValue: memberMock,
        },
        {
          provide: CloudinaryService,
          useValue: cloudinaryServiceMock,
        },
      ],
    }).compile();

    service = module.get<MembersService>(MembersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    mockReset(memberMock);
    mockReset(cloudinaryServiceMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a member', async () => {
    // Arrange
    const payload = getExamplesFromDto(CreateMemberDto);
    const file: Express.Multer.File = {
      fieldname: 'file',
      encoding: '7-bit',
      originalname: 'test.jpeg',
      mimetype: 'text/plain',
      size: 13,
      destination: '',
      filename: '',
      stream: new Readable(),
      path: '',
      buffer: Buffer.from('Hello World'),
    };
    const data = getExamplesFromDto(MemberDto);

    cloudinaryServiceMock.uploadFile.mockResolvedValue({
      public_id: data.imageId,
      secure_url: data.imageUrl,
    } as UploadApiResponse);
    (createSlug as jest.Mock).mockReturnValue(data.slug);
    memberMock.create.mockResolvedValue(data as any);

    // Act
    const response = await service.create(payload, file);

    // Assert
    expect(cloudinaryServiceMock.uploadFile).toHaveBeenCalledWith(file);
    expect(memberMock.create).toHaveBeenCalledWith(payload);
    expect(response).toEqual(data);

    (createSlug as jest.Mock).mockRestore();
  });

  describe('fetchMembers', () => {
    it('should return a paginated list of members', async () => {
      // Arrange
      const data = [getExamplesFromDto(GetMemberDto)];
      const mockQuery = {
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(data),
      };
      memberMock.find.mockReturnValue(mockQuery as any);
      memberMock.countDocuments.mockResolvedValue(data.length);
      const query = getExamplesFromDto(FindMembersQueryDto);

      // Act
      const response = await service.findAll(query);

      // Assert
      expect(response).toEqual({ rows: data, count: data.length });
    });
  });

  describe('fetchMember', () => {
    it('should return a member based on its id', async () => {
      // Arrange
      const data = getExamplesFromDto(GetMemberDto);
      memberMock.findById.mockResolvedValue(data);

      // Act
      const response = await service.findOneById(data.id);

      // Assert
      expect(memberMock.findById).toHaveBeenCalled();
      expect(memberMock.findById).toHaveBeenCalledWith(data.id);
      expect(response).toEqual(data);
    });

    it('should throw an error if member by id is not found', async () => {
      // Arrange
      const id = new mongoose.Types.ObjectId().toString();
      memberMock.findById.calledWith(id).mockResolvedValue(null);

      try {
        // Act
        await service.findOneById(id);
        fail('Expected NotFoundExceptionToBeThrown');
      } catch (error) {
        // Assert
        expect(memberMock.findById).toHaveBeenCalled();
        expect(memberMock.findById).toHaveBeenCalledWith(id);
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Member not found');
      }
    });

    it('should return a member based on its slug', async () => {
      // Arrange
      const data = getExamplesFromDto(GetMemberDto);
      memberMock.findOne.mockResolvedValue(data);

      // Act
      const response = await service.findOneBySlug(data.slug);

      // Assert
      expect(memberMock.findOne).toHaveBeenCalled();
      expect(memberMock.findOne).toHaveBeenCalledWith({ slug: data.slug });
      expect(response).toEqual(data);
    });

    it('should throw an error if member by slug is not found', async () => {
      // Arrange
      const slug = createSlug(faker.book.title());
      memberMock.findOne.calledWith({ slug }).mockResolvedValue(null);

      try {
        // Act
        await service.findOneBySlug(slug);
        fail('Expected NotFoundExceptionToBeThrown');
      } catch (error) {
        // Assert
        expect(memberMock.findOne).toHaveBeenCalled();
        expect(memberMock.findOne).toHaveBeenCalledWith({ slug });
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Member not found');
      }
    });
  });

  describe('editMember', () => {
    it('should update a member', async () => {
      // Arrange
      const data = getExamplesFromDto(GetMemberDto);
      memberMock.findById.calledWith(data.id).mockResolvedValue(data);

      const payload = getExamplesFromDto(UpdateMemberDto);
      payload.description = faker.food.description();
      payload.name = null;
      data.description = payload.description;

      memberMock.findByIdAndUpdate.mockResolvedValue(data);

      // Act
      const response = await service.update(data.id, payload);

      // Assert
      expect(memberMock.findById).toHaveBeenCalled();
      expect(memberMock.findById).toHaveBeenCalledWith(data.id);
      expect(memberMock.findByIdAndUpdate).toHaveBeenCalled();
      expect(memberMock.findByIdAndUpdate).toHaveBeenCalledWith(
        data.id,
        payload,
        { new: true },
      );
      expect(response).toEqual(data);
    });

    it("should update a member's name", async () => {
      // Arrange
      const data = getExamplesFromDto(GetMemberDto);
      memberMock.findById.calledWith(data.id).mockResolvedValue(data);

      const payload = getExamplesFromDto(UpdateMemberDto);
      payload.name = faker.company.name();
      const expectedSlug = createSlug(payload.name);
      (createSlug as jest.Mock).mockReturnValue(expectedSlug);
      data.name = payload.name;
      data.slug = expectedSlug;

      memberMock.findByIdAndUpdate.mockResolvedValue(data);

      // Act
      const response = await service.update(data.id, payload);

      // Assert
      expect(memberMock.findById).toHaveBeenCalled();
      expect(memberMock.findById).toHaveBeenCalledWith(data.id);
      expect(memberMock.findByIdAndUpdate).toHaveBeenCalled();
      expect(memberMock.findByIdAndUpdate).toHaveBeenCalledWith(
        data.id,
        payload,
        { new: true },
      );
      payload.slug = expectedSlug;
      expect(response).toEqual(payload);
    });

    it("should update a member's picture", async () => {
      // Arrange
      const data = getExamplesFromDto(GetMemberDto);
      const payload = getExamplesFromDto(UpdateMemberDto);
      payload.name = null;

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

      memberMock.findById.calledWith(data.id).mockResolvedValue(data);

      cloudinaryServiceMock.updateFileContent
        .calledWith(file, data.imageId)
        .mockResolvedValue({
          public_id: publicId,
          secure_url: secureUrl,
        } as UploadApiResponse);

      memberMock.findByIdAndUpdate.mockResolvedValue({
        ...payload,
        imageId: publicId,
        imageUrl: secureUrl,
      });

      // Act
      const response = await service.update(data.id, payload, file);

      // Assert
      expect(memberMock.findById).toHaveBeenCalled();
      expect(memberMock.findById).toHaveBeenCalledWith(data.id);
      expect(cloudinaryServiceMock.updateFileContent).toHaveBeenCalled();
      expect(cloudinaryServiceMock.updateFileContent).toHaveBeenCalledWith(
        file,
        data.imageId,
      );
      expect(memberMock.findByIdAndUpdate).toHaveBeenCalled();
      expect(memberMock.findByIdAndUpdate).toHaveBeenCalledWith(
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

    it('should throw a NotFoundException if member not found', async () => {
      // Arrange
      const id = new mongoose.Types.ObjectId().toString();
      const payload = getExamplesFromDto(UpdateMemberDto);
      memberMock.findById.calledWith(id).mockResolvedValue(null);

      try {
        // Act
        await service.update(id, payload);
        fail('supposed to have thrown a NotFoundException');
      } catch (error) {
        // Assert
        expect(memberMock.findById).toHaveBeenCalled();
        expect(memberMock.findById).toHaveBeenCalledWith(id);
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('Member not found');
      }
    });
  });

  describe('deleteMember', () => {
    it('should delete a member', async () => {
      // Arrange
      const data = getExamplesFromDto(GetMemberDto);
      memberMock.findByIdAndDelete.mockResolvedValue(data);
      cloudinaryServiceMock.deleteFile.mockReturnValue(undefined);
      // Act
      const response = await service.remove(data.id);
      // Assert
      expect(memberMock.findByIdAndDelete).toHaveBeenCalled();
      expect(memberMock.findByIdAndDelete).toHaveBeenCalledWith(data.id);
      expect(cloudinaryServiceMock.deleteFile).toHaveBeenCalled();
      expect(cloudinaryServiceMock.deleteFile).toHaveBeenCalledWith(
        data.imageId,
      );
      expect(response).toEqual(true);
    });

    it('should throw an error if member not found', async () => {
      // Arrange
      const id = new mongoose.Types.ObjectId().toString();
      memberMock.findByIdAndDelete.calledWith(id).mockResolvedValue(null);
      cloudinaryServiceMock.deleteFile.mockResolvedValue(undefined);

      try {
        // Act
        await service.remove(id);
        fail('Expected NotFoundExceptionToBeThrown');
      } catch (error) {
        // Assert
        expect(memberMock.findByIdAndDelete).toHaveBeenCalled();
        expect(memberMock.findByIdAndDelete).toHaveBeenCalledWith(id);
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Member not found');
      }
    });
  });
});
