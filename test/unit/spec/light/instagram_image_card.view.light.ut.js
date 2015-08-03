import LightInstagramImageCardView from '../../../../src/views/light/LightInstagramImageCardView.js';
import CardView from '../../../../src/views/CardView.js';

describe('LightInstagramImageCardView', function() {
    let view;

    beforeEach(function() {
        view = new LightInstagramImageCardView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(CardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of LightInstagramImageCardView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/light/LightInstagramImageCardView.html'));
            });
        });
    });
});
