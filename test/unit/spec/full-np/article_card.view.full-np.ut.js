import FullNPArticleCardView from '../../../../src/views/full-np/FullNPArticleCardView.js';
import CardView from '../../../../src/views/CardView.js';

describe('FullNPArticleCardView', function() {
    let view;

    beforeEach(function() {
        view = new FullNPArticleCardView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(CardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of FullNPArticleCardView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/full-np/FullNPArticleCardView.html'));
            });
        });
    });
});
