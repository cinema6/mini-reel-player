import BillingHandler from './BillingHandler.js';

export default class PostMessageHandler extends BillingHandler {
    constructor(register, postMessage) {
        super(...arguments);

        const post = (data => postMessage.call(window.parent, JSON.stringify(data), '*'));

        register(({ target: minireel }) => {
            const firstCard = minireel.deck[0];

            if (!firstCard) { return; }

            post({
                event: 'launch',
                isSponsored: !!firstCard.sponsor,
                isClickToPlay: !firstCard.data.autoplay
            });
        }, 'navigation', 'launch');

        register(({ data: card }) => {
            if (card.sponsor) { post({ event: 'adEnded' }); }
        }, 'video', 'ended');

        this.on('AdClick', () => post({ event: 'adStart' }));
        this.on('AdCount', () => post({ event: 'adCount' }));
    }
}
