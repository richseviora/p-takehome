import * as debug from "debug";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
  WebTracerProvider,
} from "@opentelemetry/sdk-trace-web";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch";

const logger = debug.debug("app:tracing");

const provider = new WebTracerProvider();
provider.register({
  contextManager: new ZoneContextManager(),
});
const exporter = new OTLPTraceExporter({
  url: "http://localhost:4318/v1/traces",
});
const processor = new BatchSpanProcessor(exporter);
provider.addSpanProcessor(processor);

if (import.meta.env.DEV) {
  logger("enabling console span exporter");
  const consoleProcessor = new SimpleSpanProcessor(new ConsoleSpanExporter());
  provider.addSpanProcessor(consoleProcessor);
}

registerInstrumentations({
  instrumentations: [new FetchInstrumentation()],
});

provider.register();
logger("tracing registered");
