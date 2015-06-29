import LightArticleCardView from '../../../../src/views/light/LightArticleCardView.js';
import CardView from '../../../../src/views/CardView.js';

describe('LightVideoCardView', function() {
    let view;

    beforeEach(function() {
        view = new LightArticleCardView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(CardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of LightArticleCardView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/light/LightArticleCardView.html'));
            });
        });

    });
});
