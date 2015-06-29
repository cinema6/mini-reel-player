import MobileArticleCardView from '../../../../src/views/mobile/MobileArticleCardView.js';
import CardView from '../../../../src/views/CardView.js';
import Runner from '../../../../lib/Runner.js';
import View from '../../../../lib/core/View.js';

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

        describe('displayAdOutlet', function() {
            beforeEach(function() {
                Runner.run(() => mobileArticleCardView.create());
            });

            it('should be a view', function() {
                expect(mobileArticleCardView.displayAdOutlet).toEqual(jasmine.any(View));
            });
        });

    });
});
