import FullInstagramImageCardView from '../../../../src/views/full/FullInstagramImageCardView.js';
import InstagramCardView from '../../../../src/views/InstagramCardView.js';

describe('FullInstagramImageCardView', function() {
    let view;

    beforeEach(function() {
        view = new FullInstagramImageCardView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(InstagramCardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of FullInstagramImageCardView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/full/FullInstagramImageCardView.html'));
            });
        });
    });
});
