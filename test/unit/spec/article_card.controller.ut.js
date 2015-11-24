import ArticleCardController from '../../../src/controllers/ArticleCardController.js';
import CardController from '../../../src/controllers/CardController.js';
import FullNPArticleCardView from '../../../src/views/full-np/FullNPArticleCardView.js';
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
        ArticleCardCtrl.view = new FullNPArticleCardView();

    });

    it('should exist', function() {
        expect(ArticleCardCtrl).toEqual(jasmine.any(CardController));
    });

    describe('properties', function() {
        describe('isRendered', function() {
            it('should be initialized to false', function() {
                expect(ArticleCardCtrl.isRendered).toBe(false);
            });
        });
    });

    describe('events', function() {
        describe('model', function() {

            beforeEach(function() {
                spyOn(ArticleCardCtrl, 'renderArticle');
            });

            describe('prepare', function() {
                it('should call renderArticle if not already rendered', function() {
                    card.prepare();
                    expect(ArticleCardCtrl.renderArticle).toHaveBeenCalled();
                });

                it('should not call renderArticle if already rendered', function() {
                    ArticleCardCtrl.isRendered = true;
                    card.prepare();
                    expect(ArticleCardCtrl.renderArticle).not.toHaveBeenCalled();
                });
            });

            describe('activate', function() {
                it('should call renderArticle if not already rendered', function() {
                    card.activate();
                    expect(ArticleCardCtrl.renderArticle).toHaveBeenCalled();
                });

                it('should not call renderArticle if already rendered', function() {
                    ArticleCardCtrl.isRendered = true;
                    card.prepare();
                    expect(ArticleCardCtrl.renderArticle).not.toHaveBeenCalled();
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

            it('should set the isRendered property to true', function() {
                expect(ArticleCardCtrl.isRendered).toBe(true);
            });
        });
    });

});
