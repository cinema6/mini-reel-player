import FullArticleCardController from '../../../../src/controllers/full/FullArticleCardController.js';
import ArticleCardController from '../../../../src/controllers/ArticleCardController.js';
import View from '../../../../lib/core/View.js';
import FullArticleCardView from '../../../../src/views/full/FullArticleCardView.js';
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
});
