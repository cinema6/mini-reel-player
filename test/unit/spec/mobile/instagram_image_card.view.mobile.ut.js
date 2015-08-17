import MobileInstagramImageCardView from '../../../../src/views/mobile/MobileInstagramImageCardView.js';
import CardView from '../../../../src/views/CardView.js';

describe('MobileInstagramImageCardView', function() {
    let view;

    beforeEach(function() {
        view = new MobileInstagramImageCardView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(CardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of MobileInstagramImageCardView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/mobile/MobileInstagramImageCardView.html'));
            });
        });
    });
});
