import FullInstagramVideoCardView from '../../../../src/views/full/FullInstagramVideoCardView.js';
import CardView from '../../../../src/views/CardView.js';

describe('FullInstagramVideoCardView', function() {
    let view;

    beforeEach(function() {
        view = new FullInstagramVideoCardView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(CardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of FullInstagramVideoCardView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/full/FullInstagramVideoCardView.html'));
            });
        });
    });
});
