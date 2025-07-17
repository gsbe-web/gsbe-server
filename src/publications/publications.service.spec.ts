import { CloudinaryService } from '@cloudinary/cloudinary.service';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { mockDeep } from 'jest-mock-extended';
import { Model } from 'mongoose';

import { Publication } from './entities';
import { PublicationsService } from './publications.service';

describe('PublicationsService', () => {
  let service: PublicationsService;
  const publicationMock = mockDeep<Model<Publication>>();
  const cloudinaryServiceMock = mockDeep<CloudinaryService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublicationsService,
        { provide: CloudinaryService, useValue: cloudinaryServiceMock },
        { provide: getModelToken(Publication.name), useValue: publicationMock },
      ],
    }).compile();

    service = module.get<PublicationsService>(PublicationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
