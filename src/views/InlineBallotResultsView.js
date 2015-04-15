import BallotResultsView from './BallotResultsView.js';

export default class InlineBallotResultsView extends BallotResultsView {
    constructor() {
        super(...arguments);

        this.template = require('./InlineBallotResultsView.html');
    }
}
