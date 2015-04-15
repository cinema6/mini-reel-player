import ModalBallotResultsController from '../../../src/controllers/ModalBallotResultsController.js';
import BallotResultsController from '../../../src/controllers/BallotResultsController.js';
import { EventEmitter } from 'events';
import ModalBallotResultsView from '../../../src/views/ModalBallotResultsView.js';

describe('ModalBallotResultsController', function() {
    let ModalBallotResultsCtrl;
    let ballot;

    beforeEach(function() {
        ballot = new EventEmitter();
        spyOn(ModalBallotResultsController.prototype, 'addView').and.callThrough();

        ModalBallotResultsCtrl = new ModalBallotResultsController(ballot);
    });

    it('should exist', function() {
        expect(ModalBallotResultsCtrl).toEqual(jasmine.any(BallotResultsController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a ModalBallotResultsView', function() {
                expect(ModalBallotResultsCtrl.view).toEqual(jasmine.any(ModalBallotResultsView));
                expect(ModalBallotResultsCtrl.addView).toHaveBeenCalledWith(ModalBallotResultsCtrl.view);
            });
        });
    });
});
