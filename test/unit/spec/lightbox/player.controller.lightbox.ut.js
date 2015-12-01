import LightboxPlayerController from '../../../../src/controllers/lightbox/LightboxPlayerController.js';
import PlayerController from '../../../../src/controllers/PlayerController.js';
import LightboxPlayerView from '../../../../src/views/lightbox/LightboxPlayerView.js';
import LightboxImageCardController from '../../../../src/controllers/lightbox/LightboxImageCardController.js';
import LightboxVideoCardController from '../../../../src/controllers/lightbox/LightboxVideoCardController.js';
import LightboxRecapCardController from '../../../../src/controllers/lightbox/LightboxRecapCardController.js';
import FullNPInstagramImageCardController from '../../../../src/controllers/full-np/FullNPInstagramImageCardController.js';
import FullNPInstagramVideoCardController from '../../../../src/controllers/full-np/FullNPInstagramVideoCardController.js';
import FullscreenPlayerController from '../../../../src/mixins/FullscreenPlayerController.js';
import ThumbnailNavigatorPlayerController from '../../../../src/mixins/ThumbnailNavigatorPlayerController.js';
import dispatcher from '../../../../src/services/dispatcher.js';

describe('LightboxPlayerController', function() {
    let LightboxPlayerCtrl;

    beforeEach(function() {
        spyOn(dispatcher, 'addClient');
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
                it('should be LightboxRecapCardController', function() {
                    expect(LightboxPlayerCtrl.CardControllers.recap).toBe(LightboxRecapCardController);
                });
            });

            describe('.instagramImage', function() {
                it('should be FullNPInstagramImageCardController', function() {
                    expect(LightboxPlayerCtrl.CardControllers.instagramImage).toBe(FullNPInstagramImageCardController);
                });
            });

            describe('.instagramVideo', function() {
                it('should be FullNPInstagramVideoCardController', function() {
                    expect(LightboxPlayerCtrl.CardControllers.instagramVideo).toBe(FullNPInstagramVideoCardController);
                });
            });
        });
    });
});
