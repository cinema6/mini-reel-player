import LightboxPlayerController from '../../../../src/controllers/lightbox/LightboxPlayerController.js';
import PlayerController from '../../../../src/controllers/PlayerController.js';
import LightboxPlayerView from '../../../../src/views/lightbox/LightboxPlayerView.js';
import LightboxTextCardController from '../../../../src/controllers/lightbox/LightboxTextCardController.js';
import LightboxImageCardController from '../../../../src/controllers/lightbox/LightboxImageCardController.js';
import LightboxVideoCardController from '../../../../src/controllers/lightbox/LightboxVideoCardController.js';
import LightboxPlaylistRecapCardController from '../../../../src/controllers/lightbox-playlist/LightboxPlaylistRecapCardController.js';
import LightboxPrerollCardController from '../../../../src/controllers/lightbox/LightboxPrerollCardController.js';
import DisplayAdCardController from '../../../../src/controllers/DisplayAdCardController.js';
import FullscreenPlayerController from '../../../../src/mixins/FullscreenPlayerController.js';
import ThumbnailNavigatorPlayerController from '../../../../src/mixins/ThumbnailNavigatorPlayerController.js';

describe('LightboxPlayerController', function() {
    let LightboxPlayerCtrl;

    beforeEach(function() {
        spyOn(LightboxPlayerController.prototype, 'addView').and.callThrough();
        spyOn(LightboxPlayerController.prototype, 'initFullscreen').and.callThrough();
        spyOn(LightboxPlayerController.prototype, 'initThumbnailNavigator').and.callThrough();

        LightboxPlayerCtrl = new LightboxPlayerController();
    });

    it('should exist', function() {
        expect(LightboxPlayerCtrl).toEqual(jasmine.any(PlayerController));
    });

    it('should mixin the FullscreenPlayerController and ThumbnailNavigatorPlayerController', function() {
        expect(LightboxPlayerController.mixins).toContain(FullscreenPlayerController);
        expect(LightboxPlayerCtrl.initFullscreen).toHaveBeenCalled();

        expect(LightboxPlayerController.mixins).toContain(ThumbnailNavigatorPlayerController);
        expect(LightboxPlayerCtrl.initThumbnailNavigator).toHaveBeenCalled();
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a LightboxPlayerView', function() {
                expect(LightboxPlayerCtrl.view).toEqual(jasmine.any(LightboxPlayerView));
                expect(LightboxPlayerCtrl.addView).toHaveBeenCalledWith(LightboxPlayerCtrl.view);
            });
        });

        describe('CardControllers', function() {
            describe('.text', function() {
                it('should be LightboxTextCardController', function() {
                    expect(LightboxPlayerCtrl.CardControllers.text).toBe(LightboxTextCardController);
                });
            });

            describe('.image', function() {
                it('should be LightboxImageCardController', function() {
                    expect(LightboxPlayerCtrl.CardControllers.image).toBe(LightboxImageCardController);
                });
            });

            describe('.video', function() {
                it('should be LightboxVideoCardController', function() {
                    expect(LightboxPlayerCtrl.CardControllers.video).toBe(LightboxVideoCardController);
                });
            });

            describe('.recap', function() {
                it('should be LightboxPlaylistRecapCardController', function() {
                    expect(LightboxPlayerCtrl.CardControllers.recap).toBe(LightboxPlaylistRecapCardController);
                });
            });

            describe('.preroll', function() {
                it('should be a LightboxPrerollCardController', function() {
                    expect(LightboxPlayerCtrl.CardControllers.preroll).toBe(LightboxPrerollCardController);
                });
            });

            describe('.displayAd', function() {
                it('should be DisplayAdCardController', function() {
                    expect(LightboxPlayerCtrl.CardControllers.displayAd).toBe(DisplayAdCardController);
                });
            });
        });
    });
});
