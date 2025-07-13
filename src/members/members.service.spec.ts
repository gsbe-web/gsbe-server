import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';

import { PrismaService } from '../prisma/prisma.service';
import { createExampleFromClass } from '../utils/helpers';
import { FindMembersQueryDto, GetMemberDto } from './dto';
import { MembersService } from './members.service';

describe('MembersService', () => {
  let service: MembersService;
  const prismaMock = mockDeep<PrismaClient>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembersService,
        {
          provide: PrismaService,
          useValue: prismaMock,
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
      const data = [createExampleFromClass(GetMemberDto)];
      prismaMock.member.findMany.mockResolvedValue(data);
      prismaMock.member.count.mockResolvedValue(data.length);
      const query = createExampleFromClass(FindMembersQueryDto);
      // Act
      const response = await service.findAll(query);
      // Assert
      console.log(data);
      expect(response).toEqual({ rows: data, count: data.length });
    });
  });
});
