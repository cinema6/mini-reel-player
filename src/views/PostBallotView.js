import PostView from './PostView.js';

export default class PostBallotView extends PostView {
    constructor() {
        super(...arguments);

        this.template = require('./PostBallotView.html');
    }
}
