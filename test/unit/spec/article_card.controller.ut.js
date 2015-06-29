import ArticleCardController from '../../../src/controllers/ArticleCardController.js';
import CardController from '../../../src/controllers/CardController.js';
import FullArticleCardView from '../../../src/views/full/FullArticleCardView.js';
import ArticleCard from '../../../src/models/ArticleCard.js';
import Runner from '../../../lib/Runner.js';

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

    describe('methods', function() {
        describe('render()', function() {
            let result;

            beforeEach(function() {
                spyOn(CardController.prototype, 'render');
                spyOn(ArticleCardCtrl.view, 'update');
                Runner.run(function() {
                    result = ArticleCardCtrl.render();
                });
            });

            it('should call super', function() {
                expect(CardController.prototype.render).toHaveBeenCalled();
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
