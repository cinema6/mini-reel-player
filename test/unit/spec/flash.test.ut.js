import browser from '../../../src/services/browser';
import '../../../src/tests';

describe('flash test', function() {
    let success, failure;

    beforeEach(function() {
        success = jasmine.createSpy('success()');
        failure = jasmine.createSpy('failure()');

        global.ActiveXObject = jasmine.createSpy('ActiveXObject()');
    });

    afterEach(function() {
        delete global.ActiveXObject;
    });

    describe('if creating a flash ActiveXObject() succeeds', function() {
        beforeEach(function(done) {
            browser.test('flash', true).then(success, failure).then(done);
        });

        it('should be true', function() {
            expect(global.ActiveXObject).toHaveBeenCalledWith('ShockwaveFlash.ShockwaveFlash');
            expect(success).toHaveBeenCalledWith(true);
        });
    });

    describe('if creating a flash ActiveXObject() fails', function() {
        beforeEach(function() {
            global.ActiveXObject.and.throwError(new Error('Not supported.'));
        });

        describe('and there is no application/x-shockwave-flash mime type', function() {
            beforeEach(function(done) {
                delete global.navigator.mimeTypes['application/x-shockwave-flash'];
                browser.test('flash', true).then(success, failure).then(done);
            });

            it('should be false', function() {
                expect(success).toHaveBeenCalledWith(false);
            });
        });

        describe('and there is a application/x-shockwave-flash mime type', function() {
            beforeEach(function(done) {
                global.navigator.mimeTypes['application/x-shockwave-flash'] = {};
                browser.test('flash', true).then(success, failure).then(done);
            });

            it('should be true', function() {
                expect(success).toHaveBeenCalledWith(true);
            });
        });
    });
});
