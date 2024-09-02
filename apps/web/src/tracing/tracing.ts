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
import { W3CTraceContextPropagator } from "@opentelemetry/core";
import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";

const logger = debug.debug("app:tracing");

const provider = new WebTracerProvider();
provider.register({
  propagator: new W3CTraceContextPropagator(),
  contextManager: new ZoneContextManager(),
});

const exporter = new OTLPTraceExporter({
  url: "http://localhost:4318/v1/traces",
});
const processor = new BatchSpanProcessor(exporter);
provider.addSpanProcessor(processor);

if (import.meta.env.DEV) {
  logger("enabling verbose OTEL Logging");
  diag.setLogger(new DiagConsoleLogger(), { logLevel: DiagLogLevel.INFO });
  logger("enabling console span exporter");
  const consoleProcessor = new SimpleSpanProcessor(new ConsoleSpanExporter());
  provider.addSpanProcessor(consoleProcessor);
}

registerInstrumentations({
  instrumentations: [new FetchInstrumentation({
    propagateTraceHeaderCorsUrls: /http:\/\/localhost/
  })],
});

logger("tracing registered");
