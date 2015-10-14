import FullNPApplicationController from '../../../../src/controllers/full-np/FullNPApplicationController.js';
import ApplicationController from '../../../../src/controllers/ApplicationController.js';
import FullNPPlayerController from '../../../../src/controllers/full-np/FullNPPlayerController.js';
import dispatcher from '../../../../src/services/dispatcher.js';

describe('FullNPApplicationController', function() {
    let FullNPApplicationCtrl;
    let rootNode;

    beforeEach(function() {
        spyOn(dispatcher, 'addClient');
        rootNode = document.createElement('body');

        FullNPApplicationCtrl = new FullNPApplicationController(rootNode);
    });

    it('should exist', function() {
        expect(FullNPApplicationCtrl).toEqual(jasmine.any(ApplicationController));
    });

    describe('properties:', function() {
        describe('PlayerCtrl', function() {
            it('should be a FullNPPlayerController', function() {
                expect(FullNPApplicationCtrl.PlayerCtrl).toEqual(jasmine.any(FullNPPlayerController));
            });
        });
    });
});
