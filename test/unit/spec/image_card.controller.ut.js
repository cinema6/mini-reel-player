import ImageCardController from '../../../src/controllers/ImageCardController.js';
import CardController from '../../../src/controllers/CardController.js';
import FullVideoCardView from '../../../src/views/full/FullVideoCardView.js';
import ImageCard from '../../../src/models/ImageCard.js';
import FlickrEmbedView from '../../../src/views/image_embeds/FlickrEmbedView.js';
import GettyEmbedView from '../../../src/views/image_embeds/GettyEmbedView.js';
import PlayerOutletView from '../../../src/views/PlayerOutletView.js';

describe('ImageCardController', function() {
    let ImageCardCtrl;
    let card;

    beforeEach(function() {
        card = new ImageCard({
            data: {
                src: 'www.flickr.com/image.jpg',
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

    describe('events', function() {
        describe('model', function() {
            beforeEach(function() {
                spyOn(ImageCardCtrl, 'renderImage');
            });

            describe('prepare', function() {
                it('should call render image', function() {
                    card.prepare();
                    expect(ImageCardCtrl.renderImage).toHaveBeenCalled();
                });
            });

            describe('activate', function() {
                it('should call render image', function() {
                    card.activate();
                    expect(ImageCardCtrl.renderImage).toHaveBeenCalled();
                });
            });
        });
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
                    src: 'www.flickr.com/image.jpg',
                    width: '100',
                    height: '100',
                    imageid: '12345'
                });
            });
        });

        describe('renderImage', function() {
            beforeEach(function() {
                spyOn(ImageCardCtrl.view, 'update');
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
                    ImageCardCtrl.renderImage();
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
                    ImageCardCtrl.renderImage();
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
