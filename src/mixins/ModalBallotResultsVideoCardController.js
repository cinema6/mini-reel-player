import ModalBallotResultsController from '../controllers/ModalBallotResultsController.js';

function ModalBallotResultsVideoCardController() {}
ModalBallotResultsVideoCardController.prototype = {
    initBallotResults: function() {
        const { BallotCtrl } = this;
        if (!BallotCtrl) { return; }

        const BallotResultsCtrl =
            this.BallotResultsCtrl =
            new ModalBallotResultsController(BallotCtrl.model);

        BallotResultsCtrl.on('activate', () => this.view.playerOutlet.hide());
        BallotResultsCtrl.on('deactivate', () => this.view.playerOutlet.show());

        BallotCtrl.on('voted', () => BallotResultsCtrl.activate());

        this.player.on('play', () => BallotResultsCtrl.deactivate());
        this.player.on('pause', () => {
            if (BallotCtrl.model.choice !== null) {
                BallotResultsCtrl.activate();
            }
        });

        this.model.on('deactivate', () => BallotResultsCtrl.deactivate());
    },

    canAutoadvance: function() {
        const { modules } = this.model;

        return this.super() && (!('ballot' in modules) || modules.ballot.choice === null);
    },

    render: function() {
        this.super();

        if (this.BallotResultsCtrl) {
            this.BallotResultsCtrl.renderInto(this.view.ballotResultsOutlet);
        }
    }
};

export default ModalBallotResultsVideoCardController;
