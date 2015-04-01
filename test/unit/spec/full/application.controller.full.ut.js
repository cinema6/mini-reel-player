import FullApplicationController from '../../../../src/controllers/full/FullApplicationController.js';
import ApplicationController from '../../../../src/controllers/ApplicationController.js';
import FullPlayerController from '../../../../src/controllers/full/FullPlayerController.js';

describe('FullApplicationController', function() {
    let FullApplicationCtrl;
    let rootNode;

    beforeEach(function() {
        rootNode = document.createElement('body');

        FullApplicationCtrl = new FullApplicationController(rootNode);
    });

    it('should exist', function() {
        expect(FullApplicationCtrl).toEqual(jasmine.any(ApplicationController));
    });

    describe('properties:', function() {
        describe('PlayerCtrl', function() {
            it('should be a MobilePlayerController', function() {
                expect(FullApplicationCtrl.PlayerCtrl).toEqual(jasmine.any(FullPlayerController));
            });
        });
    });
});
