import { EventEmitter } from 'events';
import timer from '../../lib/timer.js';

export default class BillingHandler extends EventEmitter {
    constructor(register) {
        super();
        this.cache = {};

        const getHistory = (card => this.cache[card.id] || (this.cache[card.id] = {
            start: false,
            count: false,
            timer: null
        }));

        register(event => {
            const card = event.data;
            const player = event.target;
            const history = getHistory(card);

            if (!history.start) {
                this.emit('AdStart', card, player);
                history.start = true;
            }
        }, 'video', 'play');

        register(event => {
            const card = event.data;
            const player = event.target;
            const {minViewTime} = card.campaign;
            const history = getHistory(card);

            if (minViewTime > -1) { return; }

            if (!history.count) {
                this.emit('AdCount', card, player);
                history.count = true;
            }
        }, 'video', 'complete');

        register(event => {
            const card = event.data;
            const {minViewTime} = card.campaign;

            if (minViewTime < 1) { return; }

            const history = getHistory(card);
            const player = event.target;
            const {currentTime} = player;

            if (currentTime >= minViewTime && !history.count) {
                this.emit('AdCount', card, player);
                history.count = true;
            }
        }, 'video', 'timeupdate');

        register(({ target: card }) => {
            const {
                campaign: { minViewTime }
            } = card;
            const count = () => {
                this.emit('AdCount', card, null);
                history.count = true;
            };
            const history = getHistory(card);

            if (history.count) { return; }

            if (minViewTime > 0) {
                (history.timer = timer.wait(minViewTime * 1000)).then(count);
            } else {
                count();
            }
        }, 'showcase-card', 'activate');
        register(({ target: card }) => {
            const history = getHistory(card);

            if (history.start) { return; }

            this.emit('AdStart', card, null);
            history.start = true;

        }, 'showcase-card', 'activate');

        register(({ target: card }) => {
            const history = getHistory(card);

            if (history.timer) {
                timer.cancel(history.timer);
            }
        }, 'showcase-card', 'deactivate');
    }
}
