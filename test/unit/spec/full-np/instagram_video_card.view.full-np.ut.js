import FullNPInstagramVideoCardView from '../../../../src/views/full-np/FullNPInstagramVideoCardView.js';
import InstagramCardView from '../../../../src/views/InstagramCardView.js';

describe('FullNPInstagramVideoCardView', function() {
    let view;

    beforeEach(function() {
        view = new FullNPInstagramVideoCardView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(InstagramCardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of FullNPInstagramVideoCardView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/full-np/FullNPInstagramVideoCardView.html'));
            });
        });
    });
});
