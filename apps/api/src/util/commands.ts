import { config } from 'dotenv';
import * as path from 'path';
import opentelemetry, { Span } from '@opentelemetry/api';
import { Command } from 'commander';
import signales from 'signales';
import {
  formatHoneycombTraceLink,
  initializeTracing,
  shutdown,
} from '../tracing';
import { followAction, showAction, userAction } from './actions/actions';

config({ path: path.resolve(__dirname, '../../../../.env') });
initializeTracing('percipio-cli');

const tracer = opentelemetry.trace.getTracer('cli');
const program = new Command();

function emitHoneycombTrace(span: Span): void {
  const hcteam = process.env.HC_TEAM;
  const hcenv = process.env.HC_ENV;
  if (hcteam == null || hcenv == null) {
    signales.note('No Honeycomb configuration info available to generate link, did you set the HC_TEAM and HC_ENV variables?');
    return;
  }
  const formatter = formatHoneycombTraceLink(hcteam, hcenv);
  signales.info(
    'Trace can be viewed at',
    formatter(span.spanContext().traceId),
  );
}

async function executeTracedOperation(
  operationName: string,
  action: () => Promise<void>,
) {
  await tracer.startActiveSpan(operationName, async (span) => {
    try {
      await action();
    } catch (e) {
      span.recordException(e);
    } finally {
      span.end();
      await shutdown();
      emitHoneycombTrace(span);
    }
  });
}

const createFollowCommand = new Command()
  .name('create-follow')
  .description('Creates a follow on a random show for a random user')
  .action(async () => {
    await executeTracedOperation('create-follow', followAction);
  });

const createShowCommand = new Command()
  .name('create-show')
  .description('Creates a show')
  .action(async () => {
    await executeTracedOperation('create-show', showAction);
  });

const createUserCommand = new Command()
  .name('create-user')
  .description('Creates a user')
  .action(async () => {
    await executeTracedOperation('create-user', userAction);
  });

program.addCommand(createUserCommand);
program.addCommand(createShowCommand);
program.addCommand(createFollowCommand);

program.parse();
