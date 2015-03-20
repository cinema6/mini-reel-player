import fetcher from '../../lib/fetcher.js';
import environment from '../environment.js';

class Election {
    vote(election, ballotItem, choice) {
        return fetcher.post(`${environment.apiRoot}/api/public/vote`, {
            body: { election, ballotItem, vote: choice }
        }).then(() => true);
    }
}

export default new Election();
