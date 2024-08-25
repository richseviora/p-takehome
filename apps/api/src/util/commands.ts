import { faker } from '@faker-js/faker';
import { Command } from 'commander';
import signales from 'signales';

const program = new Command();

const createUserCommand = new Command()
  .name('create-user')
  .description('Creates a user')
  .action(async (ctx) => {
    signales.start('starting request');
    const userName = faker.person.fullName();
    signales.info('sending request to create user with name', userName);
    const body = JSON.stringify({
      name: userName,
    });
    try {
      const createRequest = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
      });
      if (!createRequest.ok) {
        signales.error('User creation failed', createRequest.status);
        return;
      }
      const responseBody = await createRequest.json();
      signales.complete('User created with ID', responseBody.id);
    } catch (e: unknown) {
      if (e instanceof Error) {
        signales.fatal(
          'Connection refused, is the API server running?',
          e.message,
        );
      }
    }
  });
program.addCommand(createUserCommand);

program.parse();
