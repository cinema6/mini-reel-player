import codeLoader from './code_loader.js';
import environment from '../environment.js';
import {createKey} from 'private-parts';

const _ = createKey();

export default class MoatApi {
    constructor(container, ids, duration, url, partnerCode) {
        if (global.__karma__) { this._private_ = _(this); }
        const protocol = global.location.protocol;
        const sub = (protocol === 'https:') ? 'z' : 'js';

        _(this).events = [];

        _(this).tracker = {
            'adData' : {
                'ids'       : ids,
                'duration'  : duration,
                'url'       : url
            },
            'dispatchEvent' : function(ev) {
                if(this.sendEvent) {
                    if(_(this).events) {
                        _(this).events.push(ev);
                        ev = _(this).events;
                        delete _(this).events;
                    }
                    this.sendEvent(ev);

                } else {
                    _(this).events.push(ev);
                }
            }
        };

        _(this).name = "_moatApi" + Math.floor(Math.random() * 100000000);

        _(this).src = protocol + '//' + sub +
            '.moatads.com/cinema6748895486244/moatvideo.js#' + _(this).name;

        global[_(this).name] = _(this).tracker;

        if (container && container.childNodes){
            codeLoader.configure(_(this).name, {
                src: _(this).src,
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

};
