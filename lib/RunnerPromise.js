import Runner from './Runner.js';

export default class RunnerPromise extends Promise {
    then(fulfillmentHandler, rejectionHandler) {
        return super(
            fulfillmentHandler && function(value) {
                return Runner.run(fulfillmentHandler, value);
            },
            rejectionHandler && function(reason) {
                return Runner.run(rejectionHandler, reason);
            }
        );
    }
}
