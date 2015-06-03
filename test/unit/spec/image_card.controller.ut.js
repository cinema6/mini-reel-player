import ImageCardController from '../../../src/controllers/ImageCardController.js';
import ImageCardView from '../../../src/views/ImageCardView.js';
import CardController from '../../../src/controllers/CardController.js';
import ImageCard from '../../../src/models/ImageCard.js';

describe('ImageCardController', function() {
    let ImageCardCtrl;
    let card;

    beforeEach(function() {
        card = new ImageCard({ data: {} }, {
            data: {
                collateral: {}
            }
        });

        ImageCardCtrl = new ImageCardController(card);
    });

    it('should exist', function() {
        expect(ImageCardCtrl).toEqual(jasmine.any(CardController));
    });

    describe('methods', function() {
        describe('render()', function() {
            let result;

            beforeEach(function() {
                ImageCardCtrl.view = new ImageCardView();
                ImageCardCtrl.model = new ImageCard({
                    data: {
                        embedCode: "some embed code"
                    }
                }, { data: { collateral: {  } } });
                spyOn(CardController.prototype, 'render');
                spyOn(ImageCardCtrl.view, 'loadEmbed');
                result = ImageCardCtrl.render();
            });

            it('should call super', function() {
                expect(CardController.prototype.render).toHaveBeenCalled();
            });

            it('should load the embed', function() {
                expect(ImageCardCtrl.view.loadEmbed).toHaveBeenCalledWith('some embed code');
            });
        });
    });

});
