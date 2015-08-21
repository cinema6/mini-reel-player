import LightInstagramImageCardView from '../../../../src/views/light/LightInstagramImageCardView.js';
import InstagramCardView from '../../../../src/views/InstagramCardView.js';

describe('LightInstagramImageCardView', function() {
    let view;

    beforeEach(function() {
        view = new LightInstagramImageCardView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(InstagramCardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of LightInstagramImageCardView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/light/LightInstagramImageCardView.html'));
            });
        });
    });
});
