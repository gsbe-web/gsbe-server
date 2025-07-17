jest.mock('@shared/generator');

import { CloudinaryService } from '@cloudinary/cloudinary.service';
import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { createSlug } from '@shared/generator';
import { getExamplesFromDto } from '@utils/helpers';
import { UploadApiResponse } from 'cloudinary';
import { mockDeep } from 'jest-mock-extended';
import mongoose, { Model } from 'mongoose';
import { Readable } from 'stream';

import {
  CreateMemberDto,
  FindMembersQueryDto,
  GetMemberDto,
  MemberDto,
} from './dto';
import { Member } from './entities';
import { MembersService } from './members.service';

describe('MembersService', () => {
  let service: MembersService;
  const memberMock = mockDeep<Model<Member>>();
  const cloudinaryServiceMock = mockDeep<CloudinaryService>();

  beforeEach(async () => {
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

      // Act
      const response = await service.findOneById(id);

      // Assert
      await expect(response).rejects.toThrow(NotFoundException);
      await expect(response).rejects.toThrow('Member not found');
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

      // Act
      const response = await service.findOneBySlug(slug);

      // Assert
      await expect(response).rejects.toThrow(NotFoundException);
      await expect(response).rejects.toThrow('Member not found');
    });
  });
});
