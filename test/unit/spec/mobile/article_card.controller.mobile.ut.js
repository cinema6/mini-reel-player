import MobileArticleCardController from '../../../../src/controllers/mobile/MobileArticleCardController.js';
import ArticleCardController from '../../../../src/controllers/ArticleCardController.js';
import View from '../../../../lib/core/View.js';
import MobileArticleCardView from '../../../../src/views/mobile/MobileArticleCardView.js';
import {EventEmitter} from 'events';

describe('MobileArticleCardController', function() {
    let MobileArticleCardCtrl;
    let card;
    let parentView;

    beforeEach(function() {
        card = new EventEmitter();
        parentView = new View();
        spyOn(MobileArticleCardController.prototype, 'addView').and.callThrough();

        MobileArticleCardCtrl = new MobileArticleCardController(card, parentView);
    });

    it('should exist', function() {
        expect(MobileArticleCardCtrl).toEqual(jasmine.any(ArticleCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a MobileVideoCardView', function() {
                expect(MobileArticleCardCtrl.view).toEqual(jasmine.any(MobileArticleCardView));
                expect(MobileArticleCardCtrl.addView).toHaveBeenCalledWith(MobileArticleCardCtrl.view);
            });
        });
    });
});
