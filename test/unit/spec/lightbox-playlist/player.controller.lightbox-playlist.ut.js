import LightboxPlaylistPlayerController from '../../../../src/controllers/lightbox-playlist/LightboxPlaylistPlayerController.js';
import PlayerController from '../../../../src/controllers/PlayerController.js';
import LightboxPlaylistPlayerView from '../../../../src/views/lightbox-playlist/LightboxPlaylistPlayerView.js';
import LightboxPlaylistTextCardController from '../../../../src/controllers/lightbox-playlist/LightboxPlaylistTextCardController.js';
import LightboxPlaylistVideoCardController from '../../../../src/controllers/lightbox-playlist/LightboxPlaylistVideoCardController.js';
import LightboxPlaylistRecapCardController from '../../../../src/controllers/lightbox-playlist/LightboxPlaylistRecapCardController.js';
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
        });
    });

    describe('updateView()', function() {
        beforeEach(function() {
            spyOn(PlayerController.prototype, 'updateView');
            spyOn(LightboxPlaylistPlayerCtrl.view, 'update');

            LightboxPlaylistPlayerCtrl.minireel.currentCard = {
                type: 'recap'
            };

            LightboxPlaylistPlayerCtrl.updateView();
        });

        it('should call super()', function() {
            expect(PlayerController.prototype.updateView).toHaveBeenCalled();
        });

        it('should update() the view with the type of the currentCard', function() {
            expect(LightboxPlaylistPlayerCtrl.view.update).toHaveBeenCalledWith({
                cardType: 'recap'
            });
        });

        describe('if there is no currentCard', function() {
            beforeEach(function() {
                LightboxPlaylistPlayerCtrl.view.update.calls.reset();
                LightboxPlaylistPlayerCtrl.minireel.currentCard = null;

                LightboxPlaylistPlayerCtrl.updateView();
            });

            it('should set cardType to null', function() {
                expect(LightboxPlaylistPlayerCtrl.view.update).toHaveBeenCalledWith({
                    cardType: null
                });
            });
        });
    });
});
