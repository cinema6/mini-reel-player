import MobileInstagramVideoCardView from '../../../../src/views/mobile/MobileInstagramVideoCardView.js';
import CardView from '../../../../src/views/CardView.js';

describe('MobileInstagramVideoCardView', function() {
    let view;

    beforeEach(function() {
        view = new MobileInstagramVideoCardView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(CardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of MobileInstagramVideoCardView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/mobile/MobileInstagramVideoCardView.html'));
            });
        });
    });
});
