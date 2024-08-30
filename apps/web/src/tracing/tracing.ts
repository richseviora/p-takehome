import * as debug from "debug";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
  WebTracerProvider,
} from "@opentelemetry/sdk-trace-web";

const logger = debug.debug("app:tracing");

const [header, value] = import.meta.env.OTEL_EXPORTER_OTLP_HEADERS.split("=");
const provider = new WebTracerProvider();
const exporter = new OTLPTraceExporter({
  url: import.meta.env.OTEL_EXPORTER_OTLP_ENDPOINT,
  headers: {
    [header]: value,
  },
});
const processor = new BatchSpanProcessor(exporter);
provider.addSpanProcessor(processor);

if (import.meta.env.DEV) {
  logger("enabling console span exporter");
  const consoleProcessor = new SimpleSpanProcessor(new ConsoleSpanExporter());
  provider.addSpanProcessor(consoleProcessor);
}

provider.register();
logger("tracing registered");
