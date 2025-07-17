import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { getExamplesFromDto } from '@utils/helpers';
import { mockDeep } from 'jest-mock-extended';
import { Model } from 'mongoose';

import { FindMembersQueryDto, GetMemberDto } from './dto';
import { Member } from './entities';
import { MembersService } from './members.service';

describe('MembersService', () => {
  let service: MembersService;
  const memberMock = mockDeep<Model<Member>>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembersService,
        {
          provide: getModelToken(Member.name),
          useValue: memberMock,
        },
      ],
    }).compile();

    service = module.get<MembersService>(MembersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
});
