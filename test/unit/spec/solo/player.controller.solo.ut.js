import SoloPlayerController from '../../../../src/controllers/solo/SoloPlayerController.js';
import PlayerController from '../../../../src/controllers/PlayerController.js';
import SoloPlayerView from '../../../../src/views/solo/SoloPlayerView.js';
import SoloVideoCardController from '../../../../src/controllers/solo/SoloVideoCardController.js';
import FullPrerollCardController from '../../../../src/controllers/full/FullPrerollCardController.js';
import Runner from '../../../../lib/Runner.js';

describe('SoloPlayerController', function() {
    let SoloPlayerCtrl;

    beforeEach(function() {
        Runner.run(() => SoloPlayerCtrl = new SoloPlayerController());
    });

    it('should exist', function() {
        expect(SoloPlayerCtrl).toEqual(jasmine.any(PlayerController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a SoloPlayerView', function() {
                expect(SoloPlayerCtrl.view).toEqual(jasmine.any(SoloPlayerView));
            });
        });

        describe('CardControllers', function() {
            describe('.video', function() {
                it('should be SoloVideoCardController', function() {
                    expect(SoloPlayerCtrl.CardControllers.video).toBe(SoloVideoCardController);
                });
            });

            describe('.preroll', function() {
                it('should be FullPrerollCardController', function() {
                    expect(SoloPlayerCtrl.CardControllers.preroll).toBe(FullPrerollCardController);
                });
            });
        });
    });
});
