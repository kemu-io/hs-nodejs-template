import createService, { DataType } from '@kemu-io/hs';

const service = new createService();
service.start();

(async () => {
  service.onParentEvent((event, context) => {
    console.log('Parent event:', event, context);
    context.setOutputs([
      {
        name: 'output',
        type: DataType.Number,
        value: event.data.value
      }
    ]);
  });
})();
