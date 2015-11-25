import InlineBallotResultsView from '../../../src/views/InlineBallotResultsView.js';
import BallotResultsView from '../../../src/views/BallotResultsView.js';

describe('InlineBallotResultsView', function() {
    let view;

    beforeEach(function() {
        view = new InlineBallotResultsView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(BallotResultsView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of InlineBallotResultsView.html', function() {
                expect(view.template).toBe(require('../../../src/views/InlineBallotResultsView.html'));
            });
        });
    });
});
