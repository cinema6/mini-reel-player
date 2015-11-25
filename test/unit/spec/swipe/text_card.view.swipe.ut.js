import SwipeTextCardView from '../../../../src/views/swipe/SwipeTextCardView.js';
import CardView from '../../../../src/views/CardView.js';

describe('SwipeTextCardView', function() {
    let view;

    beforeEach(function() {
        view = new SwipeTextCardView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(CardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of SwipeTextCardView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/swipe/SwipeTextCardView.html'));
            });
        });
    });
});
