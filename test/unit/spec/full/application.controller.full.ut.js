import FullApplicationController from '../../../../src/controllers/full/FullApplicationController.js';
import ApplicationController from '../../../../src/controllers/ApplicationController.js';
import FullPlayerController from '../../../../src/controllers/full/FullPlayerController.js';
import browser from '../../../../src/services/browser.js';
import codeLoader from '../../../../src/services/code_loader.js';
import RunnerPromise from '../../../../lib/RunnerPromise.js';
import {
    defer
} from '../../../../lib/utils.js';

describe('FullApplicationController', function() {
    let FullApplicationCtrl;
    let rootNode;
    let mouseDeferred;

    beforeEach(function() {
        rootNode = document.createElement('body');
        mouseDeferred = defer(RunnerPromise);
        spyOn(browser, 'test').and.returnValue(mouseDeferred.promise);

        FullApplicationCtrl = new FullApplicationController(rootNode);
    });

    it('should exist', function() {
        expect(FullApplicationCtrl).toEqual(jasmine.any(ApplicationController));
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
            expect(codeLoader.loadStyles).toHaveBeenCalledWith('css/full--hover.css');
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
            it('should be a MobilePlayerController', function() {
                expect(FullApplicationCtrl.PlayerCtrl).toEqual(jasmine.any(FullPlayerController));
            });
        });
    });
});
