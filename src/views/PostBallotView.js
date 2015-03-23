import PostView from './PostView.js';

export default class PostBallotView extends PostView {
    constructor() {
        super(...arguments);

        this.template = require('./PostBallotView.html');
    }

    didInsertElement() {
        this.choice1Button.on('press', () => this.emit('vote', 0));
        this.choice2Button.on('press', () => this.emit('vote', 1));

        return super(...arguments);
    }
}
