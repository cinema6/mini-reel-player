import MobileCardApplicationController from '../../../../src/controllers/mobile-card/MobileCardApplicationController.js';
import ApplicationController from '../../../../src/controllers/ApplicationController.js';
import dispatcher from '../../../../src/services/dispatcher.js';
import MobileCardPlayerController from '../../../../src/controllers/mobile-card/MobileCardPlayerController.js';

describe('MobileCardApplicationController', function() {
    let MobileCardApplicationCtrl;
    let rootNode;

    beforeEach(function() {
        spyOn(dispatcher, 'addClient');
        rootNode = document.createElement('body');

        MobileCardApplicationCtrl = new MobileCardApplicationController(rootNode);
    });

    it('should exist', function() {
        expect(MobileCardApplicationCtrl).toEqual(jasmine.any(ApplicationController));
    });

    describe('properties:', function() {
        describe('PlayerCtrl', function() {
            it('should be a MobileCardPlayerController', function() {
                expect(MobileCardApplicationCtrl.PlayerCtrl).toEqual(jasmine.any(MobileCardPlayerController));
            });
        });
    });
});
