import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';
import { Repository } from 'typeorm';
import { User } from '../src/entities/user';
import { ShowsService } from '../src/shows/shows.service';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let usersService: UsersService;
  let userDb: Repository<User>;
  let showsService: ShowsService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userDb = moduleFixture.get('USER_REPOSITORY');
    usersService = moduleFixture.get(UsersService);
    showsService = moduleFixture.get(ShowsService);

    await app.init();
  });

  beforeEach(async () => {
    await userDb.delete({});
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
      const user = await usersService.create({
        name: faker.person.fullName(),
        gender: 'male',
        thumbnail_url: 'abc',
      });
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

  describe('/users/:id (GET)', () => {
    it('returns 404 response when no user is found', async () => {
      await request(app.getHttpServer())
        .get('/users/abcd')
        .expect((response) => {
          expect(response.status).toBe(404);
        });
    });
    it('returns the user data when populated', async () => {
      const user = await usersService.create({
        name: faker.person.fullName(),
        gender: 'male',
        thumbnail_url: 'abc',
      });
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

  describe('/users/:id (DELETE)', () => {
    it('returns 404 response when no user is found', async () => {
      await request(app.getHttpServer())
        .delete('/users/abcd')
        .expect((response) => {
          expect(response.status).toBe(404);
        });
    });
    it('returns the user data when populated', async () => {
      const user = await usersService.create({
        name: faker.person.fullName(),
        gender: 'male',
        thumbnail_url: 'abc',
      });
      await request(app.getHttpServer())
        .delete('/users/' + user.id)
        .expect((response) => {
          expect(response.status).toBe(200);
        });
      const deletedUser = await usersService.findOne(user.id);
      expect(deletedUser).toBeFalsy();
    });
  });

  describe('/users/:id (PATCH)', () => {
    it('returns 404 response when no user is found', async () => {
      await request(app.getHttpServer())
        .patch('/users/abcd')
        .expect((response) => {
          expect(response.status).toBe(404);
        });
    });
    it('returns the updated user data when populated', async () => {
      const user = await usersService.create({
        name: faker.person.fullName(),
        gender: 'male',
        thumbnail_url: 'abc',
      });
      const newName = faker.person.firstName();
      await request(app.getHttpServer())
        .patch('/users/' + user.id)
        .send({
          name: newName,
        })
        .expect((response) => {
          expect(response.status).toBe(200);
          expect(response.body).toMatchObject({
            name: newName,
            id: user.id,
          });
        });
    });
  });

  describe('/users/:id/follows (POST)', () => {
    it('returns 404 response when no user is found', async () => {
      await request(app.getHttpServer())
        .post('/users/abcd/follows')
        .send({ a: 'b' })
        .expect((response) => {
          expect(response.status).toBe(404);
        });
    });
    it('returns the new follow data when populated', async () => {
      const show = await showsService.create({
        name: faker.company.name(),
        imdb_id: faker.string.uuid(),
      });
      const user = await usersService.create({
        name: faker.person.fullName(),
        gender: 'male',
        thumbnail_url: 'abc',
      });
      await request(app.getHttpServer())
        .post(`/users/${user.id}/follows`)
        .send({
          show_id: show.id,
        })
        .expect((response) => {
          expect(response.status).toBe(201);
          expect(response.body).toMatchObject({
            show: { id: show.id },
            user: { id: user.id },
          });
        });
    });
    it('returns 404 when the show ID is not valid', async () => {
      await showsService.create({
        name: faker.company.name(),
        imdb_id: faker.string.uuid(),
      });
      const user = await usersService.create({
        name: faker.person.fullName(),
        gender: 'male',
        thumbnail_url: 'abc',
      });
      await request(app.getHttpServer())
        .post(`/users/${user.id}/follows`)
        .send({
          show_id: 'abcd1234wrongID',
        })
        .expect((response) => {
          expect(response.status).toBe(422);
        });
    });
  });
});
