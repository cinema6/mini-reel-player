import DesktopCardPlayerController from '../../../../src/controllers/desktop-card/DesktopCardPlayerController.js';
import CardPlayerController from '../../../../src/controllers/CardPlayerController.js';
import View from '../../../../lib/core/View.js';
import Runner from '../../../../lib/Runner.js';
import DesktopCardVideoCardController from '../../../../src/controllers/desktop-card/DesktopCardVideoCardController.js';
import LightInstagramImageCardController from '../../../../src/controllers/light/LightInstagramImageCardController.js';
import LightInstagramVideoCardController from '../../../../src/controllers/light/LightInstagramVideoCardController.js';
import DesktopCardPlayerView from '../../../../src/views/desktop-card/DesktopCardPlayerView.js';

describe('DesktopCardPlayerController', function() {
    let rootView;
    let DesktopCardPlayerCtrl;

    beforeEach(function() {
        rootView = new View();
        spyOn(DesktopCardPlayerController.prototype, 'addView').and.callThrough();

        Runner.run(() => DesktopCardPlayerCtrl = new DesktopCardPlayerController(rootView));
    });

    it('should exist', function() {
        expect(DesktopCardPlayerCtrl).toEqual(jasmine.any(CardPlayerController));
    });

    describe('properties:', function() {
        describe('CardControllers', function() {
            describe('.video', function() {
                it('should be the DesktopCardVideoCardController', function() {
                    expect(DesktopCardPlayerCtrl.CardControllers.video).toBe(DesktopCardVideoCardController);
                });
            });

            describe('.instagramImage', function() {
                it('should be the LightInstagramImageCardController', function() {
                    expect(DesktopCardPlayerCtrl.CardControllers.instagramImage).toBe(LightInstagramImageCardController);
                });
            });

            describe('.instagramVideo', function() {
                it('should be the LightInstagramVideoCardController', function() {
                    expect(DesktopCardPlayerCtrl.CardControllers.instagramVideo).toBe(LightInstagramVideoCardController);
                });
            });
        });

        describe('view', function() {
            it('should be a DesktopCardPlayerView', function() {
                expect(DesktopCardPlayerCtrl.view).toEqual(jasmine.any(DesktopCardPlayerView));
                expect(DesktopCardPlayerCtrl.addView).toHaveBeenCalledWith(DesktopCardPlayerCtrl.view);
            });
        });
    });
});
