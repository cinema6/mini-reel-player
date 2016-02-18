import dispatcher from '../services/dispatcher.js';

function SponsoredCardController(card) {
    dispatcher.addSource('card', card, ['clickthrough', 'share']);

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
        return window.open(shareLink.href, title,
            `width=${w},height=${h},top=${top},left=${left}`);
    });
}
SponsoredCardController.prototype = {
    clickthrough: function clickthrough(itemView) {
        return this.model.clickthrough(itemView.data.label);
    },

    share: function share(itemView) {
        return this.model.share(itemView.data.type);
    }
};

export default SponsoredCardController;
