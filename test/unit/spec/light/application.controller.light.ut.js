import LightApplicationController from '../../../../src/controllers/light/LightApplicationController.js';
import ApplicationController from '../../../../src/controllers/ApplicationController.js';
import LightPlayerController from '../../../../src/controllers/light/LightPlayerController.js';
import browser from '../../../../src/services/browser.js';
import codeLoader from '../../../../src/services/code_loader.js';
import RunnerPromise from '../../../../lib/RunnerPromise.js';
import {
    defer
} from '../../../../lib/utils.js';

describe('LightApplicationController', function() {
    let LightApplicationCtrl;
    let mouseDeferred;

    beforeEach(function() {
        mouseDeferred = defer(RunnerPromise);
        spyOn(browser, 'test').and.returnValue(mouseDeferred.promise);

        LightApplicationCtrl = new LightApplicationController();
    });

    it('should exist', function() {
        expect(LightApplicationCtrl).toEqual(jasmine.any(ApplicationController));
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
            expect(codeLoader.loadStyles).toHaveBeenCalledWith('css/light--hover.css');
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
            it('should be a LightPlayerController', function() {
                expect(LightApplicationCtrl.PlayerCtrl).toEqual(jasmine.any(LightPlayerController));
            });
        });
    });
});
