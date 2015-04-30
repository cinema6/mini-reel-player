import SoloAdsApplicationController from '../../../../src/controllers/solo-ads/SoloAdsApplicationController.js';
import ApplicationController from '../../../../src/controllers/ApplicationController.js';
import SoloAdsPlayerController from '../../../../src/controllers/solo-ads/SoloAdsPlayerController.js';

describe('SoloAdsApplicationController', function() {
    let SoloAdsApplicationCtrl;

    beforeEach(function() {
        SoloAdsApplicationCtrl = new SoloAdsApplicationController();
    });

    it('should exist', function() {
        expect(SoloAdsApplicationCtrl).toEqual(jasmine.any(ApplicationController));
    });

    describe('properties:', function() {
        describe('PlayerCtrl', function() {
            it('should be a SoloAdsPlayerController', function() {
                expect(SoloAdsApplicationCtrl.PlayerCtrl).toEqual(jasmine.any(SoloAdsPlayerController));
            });
        });
    });
});
