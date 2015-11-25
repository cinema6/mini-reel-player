import adtech from '../../../src/services/adtech.js';
import codeLoader from '../../../src/services/code_loader.js';
import RunnerPromise from '../../../lib/RunnerPromise.js';
import environment from '../../../src/environment.js';

describe('adtech', function() {
    let ADTECH;

    beforeEach(function(done) {
        adtech.constructor();
        environment.constructor();

        codeLoader.load('adtech').then(_ADTECH_ => ADTECH = _ADTECH_).catch(err => console.error(err)).then(done, done);
    });

    beforeAll(function() {
        codeLoader.constructor();
        codeLoader.configure('adtech', {
            src: '//aka-cdn.adtechus.com/dt/common/DAC.js',
            after() { return global.ADTECH; }
        });
    });

    afterAll(function(done) {
        codeLoader.constructor();
        adtech.constructor();
        environment.constructor();
        process.nextTick(done);
    });

    describe('methods:', function() {
        describe('load(config)', function() {
            let success, failure;
            let result;

            beforeEach(function(done) {
                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');

                spyOn(ADTECH, 'loadAd');

                environment.debug = true;
                environment.secure = false;

                result = adtech.load({
                    network: '5473.1',
                    server: 'adserver.adtechus.com',
                    placement: 12345,
                    adContainerId: 'rc-89234hr894',
                    kv: { mode: 'default' }
                });
                codeLoader.load('adtech').then(done, done);

                result.then(success, failure);
            });

            it('should return a RunnerPromise', function() {
                expect(result).toEqual(jasmine.any(RunnerPromise));
            });

            it('should make a request to ADTECH with some defaults', function() {
                expect(ADTECH.loadAd).toHaveBeenCalledWith({
                    secure: false,
                    network: '5473.1',
                    server: 'adserver.adtechus.com',
                    placement: 12345,
                    adContainerId: 'rc-89234hr894',
                    debugMode: true,
                    kv: { mode: 'default' },
                    complete: jasmine.any(Function)
                });
            });

            describe('when the load is complete', function() {
                beforeEach(function(done) {
                    result.then(done, done);
                    ADTECH.loadAd.calls.mostRecent().args[0].complete();
                });

                it('should fulfill the promise', function() {
                    expect(success).toHaveBeenCalledWith(undefined);
                });
            });

            describe('if in production', function() {
                beforeEach(function(done) {
                    environment.debug = false;
                    ADTECH.loadAd.calls.reset();

                    adtech.load({});
                    codeLoader.load('adtech').then(done, done);
                });

                it('should set debugMode to false', function() {
                    expect(ADTECH.loadAd).toHaveBeenCalledWith(jasmine.objectContaining({
                        debugMode: false
                    }));
                });
            });

            describe('if in a secure environment', function() {
                beforeEach(function(done) {
                    environment.secure = true;
                    ADTECH.loadAd.calls.reset();

                    adtech.load({});
                    codeLoader.load('adtech').then(done, done);
                });

                it('should set secure to true', function() {
                    expect(ADTECH.loadAd).toHaveBeenCalledWith(jasmine.objectContaining({
                        secure: true
                    }));
                });
            });
        });

        describe('setDefaults(defaults)', function() {
            let defaults;

            beforeEach(function() {
                defaults = {
                    network: '5473.1',
                    server: 'adserver.adtechus.com',
                    kv: { mode: 'default' }
                };
                spyOn(ADTECH, 'loadAd');

                adtech.setDefaults(defaults);
            });

            it('should use the defaults when load() is called', function(done) {
                adtech.load({ placement: 54321, adContainerId: 'rc-3748fh3489' });
                codeLoader.load('adtech').then(ADTECH => {
                    expect(ADTECH.loadAd).toHaveBeenCalledWith(jasmine.objectContaining(defaults));
                    expect(ADTECH.loadAd).toHaveBeenCalledWith(jasmine.objectContaining({
                        placement: 54321,
                        adContainerId: 'rc-3748fh3489'
                    }));
                }).then(done, done);
            });
        });
    });
});
