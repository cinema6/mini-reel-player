import LightboxArticleCardController from '../../../../src/controllers/lightbox/LightboxArticleCardController.js';
import ArticleCardController from '../../../../src/controllers/ArticleCardController.js';
import View from '../../../../lib/core/View.js';
import LightboxArticleCardView from '../../../../src/views/lightbox/LightboxArticleCardView.js';
import {EventEmitter} from 'events';

describe('LightboxArticleCardController', function() {
    let LightboxArticleCardCtrl;
    let card;
    let parentView;

    beforeEach(function() {
        card = new EventEmitter();
        parentView = new View();
        spyOn(LightboxArticleCardController.prototype, 'addView').and.callThrough();

        LightboxArticleCardCtrl = new LightboxArticleCardController(card, parentView);
    });

    it('should exist', function() {
        expect(LightboxArticleCardCtrl).toEqual(jasmine.any(ArticleCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a LightboxArticleCardView', function() {
                expect(LightboxArticleCardCtrl.view).toEqual(jasmine.any(LightboxArticleCardView));
                expect(LightboxArticleCardCtrl.addView).toHaveBeenCalledWith(LightboxArticleCardCtrl.view);
            });
        });
    });
});
