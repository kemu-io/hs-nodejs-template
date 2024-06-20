import createService from '@kemu-io/hs';
import { DataType } from '@kemu-io/hs-types';

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
