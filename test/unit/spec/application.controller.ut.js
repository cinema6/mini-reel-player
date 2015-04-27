import ApplicationController from '../../../src/controllers/ApplicationController.js';
import ApplicationView from '../../../src/views/ApplicationView.js';
import Controller from '../../../lib/core/Controller.js';
import Runner from '../../../lib/Runner.js';
import environment from '../../../src/environment.js';
import browser from '../../../src/services/browser.js';
import codeLoader from '../../../src/services/code_loader.js';
import RunnerPromise from '../../../lib/RunnerPromise.js';
import {
    defer
} from '../../../lib/utils.js';

describe('ApplicationController', function() {
    let ApplicationCtrl;
    let mouseDeferred;

    let root;

    beforeEach(function() {
        environment.constructor();
        root = document.createElement('body');
        mouseDeferred = defer(RunnerPromise);
        spyOn(browser, 'test').and.returnValue(mouseDeferred.promise);

        environment.mode = 'some-mode';

        Runner.run(() => ApplicationCtrl = new ApplicationController(root));
    });

    afterAll(function() {
        environment.constructor();
    });

    it('should exist', function() {
        expect(ApplicationCtrl).toEqual(jasmine.any(Controller));
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
            expect(codeLoader.loadStyles).toHaveBeenCalledWith(`css/${environment.mode}--hover.css`);
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
        describe('appView', function() {
            it('should be an ApplicationView', function() {
                expect(ApplicationCtrl.appView).toEqual(jasmine.any(ApplicationView));
            });

            it('should be for the root', function() {
                expect(ApplicationCtrl.appView.element).toBe(root);
            });
        });
    });
});
