import Card from './Card.js';
import DisplayAd from './DisplayAd.js';
import makeSocialLinks from '../fns/make_social_links.js';

export default class DisplayAdCard extends Card {
    constructor(card, experience) {
        super(...arguments);

        this.type = 'displayAd';

        this.sponsor = card.params.sponsor;
        this.links = card.links;
        this.socialLinks = makeSocialLinks(this.links);

        this.displayAd = new DisplayAd(card, experience);
    }
}
