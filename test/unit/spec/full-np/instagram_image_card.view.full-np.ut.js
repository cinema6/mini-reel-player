import FullNPInstagramImageCardView from '../../../../src/views/full-np/FullNPInstagramImageCardView.js';
import InstagramCardView from '../../../../src/views/InstagramCardView.js';

describe('FullNPInstagramImageCardView', function() {
    let view;

    beforeEach(function() {
        view = new FullNPInstagramImageCardView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(InstagramCardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of FullNPInstagramImageCardView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/full-np/FullNPInstagramImageCardView.html'));
            });
        });
    });
});
