import FullPlayerController from '../../../../src/controllers/full/FullPlayerController.js';
import PlayerController from '../../../../src/controllers/PlayerController.js';
import FullPlayerView from '../../../../src/views/full/FullPlayerView.js';
import View from '../../../../lib/core/View.js';
import FullArticleCardController from '../../../../src/controllers/full/FullArticleCardController.js';
import FullTextCardController from '../../../../src/controllers/full/FullTextCardController.js';
import FullImageCardController from '../../../../src/controllers/full/FullImageCardController.js';
import FullVideoCardController from '../../../../src/controllers/full/FullVideoCardController.js';
import FullRecapCardController from '../../../../src/controllers/full/FullRecapCardController.js';
import FullPrerollCardController from '../../../../src/controllers/full/FullPrerollCardController.js';
import DisplayAdCardController from '../../../../src/controllers/DisplayAdCardController.js';
import PlaylistPlayerController from '../../../../src/mixins/PlaylistPlayerController.js';
import ResizingPlayerController from '../../../../src/mixins/ResizingPlayerController.js';

describe('FullPlayerController', function() {
    let FullPlayerCtrl;
    let rootView;

    beforeEach(function() {
        rootView = new View(document.createElement('body'));
        spyOn(FullPlayerController.prototype, 'addView').and.callThrough();
        spyOn(FullPlayerController.prototype, 'initPlaylist').and.callThrough();
        spyOn(FullPlayerController.prototype, 'initResizing').and.callThrough();

        FullPlayerCtrl = new FullPlayerController(rootView);
    });

    it('should exist', function() {
        expect(FullPlayerCtrl).toEqual(jasmine.any(PlayerController));
    });

    it('should mixin the PlaylistPlayerController and ResizingPlayerController', function() {
        expect(FullPlayerController.mixins).toContain(PlaylistPlayerController);
        expect(FullPlayerController.mixins).toContain(ResizingPlayerController);
    });

    it('should initialize its mixins', function() {
        expect(FullPlayerCtrl.initPlaylist).toHaveBeenCalled();
        expect(FullPlayerCtrl.initResizing).toHaveBeenCalled();
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a FullPlayerView', function() {
                expect(FullPlayerCtrl.view).toEqual(jasmine.any(FullPlayerView));
                expect(FullPlayerCtrl.addView).toHaveBeenCalledWith(FullPlayerCtrl.view);
            });
        });

        describe('CardControllers', function() {
            it('should have a Controller for each card type', function() {
                expect(FullPlayerCtrl.CardControllers.article).toBe(FullArticleCardController);
                expect(FullPlayerCtrl.CardControllers.text).toBe(FullTextCardController);
                expect(FullPlayerCtrl.CardControllers.image).toBe(FullImageCardController);
                expect(FullPlayerCtrl.CardControllers.video).toBe(FullVideoCardController);
                expect(FullPlayerCtrl.CardControllers.recap).toBe(FullRecapCardController);
                expect(FullPlayerCtrl.CardControllers.preroll).toBe(FullPrerollCardController);
                expect(FullPlayerCtrl.CardControllers.displayAd).toBe(DisplayAdCardController);
            });
        });
    });

    describe('methods:', function() {
        describe('updateView()', function() {
            beforeEach(function() {
                spyOn(PlayerController.prototype, 'updateView');
                spyOn(FullPlayerCtrl.view, 'update');
                FullPlayerCtrl.minireel.splash = '/my-splash.jpg';

                FullPlayerCtrl.updateView();
            });

            it('should update its view with the splash image', function() {
                expect(FullPlayerCtrl.view.update).toHaveBeenCalledWith({
                    splash: FullPlayerCtrl.minireel.splash
                });
            });

            it('should call super()', function() {
                expect(PlayerController.prototype.updateView).toHaveBeenCalled();
            });
        });
    });
});
