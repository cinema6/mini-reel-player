import LightboxPlaylistPlayerController from '../../../../src/controllers/lightbox-playlist/LightboxPlaylistPlayerController.js';
import PlayerController from '../../../../src/controllers/PlayerController.js';
import LightboxPlaylistPlayerView from '../../../../src/views/lightbox-playlist/LightboxPlaylistPlayerView.js';
import LightboxPlaylistTextCardController from '../../../../src/controllers/lightbox-playlist/LightboxPlaylistTextCardController.js';
import LightboxPlaylistImageCardController from '../../../../src/controllers/lightbox-playlist/LightboxPlaylistImageCardController.js';
import LightboxPlaylistVideoCardController from '../../../../src/controllers/lightbox-playlist/LightboxPlaylistVideoCardController.js';
import LightboxPlaylistRecapCardController from '../../../../src/controllers/lightbox-playlist/LightboxPlaylistRecapCardController.js';
import LightboxPlaylistPrerollCardController from '../../../../src/controllers/lightbox-playlist/LightboxPlaylistPrerollCardController.js';
import DisplayAdCardController from '../../../../src/controllers/DisplayAdCardController.js';
import PlaylistPlayerController from '../../../../src/mixins/PlaylistPlayerController.js';
import FullscreenPlayerController from '../../../../src/mixins/FullscreenPlayerController.js';

describe('LightboxPlaylistPlayerController', function() {
    let LightboxPlaylistPlayerCtrl;

    beforeEach(function() {
        spyOn(LightboxPlaylistPlayerController.prototype, 'initPlaylist').and.callThrough();
        spyOn(LightboxPlaylistPlayerController.prototype, 'initFullscreen').and.callThrough();
        spyOn(LightboxPlaylistPlayerController.prototype, 'addView').and.callThrough();

        LightboxPlaylistPlayerCtrl = new LightboxPlaylistPlayerController();
    });

    it('should exist', function() {
        expect(LightboxPlaylistPlayerCtrl).toEqual(jasmine.any(PlayerController));
    });

    it('should mixin the PlaylistPlayerController and FullscreenPlayerController', function() {
        expect(LightboxPlaylistPlayerController.mixins).toContain(PlaylistPlayerController);
        expect(LightboxPlaylistPlayerCtrl.initPlaylist).toHaveBeenCalled();

        expect(LightboxPlaylistPlayerController.mixins).toContain(FullscreenPlayerController);
        expect(LightboxPlaylistPlayerCtrl.initFullscreen).toHaveBeenCalled();
    });

    it('should initialize the playlist', function() {
        expect(LightboxPlaylistPlayerCtrl.initPlaylist).toHaveBeenCalled();
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a LightboxPlaylistPlayerView', function() {
                expect(LightboxPlaylistPlayerCtrl.view).toEqual(jasmine.any(LightboxPlaylistPlayerView));
                expect(LightboxPlaylistPlayerCtrl.addView).toHaveBeenCalledWith(LightboxPlaylistPlayerCtrl.view);
            });
        });

        describe('CardControllers', function() {
            describe('.text', function() {
                it('should be LightboxPlaylistTextCardController', function() {
                    expect(LightboxPlaylistPlayerCtrl.CardControllers.text).toBe(LightboxPlaylistTextCardController);
                });
            });

            describe('.image', function() {
                it('should be LightboxPlaylistImageCardController', function() {
                    expect(LightboxPlaylistPlayerCtrl.CardControllers.image).toBe(LightboxPlaylistImageCardController);
                });
            });

            describe('.video', function() {
                it('should be LightboxPlaylistVideoCardController', function() {
                    expect(LightboxPlaylistPlayerCtrl.CardControllers.video).toBe(LightboxPlaylistVideoCardController);
                });
            });

            describe('.recap', function() {
                it('should be LightboxPlaylistRecapCardController', function() {
                    expect(LightboxPlaylistPlayerCtrl.CardControllers.recap).toBe(LightboxPlaylistRecapCardController);
                });
            });

            describe('.preroll', function() {
                it('should be LightboxPlaylistPrerollCardController', function() {
                    expect(LightboxPlaylistPlayerCtrl.CardControllers.preroll).toBe(LightboxPlaylistPrerollCardController);
                });
            });

            describe('.displayAd', function() {
                it('should be DisplayAdCardController', function() {
                    expect(LightboxPlaylistPlayerCtrl.CardControllers.displayAd).toBe(DisplayAdCardController);
                });
            });
        });
    });
});
