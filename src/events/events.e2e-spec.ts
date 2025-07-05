import { Test, TestingModule } from '@nestjs/testing';
import { EventsModule } from './events.module';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { request, spec } from 'pactum';
import { faker } from '@faker-js/faker';
import { createReadStream } from 'node:fs';
import { resolve } from 'node:path';

describe('EventsController (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [EventsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    request.setBaseUrl('http://localhost:3500/api/v1');
  });

  it('should create an event', async () => {
    const filePath = resolve(__dirname, '../../test/resources/sample.jpg');
    await spec()
      .post('/events')
      .withMultiPartFormData([
        {
          name: 'title',
          value: faker.book.title(),
        },
        {
          name: 'date',
          value: new Date(),
        },
        { name: 'location', value: faker.location.streetAddress() },
        {
          name: 'description',
          value: faker.food.description(),
        },
        {
          name: 'file',
          value: createReadStream(filePath),
          type: 'image/jpeg',
          filename: 'sample.jpg',
        },
      ])
      .expectStatus(HttpStatus.CREATED);
  });
});
