/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly OTEL_SERVICE_NAME: string;
  readonly OTEL_EXPORTER_OTLP_PROTOCOL: string;
  readonly OTEL_EXPORTER_OTLP_ENDPOINT: string;
  readonly OTEL_EXPORTER_OTLP_HEADERS: string;
  readonly HC_TEAM: string;
  readonly HC_ENV: string;
}