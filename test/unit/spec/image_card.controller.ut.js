import ImageCardController from '../../../src/controllers/ImageCardController.js';
import CardController from '../../../src/controllers/CardController.js';
import CardView from '../../../src/views/CardView.js';
import ImageCard from '../../../src/models/ImageCard.js';
import FlickrEmbedView from '../../../src/views/image_embeds/FlickrEmbedView.js';
import GettyEmbedView from '../../../src/views/image_embeds/GettyEmbedView.js';
import TemplateView from '../../../lib/core/TemplateView.js';

describe('ImageCardController', function() {
    let ImageCardCtrl;
    let card;

    beforeEach(function() {
        card = new ImageCard({
            data: {
                href: 'https://flic.kr/p/12345',
                width: '100',
                height: '100',
                imageid: '12345',
                thumbs: { }
            }
        }, {
            data: {
                collateral: {}
            }
        });

        ImageCardCtrl = new ImageCardController(card);
        ImageCardCtrl.model = card;
        ImageCardCtrl.view = new CardView();
        ImageCardCtrl.view.imageOutlet = new TemplateView();

    });

    it('should exist', function() {
        expect(ImageCardCtrl).toEqual(jasmine.any(CardController));
    });

    describe('methods', function() {

        describe('appendEmbedView', function() {
            let embedView;

            beforeEach(function() {
                embedView = new FlickrEmbedView();
                spyOn(ImageCardCtrl.view.imageOutlet, 'append');
                spyOn(embedView, 'update');
                ImageCardCtrl.appendEmbedView(embedView);
            });

            it('should append the view to the imageOutlet', function() {
                expect(ImageCardCtrl.view.imageOutlet.append).toHaveBeenCalledWith(embedView);
            });

            it('should update the embed view', function() {
                expect(embedView.update).toHaveBeenCalledWith({
                    href: 'https://flic.kr/p/12345',
                    width: '100',
                    height: '100',
                    imageid: '12345'
                });
            });
        });

        describe('render()', function() {
            let result;

            beforeEach(function() {
                spyOn(CardController.prototype, 'render');
                result = ImageCardCtrl.render();
            });

            it('should call super', function() {
                expect(CardController.prototype.render).toHaveBeenCalled();
            });

            describe('flickr', function() {
                beforeEach(function() {
                    ImageCardCtrl.model = new ImageCard({
                        data: {
                            service: 'flickr',
                            thumbs: { }
                        }
                    }, { data: { collateral: {  } } });
                    spyOn(ImageCardCtrl, 'appendEmbedView');
                    result = ImageCardCtrl.render();
                });

                it('should load a flickr embed view', function() {
                    expect(ImageCardCtrl.appendEmbedView).toHaveBeenCalledWith(jasmine.any(FlickrEmbedView));
                });
            });

            describe('getty', function() {
                beforeEach(function() {
                    ImageCardCtrl.model = new ImageCard({
                        data: {
                            service: 'getty',
                            thumbs: { }
                        }
                    }, { data: { collateral: {  } } });
                    spyOn(ImageCardCtrl, 'appendEmbedView');
                    result = ImageCardCtrl.render();
                });

                it('should load a getty embed view', function() {
                    expect(ImageCardCtrl.appendEmbedView).toHaveBeenCalledWith(jasmine.any(GettyEmbedView));
                });
            });
        });
    });

});
