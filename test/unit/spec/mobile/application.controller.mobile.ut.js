import MobileApplicationController from '../../../../src/controllers/mobile/MobileApplicationController.js';
import ApplicationController from '../../../../src/controllers/ApplicationController.js';
import MobilePlayerController from '../../../../src/controllers/mobile/MobilePlayerController.js';
import Runner from '../../../../lib/Runner.js';

describe('MobileApplicationController', function() {
    let MobileApplicationCtrl;

    let root;

    beforeEach(function() {
        root = document.createElement('body');

        Runner.run(() => MobileApplicationCtrl = new MobileApplicationController(root));
    });

    it('should exist', function() {
        expect(MobileApplicationCtrl).toEqual(jasmine.any(ApplicationController));
    });

    describe('properties:', function() {
        describe('PlayerCtrl', function() {
            it('should be a PlayerController', function() {
                expect(MobileApplicationCtrl.PlayerCtrl).toEqual(jasmine.any(MobilePlayerController));
            });
        });
    });
});
