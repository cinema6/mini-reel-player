import LightboxPlaylistApplicationController from '../../../../src/controllers/lightbox-playlist/LightboxPlaylistApplicationController.js';
import ApplicationController from '../../../../src/controllers/ApplicationController.js';
import LightboxPlaylistPlayerController from '../../../../src/controllers/lightbox-playlist/LightboxPlaylistPlayerController.js';

describe('LightboxPlaylistApplicationController', function() {
    let LightboxPlaylistApplicationCtrl;

    beforeEach(function() {
        LightboxPlaylistApplicationCtrl = new LightboxPlaylistApplicationController(document.createElement('body'));
    });

    it('should be an ApplicationController', function() {
        expect(LightboxPlaylistApplicationCtrl).toEqual(jasmine.any(ApplicationController));
    });

    describe('properties:', function() {
        describe('PlayerCtrl', function() {
            it('should be a LightboxPlaylistPlayerCtrl', function() {
                expect(LightboxPlaylistApplicationCtrl.PlayerCtrl).toEqual(jasmine.any(LightboxPlaylistPlayerController));
            });
        });
    });
});
