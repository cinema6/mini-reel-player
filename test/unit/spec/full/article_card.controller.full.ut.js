import FullArticleCardController from '../../../../src/controllers/full/FullArticleCardController.js';
import ArticleCardController from '../../../../src/controllers/ArticleCardController.js';
import View from '../../../../lib/core/View.js';
import FullArticleCardView from '../../../../src/views/full/FullVideoCardView.js';
import {EventEmitter} from 'events';

describe('FullArticleCardController', function() {
    let FullArticleCardCtrl;
    let card;
    let parentView;

    beforeEach(function() {
        card = new EventEmitter();
        parentView = new View();
        spyOn(FullArticleCardController.prototype, 'addView').and.callThrough();

        FullArticleCardCtrl = new FullArticleCardController(card, parentView);
    });

    it('should exist', function() {
        expect(FullArticleCardCtrl).toEqual(jasmine.any(ArticleCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a FullArticleCardView', function() {
                expect(FullArticleCardCtrl.view).toEqual(jasmine.any(FullArticleCardView));
                expect(FullArticleCardCtrl.addView).toHaveBeenCalledWith(FullArticleCardCtrl.view);
            });
        });
    });

    describe('methods:', function() {
        describe('advance()', function() {
            beforeEach(function() {
                card.complete = jasmine.createSpy('card.complete()');

                FullArticleCardCtrl.advance();
            });

            it('should call complete() on the card', function() {
                expect(card.complete).toHaveBeenCalled();
            });
        });
    });
});
