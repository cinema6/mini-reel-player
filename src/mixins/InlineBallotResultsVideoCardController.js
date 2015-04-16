import InlineBallotResultsController from '../controllers/InlineBallotResultsController.js';

function InlineBallotResultsVideoCardController() {}
InlineBallotResultsVideoCardController.prototype = {
    initBallotResults: function() {
        const { BallotCtrl } = this;
        if (!BallotCtrl) { return; }

        const BallotResultsCtrl =
            this.BallotResultsCtrl =
            new InlineBallotResultsController(BallotCtrl.model);

        BallotCtrl.on('voted', () => BallotResultsCtrl.activate());
    },

    render: function() {
        this.super();

        if (this.BallotResultsCtrl) {
            this.BallotResultsCtrl.renderInto(this.view.ballotResultsOutlet);
        }
    }
};

export default InlineBallotResultsVideoCardController;
