import SoloApplicationController from '../../../../src/controllers/solo/SoloApplicationController.js';
import ApplicationController from '../../../../src/controllers/ApplicationController.js';
import SoloPlayerController from '../../../../src/controllers/solo/SoloPlayerController.js';
import Runner from '../../../../lib/Runner.js';

describe('SoloApplicationController', function() {
    let SoloApplicationCtrl;

    beforeEach(function() {
        Runner.run(() => SoloApplicationCtrl = new SoloApplicationController());
    });

    it('should exist', function() {
        expect(SoloApplicationCtrl).toEqual(jasmine.any(ApplicationController));
    });

    describe('properties:', function() {
        describe('PlayerCtrl', function() {
            it('should be a SoloPlayerController', function() {
                expect(SoloApplicationCtrl.PlayerCtrl).toEqual(jasmine.any(SoloPlayerController));
            });
        });
    });
});
