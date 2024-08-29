import signales from 'signales';
import { faker } from '@faker-js/faker';

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

interface UserResult {
  name: string;
  gender: string;
  thumbnail_url: string;
}

const getRandomUser = async (): Promise<UserResult> => {
  signales.info('calling randomuser.me/api to get random user data with photo');
  const result = await fetch(
    'https://randomuser.me/api/?inc=gender,name,picture',
    {
      headers: { 'Content-Type': 'application/json' },
    },
  );

  if (!result.ok) {
    signales.fatal('received error calling user', result);
    throw new Error("Unhandled User Creation")
  }
  const body = await result.json();
  const user = body.results[0];
  const userReturn = {
    name: `${user.name.first} ${user.name.last}`,
    gender: user.gender,
    thumbnail_url: user.picture.large,
  };
  signales.info('received result', userReturn);
  return userReturn;
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

export async function followAction() {
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

export async function showAction() {
  signales.start('starting request');
  const name = faker.music.songName();
  signales.info('sending request to create show with name', name);
  const body = JSON.stringify({
    name: name,
    imdb_id: faker.string.uuid(),
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

export async function userAction() {
  signales.start('starting request');
  try {
    const userData = await getRandomUser();
    const body = JSON.stringify({
      name: userData.name,
      thumbnail_url: userData.thumbnail_url,
      gender: userData.gender,
    });
    signales.info('sending request to create user', body);
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
