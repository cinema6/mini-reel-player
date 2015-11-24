import FullNPArticleCardController from '../../../../src/controllers/full-np/FullNPArticleCardController.js';
import ArticleCardController from '../../../../src/controllers/ArticleCardController.js';
import View from '../../../../lib/core/View.js';
import FullNPArticleCardView from '../../../../src/views/full-np/FullNPArticleCardView.js';
import {EventEmitter} from 'events';

describe('FullNPArticleCardController', function() {
    let FullNPArticleCardCtrl;
    let card;
    let parentView;

    beforeEach(function() {
        card = new EventEmitter();
        parentView = new View();
        spyOn(FullNPArticleCardController.prototype, 'addView').and.callThrough();

        FullNPArticleCardCtrl = new FullNPArticleCardController(card, parentView);
    });

    it('should exist', function() {
        expect(FullNPArticleCardCtrl).toEqual(jasmine.any(ArticleCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a FullNPArticleCardView', function() {
                expect(FullNPArticleCardCtrl.view).toEqual(jasmine.any(FullNPArticleCardView));
                expect(FullNPArticleCardCtrl.addView).toHaveBeenCalledWith(FullNPArticleCardCtrl.view);
            });
        });
    });
});
