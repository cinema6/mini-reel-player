import LightboxApplicationController from '../../../../src/controllers/lightbox/LightboxApplicationController.js';
import ApplicationController from '../../../../src/controllers/ApplicationController.js';
import LightboxPlayerController from '../../../../src/controllers/lightbox/LightboxPlayerController.js';
import dispatcher from '../../../../src/services/dispatcher.js';

describe('LightboxApplicationController', function() {
    let LightboxApplicationCtrl;

    beforeEach(function() {
        spyOn(dispatcher, 'addClient');
        LightboxApplicationCtrl = new LightboxApplicationController(document.createElement('body'));
    });

    it('should exist', function() {
        expect(LightboxApplicationCtrl).toEqual(jasmine.any(ApplicationController));
    });

    describe('properties:', function() {
        describe('PlayerCtrl', function() {
            it('should be a LightboxPlayerController', function() {
                expect(LightboxApplicationCtrl.PlayerCtrl).toEqual(jasmine.any(LightboxPlayerController));
            });
        });
    });
});
