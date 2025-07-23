import { NotFoundException } from '@nestjs/common';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { getExamplesFromDto } from '@utils/helpers';
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended';
import mongoose, { Connection, Model } from 'mongoose';

import { FindDuesQueryDto, GetDueDto, GetDuesDto } from './dto';
import { DuesService } from './dues.service';
import { Due } from './entities';
import { PaystackService } from './paystack/paystack.service';

describe('DuesService', () => {
  let service: DuesService;
  let dueModelMock: DeepMockProxy<Model<Due>>;
  let connectionMock: DeepMockProxy<Connection>;
  let paystackServiceMock: DeepMockProxy<PaystackService>;

  beforeEach(async () => {
    dueModelMock = mockDeep<Model<Due>>();
    connectionMock = mockDeep<Connection>();
    paystackServiceMock = mockDeep<PaystackService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DuesService,
        {
          provide: getModelToken(Due.name),
          useValue: dueModelMock,
        },
        {
          provide: getConnectionToken(),
          useValue: connectionMock,
        },
        {
          provide: PaystackService,
          useValue: paystackServiceMock,
        },
      ],
    }).compile();

    service = module.get<DuesService>(DuesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    mockReset(dueModelMock);
    mockReset(connectionMock);
    mockReset(paystackServiceMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createDue', () => {});

  describe('fetchDues', () => {
    it('should return a paginated list of dues', async () => {
      // Arrange
      const data = [getExamplesFromDto(GetDuesDto)];
      const mockQuery = {
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(data),
      };
      dueModelMock.find.mockReturnValue(mockQuery as any);
      dueModelMock.countDocuments.mockResolvedValue(data.length);
      const query = getExamplesFromDto(FindDuesQueryDto);

      // Act
      const response = await service.findAll(query);

      // Assert
      expect(response).toEqual({ rows: data, count: data.length });
    });
  });

  describe('fetchDue', () => {
    it('should return a due based on its id', async () => {
      // Arrange
      const data = getExamplesFromDto(GetDueDto);
      dueModelMock.findById.mockResolvedValue(data);

      // Act
      const response = await service.findOne(data.id);

      // Assert
      expect(dueModelMock.findById).toHaveBeenCalled();
      expect(dueModelMock.findById).toHaveBeenCalledWith(data.id);
      expect(response).toEqual(data);
    });

    it('should throw an error if due by id is not found', async () => {
      // Arrange
      const id = new mongoose.Types.ObjectId().toString();
      dueModelMock.findById.calledWith(id).mockResolvedValue(null);

      try {
        // Act
        await service.findOne(id);
        fail('Expected NotFoundExceptionToBeThrown');
      } catch (error) {
        // Assert
        expect(dueModelMock.findById).toHaveBeenCalled();
        expect(dueModelMock.findById).toHaveBeenCalledWith(id);
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Due not found');
      }
    });
  });

  describe('deleteDue', () => {
    it('should delete a due', async () => {
      // Arrange
      const data = getExamplesFromDto(GetDueDto);
      dueModelMock.findByIdAndDelete.mockResolvedValue(data);
      // Act
      const response = await service.remove(data.id);
      // Assert
      expect(dueModelMock.findByIdAndDelete).toHaveBeenCalled();
      expect(dueModelMock.findByIdAndDelete).toHaveBeenCalledWith(data.id);
      expect(response).toEqual(true);
    });

    it('should throw an error if due not found', async () => {
      // Arrange
      const id = new mongoose.Types.ObjectId().toString();
      dueModelMock.findByIdAndDelete.calledWith(id).mockResolvedValue(null);

      try {
        // Act
        await service.remove(id);
        fail('Expected NotFoundExceptionToBeThrown');
      } catch (error) {
        // Assert
        expect(dueModelMock.findByIdAndDelete).toHaveBeenCalled();
        expect(dueModelMock.findByIdAndDelete).toHaveBeenCalledWith(id);
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Due not found');
      }
    });
  });
});
