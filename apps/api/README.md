## Description

Take Home Test API.

## Installation

```bash
$ pnpm install
```

## Configuring

Create a `.env` file in the repository root with the following values:

```
OTEL_SERVICE_NAME=percipio-test
OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf
OTEL_EXPORTER_OTLP_ENDPOINT="https://api.honeycomb.io"
OTEL_EXPORTER_OTLP_HEADERS=x-honeycomb-team=API_KEY_HERE
```

## Running the app

```bash
# development
$ pnpm run start

# development with DB logging
$ DB_LOGS=yes pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# all tests
$ pnpm run test

# all tests with DB logs
$ DB_LOGS=yes pnpm run test

# test coverage
$ pnpm run test:cov
```
