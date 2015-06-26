import ImageCardController from '../../../src/controllers/ImageCardController.js';
import CardController from '../../../src/controllers/CardController.js';
import FullVideoCardView from '../../../src/views/full/FullVideoCardView.js';
import ImageCard from '../../../src/models/ImageCard.js';
import FlickrEmbedView from '../../../src/views/image_embeds/FlickrEmbedView.js';
import GettyEmbedView from '../../../src/views/image_embeds/GettyEmbedView.js';
import PlayerOutletView from '../../../src/views/PlayerOutletView.js';
import Runner from '../../../lib/Runner.js';

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
        ImageCardCtrl.view = new FullVideoCardView();
        ImageCardCtrl.view.playerOutlet = new PlayerOutletView();

    });

    it('should exist', function() {
        expect(ImageCardCtrl).toEqual(jasmine.any(CardController));
    });

    describe('methods', function() {

        describe('appendEmbedView', function() {
            let embedView;

            beforeEach(function() {
                embedView = new FlickrEmbedView();
                spyOn(ImageCardCtrl.view.playerOutlet, 'append');
                spyOn(embedView, 'update');
                ImageCardCtrl.appendEmbedView(embedView);
            });

            it('should append the view to the videoOutlet', function() {
                expect(ImageCardCtrl.view.playerOutlet.append).toHaveBeenCalledWith(embedView);
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
                spyOn(ImageCardCtrl.view, 'update');
                Runner.run(function() {
                    result = ImageCardCtrl.render();
                });
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
                    Runner.run(function() {
                        result = ImageCardCtrl.render();
                    });
                });

                it('should load a flickr embed view', function() {
                    expect(ImageCardCtrl.appendEmbedView).toHaveBeenCalledWith(jasmine.any(FlickrEmbedView));
                });

                it('should update the source on the template', function() {
                    var expectedOutput = {
                        source: 'Flickr',
                        href: 'https://www.flickr.com'
                    };
                    expect(ImageCardCtrl.view.update).toHaveBeenCalledWith(expectedOutput);
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
                    Runner.run(function() {
                        result = ImageCardCtrl.render();
                    });
                });

                it('should load a getty embed view', function() {
                    expect(ImageCardCtrl.appendEmbedView).toHaveBeenCalledWith(jasmine.any(GettyEmbedView));
                });

                it('should update the source on the template', function() {
                    var expectedOutput = {
                        source: 'GettyImages',
                        href: 'http://www.gettyimages.com'
                    };
                    expect(ImageCardCtrl.view.update).toHaveBeenCalledWith(expectedOutput);
                });
            });
        });
    });

});
