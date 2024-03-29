import {createKey} from 'private-parts';
import dispatcher from '../services/dispatcher.js';

class Private {
    openWindow(url, name, features) {
        window.open(url, name, features);
    }
}

const _ = createKey(() => new Private());

function SponsoredCardController(card) {
    dispatcher.addSource('card', card, ['clickthrough', 'share']);
    dispatcher.addSource('ui', this, ['interaction']);

    card.on('share', shareLink => {
        const sizes = {
            facebook: {
                w: 570,
                h: 550
            },
            twitter: {
                w: 580,
                h: 250
            },
            pinterest: {
                w: 750,
                h: 550
            }
        };
        const w = sizes[shareLink.type].w;
        const h = sizes[shareLink.type].h;
        const left = (screen.width/2)-(w/2);
        const top = (screen.height/2)-(h/2)-50;
        const title = 'Share to ' + shareLink.type.charAt(0).toUpperCase() +
            shareLink.type.slice(1);
        return _(this).openWindow(shareLink.href, title,
            `width=${w},height=${h},top=${top},left=${left}`);
    });

    if (global.__karma__) { this.__private__ = _(this); }
}
SponsoredCardController.prototype = {
    clickthrough: function clickthrough(itemView, { coordinates }) {
        return this.model.clickthrough(itemView.data.label, itemView.context, coordinates);
    },

    share: function share(itemView, { coordinates }) {
        return this.model.share(itemView.data.type, itemView.context, coordinates);
    },

    interaction: function interaction(itemView) {
        return this.emit('interaction', itemView.context);
    }
};

export default SponsoredCardController;
