import ImageCardController from '../../../src/controllers/ImageCardController.js';
import CardController from '../../../src/controllers/CardController.js';
import FullVideoCardView from '../../../src/views/full/FullVideoCardView.js';
import ImageCard from '../../../src/models/ImageCard.js';
import FlickrEmbedView from '../../../src/views/image_embeds/FlickrEmbedView.js';
import GettyEmbedView from '../../../src/views/image_embeds/GettyEmbedView.js';
import WebEmbedView from '../../../src/views/image_embeds/WebEmbedView.js';
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

    describe('properties', function() {
        describe('isRendered', function() {
            it('should be initialized to false', function() {
                expect(ImageCardCtrl.isRendered).toBe(false);
            });
        });
    });

    describe('events', function() {
        describe('model', function() {
            beforeEach(function() {
                spyOn(ImageCardCtrl, 'renderImage');
            });

            describe('prepare', function() {
                it('should call renderImage if not already rendered', function() {
                    card.prepare();
                    expect(ImageCardCtrl.renderImage).toHaveBeenCalled();
                });

                it('should not call renderImage if already rendered', function() {
                    ImageCardCtrl.isRendered = true;
                    card.prepare();
                    expect(ImageCardCtrl.renderImage).not.toHaveBeenCalled();
                });
            });

            describe('activate', function() {
                it('should call renderImage if not already rendered', function() {
                    card.activate();
                    expect(ImageCardCtrl.renderImage).toHaveBeenCalled();
                });

                it('should not call renderImage if already rendered', function() {
                    ImageCardCtrl.isRendered = true;
                    card.prepare();
                    expect(ImageCardCtrl.renderImage).not.toHaveBeenCalled();
                });
            });
        });
    });

    describe('methods', function() {
        describe('appendEmbedView', function() {
            let embedView;

            beforeEach(function() {
                embedView = new FlickrEmbedView();
                spyOn(embedView, 'update');
                spyOn(ImageCardCtrl.view, 'create');
                spyOn(ImageCardCtrl.view.playerOutlet, 'append');
            });

            it('should not create the view if playerOutlet is defined', function() {
                ImageCardCtrl.appendEmbedView(embedView);
                expect(ImageCardCtrl.view.create).not.toHaveBeenCalled();
            });

            it('should create the view if playerOutlet is not defined', function() {
                var playerOutlet = ImageCardCtrl.view.playerOutlet;
                ImageCardCtrl.view.playerOutlet = undefined;
                ImageCardCtrl.view.create.and.callFake(function() {
                    ImageCardCtrl.view.playerOutlet = playerOutlet;
                });
                ImageCardCtrl.appendEmbedView(embedView);
                expect(ImageCardCtrl.view.create).toHaveBeenCalled();
            });

            it('should append the view to the videoOutlet', function() {
                ImageCardCtrl.appendEmbedView(embedView);
                expect(ImageCardCtrl.view.playerOutlet.append).toHaveBeenCalledWith(embedView);
            });

            it('should update the embed view', function() {
                ImageCardCtrl.appendEmbedView(embedView);
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

            it('should set the isRendered property to true', function() {
                ImageCardCtrl.renderImage();
                expect(ImageCardCtrl.isRendered).toBe(true);
            });

            describe('flickr', function() {
                beforeEach(function() {
                    ImageCardCtrl.model = new ImageCard({
                        data: {
                            service: 'flickr',
                            dource: 'Flickr',
                            href: 'https://www.flickr.com',
                            source: 'Flickr',
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
                        href: 'https://www.flickr.com',
                        showSource: true
                    };
                    expect(ImageCardCtrl.view.update).toHaveBeenCalledWith(expectedOutput);
                });
            });

            describe('getty', function() {
                beforeEach(function() {
                    ImageCardCtrl.model = new ImageCard({
                        data: {
                            service: 'getty',
                            href: 'http://www.gettyimages.com',
                            source: 'gettyimages',
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
                        source: 'gettyimages',
                        href: 'http://www.gettyimages.com',
                        showSource: true
                    };
                    expect(ImageCardCtrl.view.update).toHaveBeenCalledWith(expectedOutput);
                });
            });

            describe('web', function() {
                beforeEach(function() {
                    ImageCardCtrl.model = new ImageCard({
                        data: {
                            service: 'web',
                            thumbs: { }
                        }
                    }, { data: { collateral: {  } } });
                    spyOn(ImageCardCtrl, 'appendEmbedView');
                    ImageCardCtrl.renderImage();
                });

                it('should load a web embed view', function() {
                    expect(ImageCardCtrl.appendEmbedView).toHaveBeenCalledWith(jasmine.any(WebEmbedView));
                });

                it('should update the source on the template', function() {
                    var expectedOutput = {
                        source: undefined,
                        href: undefined,
                        showSource: false
                    };
                    expect(ImageCardCtrl.view.update).toHaveBeenCalledWith(expectedOutput);
                });
            });
        });
    });

});
