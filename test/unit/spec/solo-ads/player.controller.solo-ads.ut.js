import SoloAdsPlayerController from '../../../../src/controllers/solo-ads/SoloAdsPlayerController.js';
import PlayerController from '../../../../src/controllers/PlayerController.js';
import SoloPlayerView from '../../../../src/views/solo/SoloPlayerView.js';
import SoloAdsImageCardController from '../../../../src/controllers/solo-ads/SoloAdsImageCardController.js';
import SoloAdsVideoCardController from '../../../../src/controllers/solo-ads/SoloAdsVideoCardController.js';
import FullPrerollCardController from '../../../../src/controllers/full/FullPrerollCardController.js';

describe('SoloAdsPlayerController', function() {
    let SoloAdsPlayerCtrl;

    beforeEach(function() {
        SoloAdsPlayerCtrl = new SoloAdsPlayerController();
    });

    it('should exist', function() {
        expect(SoloAdsPlayerCtrl).toEqual(jasmine.any(PlayerController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a SoloPlayerView', function() {
                expect(SoloAdsPlayerCtrl.view).toEqual(jasmine.any(SoloPlayerView));
            });
        });

        describe('CardControllers', function() {
            describe('.image', function() {
                it('should be SoloAdsImageCardController', function() {
                    expect(SoloAdsPlayerCtrl.CardControllers.image).toBe(SoloAdsImageCardController);
                });
            });

            describe('.video', function() {
                it('should be SoloAdsVideoCardController', function() {
                    expect(SoloAdsPlayerCtrl.CardControllers.video).toBe(SoloAdsVideoCardController);
                });
            });

            describe('.preroll', function() {
                it('should be FullPrerollCardController', function() {
                    expect(SoloAdsPlayerCtrl.CardControllers.preroll).toBe(FullPrerollCardController);
                });
            });
        });
    });
});
