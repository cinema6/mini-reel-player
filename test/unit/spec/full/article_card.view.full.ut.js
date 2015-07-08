import FullArticleCardView from '../../../../src/views/full/FullArticleCardView.js';
import CardView from '../../../../src/views/CardView.js';

describe('FullArticleCardView', function() {
    let view;

    beforeEach(function() {
        view = new FullArticleCardView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(CardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of FullArticleCardView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/full/FullArticleCardView.html'));
            });
        });
    });
});
