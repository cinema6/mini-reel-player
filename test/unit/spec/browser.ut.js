import browser from '../../../src/services/browser.js';
import RunnerPromise from '../../../lib/RunnerPromise.js';
import {
    defer
} from '../../../lib/utils.js';

describe('browser', function() {
    beforeEach(function() {
        browser.constructor();
    });

    /* global afterAll */
    afterAll(function() {
        browser.constructor();
    });

    it('should exist', function() {
        expect(browser).toEqual(jasmine.any(Object));
    });

    describe('methods:', function() {
        describe('addTest(feature, tester)', function() {
            let result;

            beforeEach(function() {
                result = browser.addTest('hello', () => {});
            });

            it('should be chainable', function() {
                expect(result).toBe(browser);
            });
        });

        describe('test(feature)', function() {
            it('should return a RunnerPromise', function() {
                expect(browser.test()).toEqual(jasmine.any(RunnerPromise));
            });

            describe('if passed an unknown feature', function() {
                let spy;

                beforeEach(function(done) {
                    spy = jasmine.createSpy('spy()');

                    browser.test('a90ef3').catch(spy).then(done, done);
                });

                it('should reject with an error', function() {
                    expect(spy).toHaveBeenCalledWith(new Error('Unknown feature test [a90ef3].'));
                });
            });

            describe('if passed a known feature', function() {
                let spy, testDeferred;
                let testFn;
                let result;

                beforeEach(function() {
                    testDeferred = defer(Promise);
                    spy = jasmine.createSpy('spy()');
                    testFn = jasmine.createSpy('testFn()').and.returnValue(testDeferred.promise);

                    browser.addTest('foo', testFn);

                    result = browser.test('foo');
                    result.then(spy);
                });

                it('should return a RunnerPromise', function() {
                    expect(result).toEqual(jasmine.any(RunnerPromise));
                });

                it('should call the testFn()', function() {
                    expect(testFn).toHaveBeenCalled();
                });

                describe('if the testFn() fulfills to something truthy', function() {
                    beforeEach(function(done) {
                        result.then(done, done);
                        testDeferred.fulfill('b');
                    });

                    it('should fulfill to true', function() {
                        expect(spy).toHaveBeenCalledWith(true);
                    });
                });

                describe('if the testFn() fulfills to something falsy', function() {
                    beforeEach(function(done) {
                        result.then(done, done);
                        testDeferred.fulfill(null);
                    });

                    it('should fulfill to false', function() {
                        expect(spy).toHaveBeenCalledWith(false);
                    });
                });

                describe('if the testFn rejects', function() {
                    beforeEach(function(done) {
                        result.then(done, done);
                        testDeferred.reject(new Error('BLEGH'));
                    });

                    it('should fulfill to false', function() {
                        expect(spy).toHaveBeenCalledWith(false);
                    });
                });

                describe('if called again', function() {
                    let newResult;

                    beforeEach(function() {
                        testFn.calls.reset();

                        newResult = browser.test('foo');
                    });

                    it('should not call the testFn()', function() {
                        expect(testFn).not.toHaveBeenCalled();
                    });

                    it('should return the same promise', function() {
                        expect(newResult).toBe(result);
                    });

                    describe('if the second parameter is true', function() {
                        beforeEach(function() {
                            newResult = browser.test('foo', true);
                        });

                        it('should return a new result', function() {
                            expect(newResult).not.toBe(result);
                        });

                        it('should call the testFn() again', function() {
                            expect(testFn).toHaveBeenCalled();
                        });
                    });
                });
            });
        });
    });
});
