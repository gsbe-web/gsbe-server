import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from '@notifications/email/email.service';
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended';

import { ContactService } from './contact.service';

describe('ContactService', () => {
  let service: ContactService;
  let configServiceMock: DeepMockProxy<ConfigService>;
  let mailServiceMock: DeepMockProxy<EmailService>;

  beforeEach(async () => {
    configServiceMock = mockDeep<ConfigService>();
    mailServiceMock = mockDeep<EmailService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
        {
          provide: EmailService,
          useValue: mailServiceMock,
        },
      ],
    }).compile();

    service = module.get<ContactService>(ContactService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    mockReset(configServiceMock);
    mockReset(mailServiceMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
