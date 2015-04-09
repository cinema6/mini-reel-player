import LightboxApplicationController from '../../../../src/controllers/lightbox/LightboxApplicationController.js';
import ApplicationController from '../../../../src/controllers/ApplicationController.js';
import LightboxPlayerController from '../../../../src/controllers/lightbox/LightboxPlayerController.js';
import browser from '../../../../src/services/browser.js';
import codeLoader from '../../../../src/services/code_loader.js';
import RunnerPromise from '../../../../lib/RunnerPromise.js';
import {
    defer
} from '../../../../lib/utils.js';

describe('LightboxApplicationController', function() {
    let LightboxApplicationCtrl;
    let mouseDeferred;

    beforeEach(function() {
        mouseDeferred = defer(RunnerPromise);
        spyOn(browser, 'test').and.returnValue(mouseDeferred.promise);

        LightboxApplicationCtrl = new LightboxApplicationController();
    });

    it('should exist', function() {
        expect(LightboxApplicationCtrl).toEqual(jasmine.any(ApplicationController));
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
            expect(codeLoader.loadStyles).toHaveBeenCalledWith('css/lightbox--hover.css');
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
            it('should be a LightboxPlayerController', function() {
                expect(LightboxApplicationCtrl.PlayerCtrl).toEqual(jasmine.any(LightboxPlayerController));
            });
        });
    });
});
