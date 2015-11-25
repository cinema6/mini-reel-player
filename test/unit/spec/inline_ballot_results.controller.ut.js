import InlineBallotResultsController from '../../../src/controllers/InlineBallotResultsController.js';
import BallotResultsController from '../../../src/controllers/BallotResultsController.js';
import { EventEmitter } from 'events';
import InlineBallotResultsView from '../../../src/views/InlineBallotResultsView.js';

describe('InlineBallotResultsController', function() {
    let InlineBallotResultsCtrl;
    let ballot;

    beforeEach(function() {
        ballot = new EventEmitter();
        spyOn(InlineBallotResultsController.prototype, 'addView').and.callThrough();

        InlineBallotResultsCtrl = new InlineBallotResultsController(ballot);
    });

    it('should exist', function() {
        expect(InlineBallotResultsCtrl).toEqual(jasmine.any(BallotResultsController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be an InlineBallotResultsView', function() {
                expect(InlineBallotResultsCtrl.view).toEqual(jasmine.any(InlineBallotResultsView));
                expect(InlineBallotResultsCtrl.addView).toHaveBeenCalledWith(InlineBallotResultsCtrl.view);
            });
        });
    });
});
