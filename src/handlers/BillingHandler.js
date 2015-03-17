import {EventEmitter} from 'events';

export default class BillingHandler extends EventEmitter {
    constructor(register) {
        super();
        this.cache = {};

        const getHistory = (card => this.cache[card.id] || (this.cache[card.id] = {
            click: false,
            count: false
        }));

        register(event => {
            const card = event.data;
            const player = event.target;
            const history = getHistory(card);

            if (!history.click) {
                this.emit('AdClick', card, player);
                history.click = true;
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
    }
}
