
const { NodeSDK } = require('@opentelemetry/sdk-node');
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
