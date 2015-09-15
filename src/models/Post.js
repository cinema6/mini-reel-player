import Ballot from './Ballot.js';
import normalizeLinks from '../fns/normalize_links.js';

export default class Post {
    constructor(card, experience) {
        this.website = normalizeLinks(card.links).Website;
        this.ballot = (card.ballot || null) && new Ballot(card, experience);
    }
}
