import ArticleCardController from '../../../src/controllers/ArticleCardController.js';
import CardController from '../../../src/controllers/CardController.js';
import FullArticleCardView from '../../../src/views/full/FullArticleCardView.js';
import ArticleCard from '../../../src/models/ArticleCard.js';

describe('ArticleCardController', function() {
    let ArticleCardCtrl;
    let card;

    beforeEach(function() {
        card = new ArticleCard({
            data: {
                src: 'http://www.cinema6.com',
                thumbs: { }
            }
        }, {
            data: {
                collateral: {}
            }
        });

        ArticleCardCtrl = new ArticleCardController(card);
        ArticleCardCtrl.model = card;
        ArticleCardCtrl.view = new FullArticleCardView();

    });

    it('should exist', function() {
        expect(ArticleCardCtrl).toEqual(jasmine.any(CardController));
    });

    describe('events', function() {
        describe('model', function() {

            beforeEach(function() {
                spyOn(ArticleCardCtrl, 'renderArticle');
            });

            describe('prepare', function() {
                it('should call renderArticle', function() {
                    card.prepare();
                    expect(ArticleCardCtrl.renderArticle).toHaveBeenCalled();
                });
            });

            describe('activate', function() {
                it('should call renderArticle', function() {
                    card.activate();
                    expect(ArticleCardCtrl.renderArticle).toHaveBeenCalled();
                });
            });
        });
    });

    describe('methods', function() {
        describe('renderArticle', function() {
            beforeEach(function() {
                spyOn(ArticleCardCtrl.view, 'update');
                ArticleCardCtrl.renderArticle();
            });

            it('should update the source on the template', function() {
                var expectedOutput = {
                    src: 'http://www.cinema6.com'
                };
                expect(ArticleCardCtrl.view.update).toHaveBeenCalledWith(expectedOutput);
            });
        });
    });

});
