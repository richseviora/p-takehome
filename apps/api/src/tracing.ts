import * as opentelemetry from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { Span, propagation, context, trace } from '@opentelemetry/api';

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

export function formatHoneycombTraceLink(
  team: string,
  environment: string,
): (traceId: string) => string {
  return (traceId: string) => {
    return `https://ui.honeycomb.io/${team}/environments/${environment}/trace?trace_id=${traceId}`;
  };
}

export interface W3TraceContext {
  traceparent: string;
  tracestate: string;
}

/**
 * Extracts the current trace context from the current context.
 */
export function getCurrentTraceId(): W3TraceContext {
  const data = {};
  propagation.inject(context.active(), data);
  return data as any;
}
