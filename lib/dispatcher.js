import {EventEmitter} from 'events';

class Dispatcher extends EventEmitter {
    constructor() {
        this.setMaxListeners(100);
    }
}

export default new Dispatcher();
