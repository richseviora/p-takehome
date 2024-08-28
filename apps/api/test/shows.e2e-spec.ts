import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ShowsService } from '../src/shows/shows.service';
import { Repository } from 'typeorm';
import { Show } from '../src/entities/show';

describe('ShowsController (e2e)', () => {
  let app: INestApplication;
  let showDb: Repository<Show>;
  let showsService: ShowsService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    showDb = moduleFixture.get('SHOW_REPOSITORY');
    showsService = moduleFixture.get(ShowsService);

    await app.init();
    await showDb.delete({});
  });

  describe('/shows (GET)', () => {
    it('returns an empty array when no shows are populated', async () => {
      await request(app.getHttpServer())
        .get('/shows')
        .expect((response) => {
          expect(response.status).toBe(200);
          expect(response.body).toEqual([]);
        });
    });
    it('returns the show data when populated', async () => {
      const show = await showsService.create({
        name: faker.person.fullName(),
        imdb_id: faker.string.nanoid(),
      });
      await request(app.getHttpServer())
        .get('/shows')
        .expect((response) => {
          expect(response.status).toBe(200);
          expect(response.body).toMatchObject([
            expect.objectContaining({
              name: show.name,
              imdb_id: show.imdb_id,
            }),
          ]);
        });
    });
  });

  describe('/shows/ (POST)', () => {
    it('returns the created show', async () => {
      const showName = faker.music.songName();
      const imdbId = faker.string.nanoid();
      await request(app.getHttpServer())
        .post('/shows/')
        .send({
          name: showName,
          imdb_id: imdbId,
        })
        .expect((response) => {
          expect(response.status).toBe(201);
          expect(response.body).toMatchObject({
            name: showName,
            imdb_id: imdbId,
          });
        });
    });

    it('fails a request without a show name', async () => {
      await request(app.getHttpServer())
        .post('/shows/')
        .send({})
        .expect((response) => {
          expect(response.status).toBe(422);
        });
    });
  });

  describe('/shows/:id (GET)', () => {
    it('returns 404 response when no show is found', async () => {
      await request(app.getHttpServer())
        .get('/shows/abcd')
        .expect((response) => {
          expect(response.status).toBe(404);
        });
    });
    it('returns the show data when populated', async () => {
      const show = await showsService.create({
        name: faker.person.fullName(),
        imdb_id: faker.string.nanoid(),
      });
      await request(app.getHttpServer())
        .get('/shows/' + show.id)
        .expect((response) => {
          expect(response.status).toBe(200);
          expect(response.body).toMatchObject({
            name: show.name,
            id: show.id,
          });
        });
    });
  });

  describe('/shows/:id (DELETE)', () => {
    it('returns 404 response when no show is found', async () => {
      await request(app.getHttpServer())
        .delete('/shows/abcd')
        .expect((response) => {
          expect(response.status).toBe(404);
        });
    });
    it('returns the show data when populated', async () => {
      const show = await showsService.create({
        name: faker.person.fullName(),
        imdb_id: faker.string.nanoid(),
      });
      await request(app.getHttpServer())
        .delete('/shows/' + show.id)
        .expect((response) => {
          expect(response.status).toBe(200);
        });
      const deletedUser = await showsService.findOne(show.id);
      expect(deletedUser).toBeFalsy();
    });
  });

  describe('/shows/:id (PATCH)', () => {
    it('returns 404 response when no show is found', async () => {
      await request(app.getHttpServer())
        .patch('/shows/abcd')
        .expect((response) => {
          expect(response.status).toBe(404);
        });
    });
    it('returns the updated show data when populated', async () => {
      const show = await showsService.create({
        name: faker.person.fullName(),
        imdb_id: faker.string.nanoid(),
      });
      const newName = faker.person.firstName();
      await request(app.getHttpServer())
        .patch('/shows/' + show.id)
        .send({
          name: newName,
        })
        .expect((response) => {
          expect(response.status).toBe(200);
          expect(response.body).toMatchObject({
            name: newName,
            id: show.id,
          });
        });
    });
  });
});
