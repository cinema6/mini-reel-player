import MobileInstagramVideoCardView from '../../../../src/views/mobile/MobileInstagramVideoCardView.js';
import InstagramCardView from '../../../../src/views/InstagramCardView.js';

describe('MobileInstagramVideoCardView', function() {
    let view;

    beforeEach(function() {
        view = new MobileInstagramVideoCardView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(InstagramCardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of MobileInstagramVideoCardView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/mobile/MobileInstagramVideoCardView.html'));
            });
        });
    });
});
