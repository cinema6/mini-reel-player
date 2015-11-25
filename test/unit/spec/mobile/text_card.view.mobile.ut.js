import MobileTextCardView from '../../../../src/views/mobile/MobileTextCardView.js';
import CardView from '../../../../src/views/CardView.js';

describe('MobileTextCardView', function() {
    let textCardView;

    beforeEach(function() {
        textCardView = new MobileTextCardView();
    });

    it('should be a CardView', function() {
        expect(textCardView).toEqual(jasmine.any(CardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of MobileTextCardView.html', function() {
                expect(textCardView.template).toBe(require('../../../../src/views/mobile/MobileTextCardView.html'));
            });
        });
    });
});
