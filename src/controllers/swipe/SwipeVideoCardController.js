import VideoCardController from '../VideoCardController.js';
import SwipeVideoCardView from '../../views/swipe/SwipeVideoCardView.js';
import SwipeBallotController from './SwipeBallotController.js';
import SwipePostController from './SwipePostController.js';
import { createKey } from 'private-parts';

const _ = createKey();

export default class SwipeVideoCardController extends VideoCardController {
    constructor(card, meta, deck) {
        super(card, deck);

        _(this).meta = meta;

        this.view = this.addView(new SwipeVideoCardView());

        this.flippable = true;

        this.model.on('deactivate', () => this.view.flip(false));
        this.view.on('flip', () => {
            if (this.player.paused) { return; }

            this.player.pause();
            this.view.once('unflip', () => this.player.play());
        });
    }

    initBallot() {
        const { model } = this;
        const { modules: { ballot } } = model;

        if (!ballot) { return; }

        const BallotCtrl = this.BallotCtrl = new SwipeBallotController(ballot, model);

        this.player.on('play', () => BallotCtrl.deactivate());
        this.player.on('pause', () => BallotCtrl.activate());
        this.model.on('deactivate', () => BallotCtrl.deactivate());
    }

    initPost() {
        const { model: { modules: { post } } } = this;

        if (!post || !post.ballot) { return; }

        const PostCtrl = this.PostCtrl = new SwipePostController(post);

        this.model.on('deactivate', () => PostCtrl.deactivate());

        this.player.on('play', () => PostCtrl.deactivate());
        this.player.on('ended', () => {
            if (post.ballot.choice === null) { PostCtrl.activate(); }
        });

        PostCtrl.on('vote', () => PostCtrl.deactivate());
    }

    render() {
        const { meta: { number, total } } = _(this);

        this.view.update({
            number: number.toString(),
            total: total.toString()
        });

        return super.render();
    }

    canAutoadvance() {
        const { model: { modules } } = this;

        return !('ballot' in modules) &&
            (!('post' in modules) || !modules.post.ballot || modules.post.ballot.choice !== null);
    }

    toggleFlip() {
        this.view.flip(!this.view.flipped);
    }
}
