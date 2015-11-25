import SoloAdsApplicationController from '../../../../src/controllers/solo-ads/SoloAdsApplicationController.js';
import ApplicationController from '../../../../src/controllers/ApplicationController.js';
import SoloAdsPlayerController from '../../../../src/controllers/solo-ads/SoloAdsPlayerController.js';
import dispatcher from '../../../../src/services/dispatcher.js';

describe('SoloAdsApplicationController', function() {
    let SoloAdsApplicationCtrl;

    beforeEach(function() {
        spyOn(dispatcher, 'addClient');

        SoloAdsApplicationCtrl = new SoloAdsApplicationController(document.createElement('body'));
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
