import FullInstagramVideoCardView from '../../../../src/views/full/FullInstagramVideoCardView.js';
import InstagramCardView from '../../../../src/views/InstagramCardView.js';

describe('FullInstagramVideoCardView', function() {
    let view;

    beforeEach(function() {
        view = new FullInstagramVideoCardView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(InstagramCardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of FullInstagramVideoCardView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/full/FullInstagramVideoCardView.html'));
            });
        });
    });
});
