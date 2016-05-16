import MobileCardPlayerController from '../../../../src/controllers/mobile-card/MobileCardPlayerController.js';
import CardPlayerController from '../../../../src/controllers/CardPlayerController.js';
import MobileCardPlayerView from '../../../../src/views/mobile-card/MobileCardPlayerView.js';
import View from '../../../../lib/core/View.js';
import Runner from '../../../../lib/Runner.js';
import MobileCardVideoCardController from '../../../../src/controllers/mobile-card/MobileCardVideoCardController.js';
import MobileCardShowcaseAppCardController from '../../../../src/controllers/mobile-card/MobileCardShowcaseAppCardController.js';
import MobileInstagramImageCardController from '../../../../src/controllers/mobile/MobileInstagramImageCardController.js';
import MobileInstagramVideoCardController from '../../../../src/controllers/mobile/MobileInstagramVideoCardController.js';

describe('MobileCardPlayerController', function() {
    let rootView;
    let MobileCardPlayerCtrl;

    beforeEach(function() {
        rootView = new View();
        spyOn(MobileCardPlayerController.prototype, 'addView').and.callThrough();

        Runner.run(() => MobileCardPlayerCtrl = new MobileCardPlayerController(rootView));
    });

    it('should exist', function() {
        expect(MobileCardPlayerCtrl).toEqual(jasmine.any(CardPlayerController));
    });

    describe('properties:', function() {
        describe('CardControllers', function() {
            describe('.video', function() {
                it('should be the MobileCardVideoCardController', function() {
                    expect(MobileCardPlayerCtrl.CardControllers.video).toBe(MobileCardVideoCardController);
                });
            });

            describe('.instagramImage', function() {
                it('should be the MobileInstagramImageCardController', function() {
                    expect(MobileCardPlayerCtrl.CardControllers.instagramImage).toBe(MobileInstagramImageCardController);
                });
            });

            describe('.instagramVideo', function() {
                it('should be the MobileInstagramVideoCardController', function() {
                    expect(MobileCardPlayerCtrl.CardControllers.instagramVideo).toBe(MobileInstagramVideoCardController);
                });
            });

            describe('[\'showcase-app\']', function() {
                it('should be the MobileCardShowcaseAppCardController', function() {
                    expect(MobileCardPlayerCtrl.CardControllers['showcase-app']).toBe(MobileCardShowcaseAppCardController);
                });
            });
        });

        describe('view', function() {
            it('should be a MobileCardPlayerView', function() {
                expect(MobileCardPlayerCtrl.view).toEqual(jasmine.any(MobileCardPlayerView));
                expect(MobileCardPlayerCtrl.addView).toHaveBeenCalledWith(MobileCardPlayerCtrl.view);
            });
        });
    });
});
