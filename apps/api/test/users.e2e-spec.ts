import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';
import { SseService } from '../src/sse/sse.service';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let userRepo: UsersService;
  let sseService: SseService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userRepo = moduleFixture.get(UsersService);
    sseService = moduleFixture.get(SseService);

    await app.init();
  });

  describe('/users (GET)', () => {
    it('returns an empty array when no users are populated', async () => {
      await request(app.getHttpServer())
        .get('/users')
        .expect((response) => {
          expect(response.status).toBe(200);
          expect(response.body).toEqual([]);
        });
    });
    it('returns the user data when populated', async () => {
      const user = await userRepo.create({ name: faker.person.fullName() });
      await request(app.getHttpServer())
        .get('/users')
        .expect((response) => {
          expect(response.status).toBe(200);
          expect(response.body).toMatchObject([
            expect.objectContaining({
              name: user.name,
              id: user.id,
            }),
          ]);
        });
    });
  });

  describe('/users/:id (GET)', () => {
    it('returns 404 response when no user is found', async () => {
      await request(app.getHttpServer())
        .get('/users/abcd')
        .expect((response) => {
          expect(response.status).toBe(404);
        });
    });
    it('returns the user data when populated', async () => {
      const user = await userRepo.create({ name: faker.person.fullName() });
      await request(app.getHttpServer())
        .get('/users/' + user.id)
        .expect((response) => {
          expect(response.status).toBe(200);
          expect(response.body).toMatchObject({
            name: user.name,
            id: user.id,
          });
        });
    });
  });

  describe('/users/ (POST)', () => {
    it('returns the created user', async () => {
      const userName = faker.person.fullName();
      await request(app.getHttpServer())
        .post('/users/')
        .send({
          name: userName,
        })
        .expect((response) => {
          expect(response.status).toBe(201);
          expect(response.body).toMatchObject({
            name: userName,
          });
        });
    });

    it('fails a request without a user name', async () => {
      await request(app.getHttpServer())
        .post('/users/')
        .send({})
        .expect((response) => {
          expect(response.status).toBe(422);
        });
    });
  });
});
