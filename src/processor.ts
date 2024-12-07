import createService, { DataType } from '@kemu-io/hs';

const service = new createService();
await service.start();

service.onParentEvent(async (event, context) => {
  console.log('Parent event:', event, context);
  context.setOutputs([
    {
      name: 'output',
      type: DataType.Number,
      value: event.data.value
    }
  ]);
});
