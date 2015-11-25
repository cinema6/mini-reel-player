import fetcher from '../../lib/fetcher.js';
import environment from '../environment.js';
import { createKey } from 'private-parts';
import {
    map,
    reduce
} from '../../lib/utils.js';

const _ = createKey({
    processElection: function(election) {
        return {
            id: election.id,
            ballot: reduce(Object.keys(election.ballot), (ballot, id) => {
                const percents = election.ballot[id] || [];

                ballot[id] = percents.every(percent => percent === 0) ?
                    map(percents, () => (1 / percents.length)) : percents;

                return ballot;
            }, election.ballot)
        };
    },

    getElection: function(id) {
        const { apiRoot } = environment;

        return this.electionPromises[id] ||
            (this.electionPromises[id] = fetcher.get(`${apiRoot}/api/public/election/${id}`)
                .then(response => response.json())
                .then(this.processElection));
    }
});

class Election {
    constructor() {
        _(this).electionPromises = {};
    }

    vote(election, ballotItem, choice) {
        return fetcher.post(`${environment.apiRoot}/api/public/vote`, {
            body: { election, ballotItem, vote: choice }
        }).then(() => true);
    }

    getResults(election, ballotItem) {
        return _(this).getElection(election)
            .then(election => election.ballot[ballotItem]);
    }
}

export default new Election();
