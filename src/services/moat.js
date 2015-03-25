import codeLoader from './code_loader.js';
import environment from '../environment.js';
import {createKey} from 'private-parts';
const _ = createKey();

class MoatApiTracker {
    constructor(container, ids, duration ) {
        if (global.__karma__) { this._private_ = _(this); }
        const protocol = environment.protocol;
        const sub = (protocol === 'https:') ? 'z' : 'js';
        const self = this;

        _(this).events = [];
        _(this).dispatched = {};

        _(this).tracker = {
            'adData' : {
                'ids'       : ids,
                'duration'  : duration
            },
            'dispatchEvent' : function(ev) {
                if (_(self).dispatched[ev.type]){
                    return;
                }
                _(self).dispatched[ev.type] = true;
                if(this.sendEvent) {
                    if(_(self).events) {
                        _(self).events.push(ev);
                        ev = _(self).events;
                        delete _(self).events;
                    }
                    this.sendEvent(ev);

                } else {
                    _(self).events.push(ev);
                }
            }
        };

        _(this).name = '_moatApi' + Math.floor(Math.random() * 100000000);

        _(this).src = protocol + '//' + sub +
            '.moatads.com/cinema6748895486244/moatvideo.js#' + _(this).name;

        global[_(this).name] = _(this).tracker;

        if (container && container.childNodes){
            codeLoader.configure(_(self).name, {
                src: _(self).src,
                after() { return; }
            });
        
            codeLoader.load(_(this).name,container,'insertBefore',
                container.childNodes[0] || null);
        }
    }

    get name() {
        return _(this).name;
    }

    dispatchEvent(...params) {
        return _(this).tracker.dispatchEvent(...params);
    }

}

export { MoatApiTracker };


class MoatApi {
    constructor() {
        if (global.__karma__) { this._private_ = _(this); }
        _(this).trackers = {};

    }

    initTracker(clientId, container, ids, duration ) {
        let tracker = _(this).trackers[clientId];
        if (tracker){
            return;
        }

        tracker = new MoatApiTracker(container,ids,duration);
        _(this).trackers[clientId] = tracker;
    }

    dispatchEvent(clientId,...params){
        const tracker = _(this).trackers[clientId];
        if (!tracker){
            return;
        }

        tracker.dispatchEvent(...params);
    }

}

export default new MoatApi();

