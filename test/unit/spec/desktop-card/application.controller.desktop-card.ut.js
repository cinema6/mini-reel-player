import DesktopCardApplicationController from '../../../../src/controllers/desktop-card/DesktopCardApplicationController.js';
import ApplicationController from '../../../../src/controllers/ApplicationController.js';
import dispatcher from '../../../../src/services/dispatcher.js';
import DesktopCardPlayerController from '../../../../src/controllers/desktop-card/DesktopCardPlayerController.js';

describe('DesktopCardApplicationController', function() {
    let DesktopCardApplicationCtrl;
    let rootNode;

    beforeEach(function() {
        spyOn(dispatcher, 'addClient');
        rootNode = document.createElement('body');

        DesktopCardApplicationCtrl = new DesktopCardApplicationController(rootNode);
    });

    it('should exist', function() {
        expect(DesktopCardApplicationCtrl).toEqual(jasmine.any(ApplicationController));
    });

    describe('properties:', function() {
        describe('PlayerCtrl', function() {
            it('should be a DesktopCardPlayerController', function() {
                expect(DesktopCardApplicationCtrl.PlayerCtrl).toEqual(jasmine.any(DesktopCardPlayerController));
            });
        });
    });
});
