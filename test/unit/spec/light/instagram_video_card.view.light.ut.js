import LightInstagramVideoCardView from '../../../../src/views/light/LightInstagramVideoCardView.js';
import CardView from '../../../../src/views/CardView.js';

describe('LightInstagramVideoCardView', function() {
    let view;

    beforeEach(function() {
        view = new LightInstagramVideoCardView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(CardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of LightInstagramVideoCardView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/light/LightInstagramVideoCardView.html'));
            });
        });
    });
});
