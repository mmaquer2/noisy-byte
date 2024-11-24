const { BasicTracerProvider, BatchSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { OTLPTraceExporter } =  require('@opentelemetry/exporter-trace-otlp-http');

const collectorOptions = {
 // url: '<opentelemetry-collector-url>', // url is optional and can be omitted - default is http://localhost:4318/v1/traces
  headers: {
    foo: 'bar'
  }, // an optional object containing custom headers to be sent with each request will only work with http
  concurrencyLimit: 10, // an optional limit on pending requests
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
      // The maximum queue size. After the size is reached spans are dropped.
      maxQueueSize: 1000,
      // The interval between two consecutive exports
      scheduledDelayMillis: 30000,
    })
  ]
});

provider.register();


/**
 * 
 * //local setup
 * 
 * const { NodeSDK } = require('@opentelemetry/sdk-node');
const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-node');
const {
  getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');
const {
  PeriodicExportingMetricReader,
  ConsoleMetricExporter,
} = require('@opentelemetry/sdk-metrics');

// TODO: export the SDK metrics to prometheus or other monitoring system

const sdk = new NodeSDK({
  traceExporter: new ConsoleSpanExporter(),

  // Uncomment the following lines to enable metrics
 // metricReader: new PeriodicExportingMetricReader({
 //   exporter: new ConsoleMetricExporter(),
  //}),
  
  instrumentations: [getNodeAutoInstrumentations()],
});

// To start the SDK, uncomment the following line
//sdk.start();
 */