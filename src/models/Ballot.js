import { EventEmitter } from 'events';
import election from '../../src/services/election.js';
import {
    map
} from '../../lib/utils.js';

export default class Ballot extends EventEmitter {
    constructor(card, experience) {
        super();

        this.id = card.id;
        this.election = card.ballot.election || experience.data.election;
        this.prompt = card.ballot.prompt;
        this.choices = card.ballot.choices.concat();
        this.results = map(this.choices, () => null);

        this.choice = null;
    }

    cast(vote) {
        this.choice = vote;

        if (vote > -1) {
            return election.vote(this.election, this.id, vote);
        }
    }
}
