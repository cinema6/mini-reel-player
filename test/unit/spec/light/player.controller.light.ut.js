import LightPlayerController from '../../../../src/controllers/light/LightPlayerController.js';
import PlayerController from '../../../../src/controllers/PlayerController.js';
import LightPlayerView from '../../../../src/views/light/LightPlayerView.js';
import ThumbnailNavigatorPlayerController from '../../../../src/mixins/ThumbnailNavigatorPlayerController.js';
import LightArticleCardController from '../../../../src/controllers/light/LightArticleCardController.js';
import LightTextCardController from '../../../../src/controllers/light/LightTextCardController.js';
import LightImageCardController from '../../../../src/controllers/light/LightImageCardController.js';
import LightVideoCardController from '../../../../src/controllers/light/LightVideoCardController.js';
import LightboxPlaylistRecapCardController from '../../../../src/controllers/lightbox-playlist/LightboxPlaylistRecapCardController.js';
import LightPrerollCardController from '../../../../src/controllers/light/LightPrerollCardController.js';
import DisplayAdCardController from '../../../../src/controllers/DisplayAdCardController.js';
import LightInstagramImageCardController from '../../../../src/controllers/light/LightInstagramImageCardController.js';
import LightInstagramVideoCardController from '../../../../src/controllers/light/LightInstagramVideoCardController.js';
import dispatcher from '../../../../src/services/dispatcher.js';

describe('LightPlayerController', function() {
    let LightPlayerCtrl;

    beforeEach(function() {
        spyOn(dispatcher, 'addClient');

        spyOn(LightPlayerController.prototype, 'addView').and.callThrough();
        spyOn(LightPlayerController.prototype, 'initThumbnailNavigator').and.callThrough();

        LightPlayerCtrl = new LightPlayerController();
    });

    it('should exist', function() {
        expect(LightPlayerCtrl).toEqual(jasmine.any(PlayerController));
    });

    it('should mixin the ThumbnailNavigatorPlayerController', function() {
        expect(LightPlayerController.mixins).toContain(ThumbnailNavigatorPlayerController);
        expect(LightPlayerCtrl.initThumbnailNavigator).toHaveBeenCalled();
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a LightPlayerView', function() {
                expect(LightPlayerCtrl.view).toEqual(jasmine.any(LightPlayerView));
                expect(LightPlayerCtrl.addView).toHaveBeenCalledWith(LightPlayerCtrl.view);
            });
        });

        describe('CardControllers', function() {
            describe('.article', function() {
                it('should be LightArticleCardController', function() {
                    expect(LightPlayerCtrl.CardControllers.article).toBe(LightArticleCardController);
                });
            });

            describe('.text', function() {
                it('should be LightTextCardController', function() {
                    expect(LightPlayerCtrl.CardControllers.text).toBe(LightTextCardController);
                });
            });

            describe('.image', function() {
                it('should be LightImageCardController', function() {
                    expect(LightPlayerCtrl.CardControllers.image).toBe(LightImageCardController);
                });
            });

            describe('.video', function() {
                it('should be LightVideoCardController', function() {
                    expect(LightPlayerCtrl.CardControllers.video).toBe(LightVideoCardController);
                });
            });

            describe('.recap', function() {
                it('should be LightboxPlaylistRecapCardController', function() {
                    expect(LightPlayerCtrl.CardControllers.recap).toBe(LightboxPlaylistRecapCardController);
                });
            });

            describe('.preroll', function() {
                it('should be LightPrerollCardController', function() {
                    expect(LightPlayerCtrl.CardControllers.preroll).toBe(LightPrerollCardController);
                });
            });

            describe('.displayAd', function() {
                it('should be DisplayAdCardController', function() {
                    expect(LightPlayerCtrl.CardControllers.displayAd).toBe(DisplayAdCardController);
                });
            });

            describe('.instagramImage', function() {
                it('should be LightInstagramImageCardController', function() {
                    expect(LightPlayerCtrl.CardControllers.instagramImage).toBe(LightInstagramImageCardController);
                });
            });

            describe('.instagramVideo', function() {
                it('should be LightInstagramVideoCardController', function() {
                    expect(LightPlayerCtrl.CardControllers.instagramVideo).toBe(LightInstagramVideoCardController);
                });
            });
        });
    });

    describe('events:', function() {
        describe('session', function() {
            let session;

            beforeEach(function() {
                session = LightPlayerCtrl.session;
            });

            describe('ready', function() {
                beforeEach(function() {
                    spyOn(session, 'ping');

                    session.emit('ready');
                });

                it('should ping up some responsive styles', function() {
                    expect(session.ping).toHaveBeenCalledWith('responsiveStyles', {
                        minWidth: '18.75em',
                        padding: '0 0 85% 0',
                        fontSize: '16px',
                        height: '0px',
                        overflow: 'hidden'
                    });
                });
            });
        });
    });
});
