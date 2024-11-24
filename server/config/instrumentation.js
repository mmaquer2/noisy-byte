const { BasicTracerProvider, BatchSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { OTLPTraceExporter } =  require('@opentelemetry/exporter-trace-otlp-http');

const collectorOptions = {
  concurrencyLimit: 10, // limit on pending requests
};

const exporter = new OTLPTraceExporter(collectorOptions);
const provider = new BasicTracerProvider({
  resource: {
    service: 'noisy-byte-server',
    tags: {
      environment: 'dev'
    }
  },
  spanProcessors: [
    new BatchSpanProcessor(exporter, {
      maxQueueSize: 1000,
      scheduledDelayMillis: 30000,
    })
  ]
});

provider.register();
