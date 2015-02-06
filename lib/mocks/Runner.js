import Runner from '../../.tmp/lib-real/Runner.js';
import {createKey} from 'private-parts';

const _ = createKey();

class Queue {
    constructor() {
        _(this).items = [];
    }

    add(fn) {
        _(this).items.push(fn);
    }

    flush(done) {
        const items = _(this).items;
        let task;

        while (task = items.shift()) {
            task();
        }

        done();
    }

    get hasWork() {
        return _(this).items.length > 0;
    }
}

class BeforeRenderQueue extends Queue {
    constructor() {
        super();
        this.name = 'beforeRender';
    }
}

class RenderQueue extends Queue {
    constructor() {
        super();
        this.name = 'render';
    }
}

class AfterRenderQueue extends Queue {
    constructor() {
        super();
        this.name = 'afterRender';
    }
}

class MockRunner extends Runner {}
MockRunner.queues = [BeforeRenderQueue, RenderQueue, AfterRenderQueue];

export default MockRunner;
