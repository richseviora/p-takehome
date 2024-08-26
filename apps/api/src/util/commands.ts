import { config } from 'dotenv';
import * as path from 'path';
import opentelemetry from '@opentelemetry/api';
import { faker } from '@faker-js/faker';
import { Command } from 'commander';
import signales from 'signales';
import { initializeTracing } from '../tracing';

console.log('service name', process.env.OTEL_SERVICE_NAME);
config({ path: path.resolve(__dirname, '../../../../.env') });
initializeTracing();
const tracer = opentelemetry.trace.getTracer('cli');
const program = new Command();

/**
 *
 * @param path - Path excluding leading slash.
 * @param body - The object to be serialized to JSON.
 */
const createRecord = (path: string, body: any): Promise<Response> => {
  return fetch('http://localhost:3000/' + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body,
  });
};

const getRandomRecordFromResponse = async (
  response: Response,
): Promise<any> => {
  const records = await response.json();
  if (records.length === 0) {
    throw new Error('No records found');
  }
  const randomIndex = Math.floor(Math.random() * records.length);
  return records[randomIndex];
};

async function followAction() {
  signales.start('starting request');
  signales.info('fetching users and shows');
  const usersRequest = fetch('http://localhost:3000/users');
  const showsRequest = fetch('http://localhost:3000/shows');
  const [userResponse, showResponse] = await Promise.all([
    usersRequest,
    showsRequest,
  ]);
  const [user, show] = await Promise.all([
    getRandomRecordFromResponse(userResponse),
    getRandomRecordFromResponse(showResponse),
  ]);
  signales.info('found show', show.name, show.id);
  signales.info('found user', user.name, user.id);
  const body = JSON.stringify({
    show_id: show.id,
  });
  try {
    const createRequest = await createRecord(`users/${user.id}/follows`, body);
    if (!createRequest.ok) {
      signales.error('Follow creation failed', createRequest.status);
      return;
    }
    const responseBody = await createRequest.json();
    signales.complete('Follow created with ID', responseBody.id);
  } catch (e: unknown) {
    if (e instanceof Error) {
      signales.fatal('Connection failed, error follows', e.message);
    }
    throw e;
  }
}

const createFollowCommand = new Command()
  .name('create-follow')
  .description('Creates a follow on a random show for a random user')
  .action(async (ctx) => {
    await tracer.startActiveSpan('create-follow', async (span) => {
      try {
        await followAction();
      } finally {
        span.end();
      }
    });
  });

async function showAction() {
  signales.start('starting request');
  const name = faker.music.songName();
  signales.info('sending request to create show with name', name);
  const body = JSON.stringify({
    name: name,
  });
  try {
    const createRequest = await createRecord('shows', body);
    if (!createRequest.ok) {
      signales.error('Show creation failed', createRequest.status);
      return;
    }
    const responseBody = await createRequest.json();
    signales.complete('Show created with ID', responseBody.id);
  } catch (e: unknown) {
    if (e instanceof Error) {
      signales.fatal('Connection failed, error follows', e.message);
    }
    throw e;
  }
}

const createShowCommand = new Command()
  .name('create-show')
  .description('Creates a show')
  .action(async (ctx) => {
    await tracer.startActiveSpan('create-show', async (span) => {
      try {
        await showAction();
      } finally {
        span.end();
      }
    });
  });

async function userAction() {
  signales.start('starting request');
  const userName = faker.person.fullName();
  signales.info('sending request to create user with name', userName);
  const body = JSON.stringify({
    name: userName,
  });
  try {
    const createRequest = await createRecord('users', body);
    if (!createRequest.ok) {
      signales.error('User creation failed', createRequest.status);
      return;
    }
    const responseBody = await createRequest.json();
    signales.complete('User created with ID', responseBody.id);
  } catch (e: unknown) {
    if (e instanceof Error) {
      signales.fatal('Connection failed, error follows', e.message);
    }
    throw e;
  }
}

const createUserCommand = new Command()
  .name('create-user')
  .description('Creates a user')
  .action(async (ctx) => {
    await tracer.startActiveSpan('create-user', async (span) => {
      try {
        await userAction();
      } finally {
        span.end();
      }
    });
  });

program.addCommand(createUserCommand);
program.addCommand(createShowCommand);
program.addCommand(createFollowCommand);

program.parse();
