import MobileArticleCardView from '../../../../src/views/mobile/MobileArticleCardView.js';
import CardView from '../../../../src/views/CardView.js';

describe('MobileArticleCardView', function() {
    let mobileArticleCardView;

    beforeEach(function() {
        mobileArticleCardView = new MobileArticleCardView();
    });

    it('should be a CardView', function() {
        expect(mobileArticleCardView).toEqual(jasmine.any(CardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be a MobileVideoCardView.html', function() {
                expect(mobileArticleCardView.template).toBe(require('../../../../src/views/mobile/MobileArticleCardView.html'));
            });
        });
    });
});
