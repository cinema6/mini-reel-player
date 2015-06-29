import LightArticleCardController from '../../../../src/controllers/light/LightArticleCardController.js';
import ArticleCardController from '../../../../src/controllers/ArticleCardController.js';
import View from '../../../../lib/core/View.js';
import LightArticleCardView from '../../../../src/views/light/LightArticleCardView.js';
import {EventEmitter} from 'events';

describe('LightArticleCardController', function() {
    let LightArticleCardCtrl;
    let card;
    let parentView;

    beforeEach(function() {
        card = new EventEmitter();
        parentView = new View();
        spyOn(LightArticleCardController.prototype, 'addView').and.callThrough();

        LightArticleCardCtrl = new LightArticleCardController(card, parentView);
    });

    it('should exist', function() {
        expect(LightArticleCardCtrl).toEqual(jasmine.any(ArticleCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a LightArticleCardView', function() {
                expect(LightArticleCardCtrl.view).toEqual(jasmine.any(LightArticleCardView));
                expect(LightArticleCardCtrl.addView).toHaveBeenCalledWith(LightArticleCardCtrl.view);
            });
        });
    });

    describe('methods:', function() {
        describe('advance()', function() {
            beforeEach(function() {
                card.complete = jasmine.createSpy('card.complete()');

                LightArticleCardCtrl.advance();
            });

            it('should call complete() on the card', function() {
                expect(card.complete).toHaveBeenCalled();
            });
        });
    });
});
