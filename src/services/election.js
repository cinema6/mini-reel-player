import fetcher from '../../lib/fetcher.js';

class Election {
    vote(election, ballotItem, choice) {
        return fetcher.post('/api/public/vote', {
            body: { election, ballotItem, vote: choice }
        }).then(() => true);
    }
}

export default new Election();
