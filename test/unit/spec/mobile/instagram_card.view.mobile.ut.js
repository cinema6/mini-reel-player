import MobileInstagramCardView from '../../../../src/views/mobile/MobileInstagramCardView.js';
import CardView from '../../../../src/views/CardView.js';

describe('MobileInstagramCardView', function() {
    let view;

    beforeEach(function() {
        view = new MobileInstagramCardView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(CardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of MobileInstagramCardView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/mobile/MobileInstagramCardView.html'));
            });
        });
    });
});
