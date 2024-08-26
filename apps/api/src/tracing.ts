import * as opentelemetry from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { NodeSDK } from '@opentelemetry/sdk-node';

let sdk: NodeSDK;

export function initializeTracing(serviceName?: string): void {
  sdk = new opentelemetry.NodeSDK({
    traceExporter: new OTLPTraceExporter(),
    serviceName,
    instrumentations: [
      getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-fs': {
          enabled: false,
        },
      }),
    ],
  });
  sdk.start();
}

export function shutdown(): Promise<void> {
  return sdk.shutdown();
}
