import FullNPPlayerController from '../../../../src/controllers/full-np/FullNPPlayerController.js';
import PlayerController from '../../../../src/controllers/PlayerController.js';
import View from '../../../../lib/core/View.js';
import FullNPArticleCardController from '../../../../src/controllers/full-np/FullNPArticleCardController.js';
import FullNPImageCardController from '../../../../src/controllers/full-np/FullNPImageCardController.js';
import FullNPVideoCardController from '../../../../src/controllers/full-np/FullNPVideoCardController.js';
import FullNPRecapCardController from '../../../../src/controllers/full-np/FullNPRecapCardController.js';
import FullNPInstagramImageCardController from '../../../../src/controllers/full-np/FullNPInstagramImageCardController.js';
import FullNPInstagramVideoCardController from '../../../../src/controllers/full-np/FullNPInstagramVideoCardController.js';
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
                expect(FullNPPlayerCtrl.CardControllers.article).toBe(FullNPArticleCardController);
                expect(FullNPPlayerCtrl.CardControllers.image).toBe(FullNPImageCardController);
                expect(FullNPPlayerCtrl.CardControllers.video).toBe(FullNPVideoCardController);
                expect(FullNPPlayerCtrl.CardControllers.recap).toBe(FullNPRecapCardController);
                expect(FullNPPlayerCtrl.CardControllers.instagramImage).toBe(FullNPInstagramImageCardController);
                expect(FullNPPlayerCtrl.CardControllers.instagramVideo).toBe(FullNPInstagramVideoCardController);
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
