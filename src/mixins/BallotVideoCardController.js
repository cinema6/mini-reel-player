import BallotController from '../controllers/BallotController.js';

function BallotVideoCardController() {}
BallotVideoCardController.prototype = {
    initBallot: function() {
        const { modules: { ballot } } = this.model;
        if (!ballot) { return; }

        const BallotCtrl = this.BallotCtrl = new BallotController(ballot);

        BallotCtrl.on('activate', () => this.view.playerOutlet.hide());
        BallotCtrl.on('deactivate', () => this.view.playerOutlet.show());
        BallotCtrl.on('vote', () => BallotCtrl.deactivate());

        this.player.on('play', () => BallotCtrl.deactivate());
        this.player.on('pause', () => {
            if (ballot.choice === null) { BallotCtrl.activate(); }
        });

        this.model.on('deactivate', () => BallotCtrl.deactivate());
    },

    render: function() {
        this.super();
        if (this.BallotCtrl) { this.BallotCtrl.renderInto(this.view.ballotOutlet); }
    },

    canAutoadvance: function() {
        const { modules } = this.model;
        return this.super() && (!('ballot' in modules) || modules.ballot.choice !== null);
    }
};

export default BallotVideoCardController;
