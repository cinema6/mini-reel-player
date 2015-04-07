import LightboxPlaylistApplicationController from '../../../../src/controllers/lightbox-playlist/LightboxPlaylistApplicationController.js';
import ApplicationController from '../../../../src/controllers/ApplicationController.js';
import LightboxPlaylistPlayerController from '../../../../src/controllers/lightbox-playlist/LightboxPlaylistPlayerController.js';
import browser from '../../../../src/services/browser.js';
import codeLoader from '../../../../src/services/code_loader.js';
import RunnerPromise from '../../../../lib/RunnerPromise.js';
import {
    defer
} from '../../../../lib/utils.js';

describe('LightboxPlaylistApplicationController', function() {
    let LightboxPlaylistApplicationCtrl;
    let mouseDeferred;

    beforeEach(function() {
        mouseDeferred = defer(RunnerPromise);
        spyOn(browser, 'test').and.returnValue(mouseDeferred.promise);

        LightboxPlaylistApplicationCtrl = new LightboxPlaylistApplicationController(document.createElement('body'));
    });

    it('should be an ApplicationController', function() {
        expect(LightboxPlaylistApplicationCtrl).toEqual(jasmine.any(ApplicationController));
    });

    it('should check to see if the device has a mouse', function() {
        expect(browser.test).toHaveBeenCalledWith('mouse');
    });

    describe('if the device has a mouse', function() {
        beforeEach(function(done) {
            spyOn(codeLoader, 'loadStyles');
            mouseDeferred.fulfill(true);
            mouseDeferred.promise.then(done, done);
        });

        it('should load the hover styles', function() {
            expect(codeLoader.loadStyles).toHaveBeenCalledWith('css/lightbox-playlist--hover.css');
        });
    });

    describe('if the device has no mouse', function() {
        beforeEach(function(done) {
            spyOn(codeLoader, 'loadStyles');
            mouseDeferred.fulfill(false);
            mouseDeferred.promise.then(done, done);
        });

        it('should not load the hover styles', function() {
            expect(codeLoader.loadStyles).not.toHaveBeenCalled();
        });
    });

    describe('properties:', function() {
        describe('PlayerCtrl', function() {
            it('should be a LightboxPlaylistPlayerCtrl', function() {
                expect(LightboxPlaylistApplicationCtrl.PlayerCtrl).toEqual(jasmine.any(LightboxPlaylistPlayerController));
            });
        });
    });
});
