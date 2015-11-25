import FullNPPlayerController from '../../../../src/controllers/full-np/FullNPPlayerController.js';
import PlayerController from '../../../../src/controllers/PlayerController.js';
import View from '../../../../lib/core/View.js';
import FullArticleCardController from '../../../../src/controllers/full/FullArticleCardController.js';
import FullTextCardController from '../../../../src/controllers/full/FullTextCardController.js';
import FullImageCardController from '../../../../src/controllers/full/FullImageCardController.js';
import FullVideoCardController from '../../../../src/controllers/full/FullVideoCardController.js';
import FullRecapCardController from '../../../../src/controllers/full/FullRecapCardController.js';
import LightboxPrerollCardController from '../../../../src/controllers/lightbox/LightboxPrerollCardController.js';
import DisplayAdCardController from '../../../../src/controllers/DisplayAdCardController.js';
import FullInstagramImageCardController from '../../../../src/controllers/full/FullInstagramImageCardController.js';
import FullInstagramVideoCardController from '../../../../src/controllers/full/FullInstagramVideoCardController.js';
import FullNPPlayerView from '../../../../src/views/full-np/FullNPPlayerView.js';
import ThumbnailNavigatorPlayerController from '../../../../src/mixins/ThumbnailNavigatorPlayerController.js';
import dispatcher from '../../../../src/services/dispatcher.js';

describe('FullNPPlayerController', function() {
    let FullNPPlayerCtrl;
    let rootView;

    beforeEach(function() {
        spyOn(dispatcher, 'addClient');
        rootView = new View(document.createElement('body'));
        spyOn(FullNPPlayerController.prototype, 'addView').and.callThrough();
        spyOn(FullNPPlayerController.prototype, 'initThumbnailNavigator').and.callThrough();

        FullNPPlayerCtrl = new FullNPPlayerController(rootView);
    });

    it('should exist', function() {
        expect(FullNPPlayerCtrl).toEqual(jasmine.any(PlayerController));
    });

    it('should mixin the ThumbnailNavigatorPlayerController', function() {
        expect(FullNPPlayerController.mixins).toContain(ThumbnailNavigatorPlayerController);
    });

    it('should initialize its mixins', function() {
        expect(FullNPPlayerCtrl.initThumbnailNavigator).toHaveBeenCalled();
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a FullNPPlayerView', function() {
                expect(FullNPPlayerCtrl.view).toEqual(jasmine.any(FullNPPlayerView));
            });
        });

        describe('CardControllers', function() {
            it('should have a Controller for each card type', function() {
                expect(FullNPPlayerCtrl.CardControllers.article).toBe(FullArticleCardController);
                expect(FullNPPlayerCtrl.CardControllers.text).toBe(FullTextCardController);
                expect(FullNPPlayerCtrl.CardControllers.image).toBe(FullImageCardController);
                expect(FullNPPlayerCtrl.CardControllers.video).toBe(FullVideoCardController);
                expect(FullNPPlayerCtrl.CardControllers.recap).toBe(FullRecapCardController);
                expect(FullNPPlayerCtrl.CardControllers.preroll).toBe(LightboxPrerollCardController);
                expect(FullNPPlayerCtrl.CardControllers.displayAd).toBe(DisplayAdCardController);
                expect(FullNPPlayerCtrl.CardControllers.instagramImage).toBe(FullInstagramImageCardController);
                expect(FullNPPlayerCtrl.CardControllers.instagramVideo).toBe(FullInstagramVideoCardController);
            });
        });
    });

    describe('methods:', function() {
        describe('updateView()', function() {
            beforeEach(function() {
                spyOn(PlayerController.prototype, 'updateView');
                spyOn(FullNPPlayerCtrl.view, 'update');
                FullNPPlayerCtrl.minireel.splash = '/my-splash.jpg';

                FullNPPlayerCtrl.updateView();
            });

            it('should update its view with the splash image', function() {
                expect(FullNPPlayerCtrl.view.update).toHaveBeenCalledWith({
                    splash: FullNPPlayerCtrl.minireel.splash
                });
            });

            it('should call super()', function() {
                expect(PlayerController.prototype.updateView).toHaveBeenCalled();
            });
        });
    });
});
