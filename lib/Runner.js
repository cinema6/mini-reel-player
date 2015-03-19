import {createKey} from 'private-parts';
import {
    noop,
    map,
    allSettled,
    find
} from './utils.js';
import global from './global.js';
const _ = createKey();

/**************************************************************************************************
 * QUEUE BASE CLASSES
 *************************************************************************************************/
class Queue {
    constructor() {
        _(this).items = [];
    }

    add(fn) {
        _(this).items.push(fn);
    }

    get hasWork() {
        return _(this).items.length > 0;
    }
}

class AsyncQueue extends Queue {
    flush(next) {
        const items = _(this).items;

        allSettled(map(items, fn => fn())).then(results => {
            const error = find(results, ({ state }) => state === 'rejected');

            if (error) {
                global.console.error(error.reason);
            } else {
                next();
            }
        });
        items.length = 0;
    }
}

class RAFQueue extends AsyncQueue {
    flush(next) {
        global.requestAnimationFrame(() => super(next));
    }
}

/**************************************************************************************************
 * QUEUE CLASSES
 *************************************************************************************************/
class BeforeRenderQueue extends AsyncQueue {
    constructor() {
        this.name = 'beforeRender';
        super();
    }
}

class RenderQueue extends RAFQueue {
    constructor() {
        this.name = 'render';
        super();
    }
}

class AfterRenderQueue extends AsyncQueue {
    constructor() {
        this.name = 'afterRender';
        super();
    }
}

/**************************************************************************************************
 * RUNNER CLASS
 *************************************************************************************************/
let runner = null;
class Runner {
    constructor(queues) {
        const _this = _(this);

        _this.queues = queues;
        _this.queueHash = {};

        for (let queue of queues) {
            _this.queueHash[queue.name] = queue;
        }
    }

    schedule(queueName, fn) {
        const queue = _(this).queueHash[queueName];

        if (!queue) {
            throw new Error(`Unknown queue: [${queueName}].`);
        }

        queue.add(fn);
    }

    flush(callback = noop) {
        for (let queue of _(this).queues) {
            if (queue.hasWork) {
                queue.flush(() => this.flush(callback));
                return;
            }
        }

        callback();
    }
}

const nextRuns = [];

function executeNext() {
    if (nextRuns.length < 1) { return; }

    Runner.run(() => {
        let item;

        while (item = nextRuns.shift()) {
            const [fn, args] = item;
            fn(...args);
        }
    });
}


Runner.queues = [BeforeRenderQueue, RenderQueue, AfterRenderQueue];

Runner.run = function(fn, ...args) {
    let result;

    runner = new this(map(this.queues, Queue => new Queue()));
    result = fn(...args);
    runner.flush(executeNext);
    runner = null;

    return result;
};

Runner.schedule = function(queue, fn) {
    if (!runner) {
        throw new Error('Cannot schedule task because there is no open runner instance.');
    }

    runner.schedule(queue, fn);
};

Runner.runNext = function(fn, ...args) {
    if (!runner) {
        return this.run(fn, ...args);
    }

    nextRuns.push([fn, args]);
};

export default Runner;
