import LightApplicationController from '../../../../src/controllers/light/LightApplicationController.js';
import ApplicationController from '../../../../src/controllers/ApplicationController.js';
import LightPlayerController from '../../../../src/controllers/light/LightPlayerController.js';
import dispatcher from '../../../../src/services/dispatcher.js';

describe('LightApplicationController', function() {
    let LightApplicationCtrl;

    beforeEach(function() {
        spyOn(dispatcher, 'addClient');

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
