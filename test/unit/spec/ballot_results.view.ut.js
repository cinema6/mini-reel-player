import BallotResultsView from '../../../src/views/BallotResultsView.js';
import TemplateView from '../../../lib/core/TemplateView.js';
import Hideable from '../../../src/mixins/Hideable.js';

describe('BallotResultsView', function() {
    let view;

    beforeEach(function() {
        view = new BallotResultsView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(TemplateView));
    });

    it('should be Hideable', function() {
        expect(BallotResultsView.mixins).toContain(Hideable);
    });

    describe('properties:', function() {
        describe('tag', function() {
            it('should be "div"', function() {
                expect(view.tag).toBe('div');
            });
        });
    });
});
