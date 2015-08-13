import LightApplicationController from '../../../../src/controllers/light/LightApplicationController.js';
import ApplicationController from '../../../../src/controllers/ApplicationController.js';
import LightPlayerController from '../../../../src/controllers/light/LightPlayerController.js';

describe('LightApplicationController', function() {
    let LightApplicationCtrl;

    beforeEach(function() {
        LightApplicationCtrl = new LightApplicationController(document.createElement('body'));
    });

    it('should exist', function() {
        expect(LightApplicationCtrl).toEqual(jasmine.any(ApplicationController));
    });

    describe('properties:', function() {
        describe('PlayerCtrl', function() {
            it('should be a LightPlayerController', function() {
                expect(LightApplicationCtrl.PlayerCtrl).toEqual(jasmine.any(LightPlayerController));
            });
        });
    });
});
