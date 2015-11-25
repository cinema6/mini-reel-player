import LightboxArticleCardView from '../../../../src/views/lightbox/LightboxArticleCardView.js';
import CardView from '../../../../src/views/CardView.js';

describe('LightboxArticleCardView', function() {
    let view;

    beforeEach(function() {
        view = new LightboxArticleCardView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(CardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of LightboxArticleCardView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/lightbox/LightboxArticleCardView.html'));
            });
        });
    });
});
