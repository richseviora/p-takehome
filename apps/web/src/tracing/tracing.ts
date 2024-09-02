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
import { Resource } from "@opentelemetry/resources";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import { W3CTraceContextPropagator } from "@opentelemetry/core";
import {
  context,
  diag,
  DiagConsoleLogger,
  DiagLogLevel,
  propagation,
  Span,
  trace,
} from "@opentelemetry/api";

const logger = debug.debug("app:tracing");

const provider = new WebTracerProvider({
  resource: new Resource({ [ATTR_SERVICE_NAME]: "percipio-web" }),
});
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
  diag.setLogger(new DiagConsoleLogger(), { logLevel: DiagLogLevel.VERBOSE });
  logger("enabling console span exporter");
  const consoleProcessor = new SimpleSpanProcessor(new ConsoleSpanExporter());
  provider.addSpanProcessor(consoleProcessor);
}

registerInstrumentations({
  instrumentations: [
    new FetchInstrumentation({
      propagateTraceHeaderCorsUrls: /http:\/\/localhost/,
    }),
  ],
});

logger("tracing registered");
const tracer = trace.getTracer("tracing");

export function extractContextAndGetSpan(
  traceparent: unknown,
  spanName: string,
): Span {
  let activeContext = context.active();
  activeContext = propagation.extract(activeContext, traceparent);
  const span = tracer.startSpan(spanName, { kind: 1 }, activeContext);
  trace.setSpan(activeContext, span);
  return span;
}
