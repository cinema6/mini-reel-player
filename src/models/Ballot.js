import election from '../../src/services/election.js';

export default class Ballot {
    constructor(card, experience) {
        this.id = card.id;
        this.election = card.ballot.election || experience.data.election;
        this.prompt = card.ballot.prompt;
        this.choices = card.ballot.choices.concat();
    }

    cast(vote) {
        return election.vote(this.election, this.id, vote);
    }
}
