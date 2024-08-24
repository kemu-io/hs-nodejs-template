import createService from '@kemu-io/hs';
import { DataType } from '@kemu-io/hs-types';

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
