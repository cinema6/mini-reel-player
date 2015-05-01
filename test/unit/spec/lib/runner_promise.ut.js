import RunnerPromise from '../../../../lib/RunnerPromise.js';
import Runner from '../../../../lib/Runner.js';

describe('RunnerPromise', function() {
    let promise;

    let fulfillHandler, rejectHandler;

    beforeEach(function() {
        const {then} = Promise.prototype;

        spyOn(Promise.prototype, 'then').and.callFake(function(_fulfillHandler, _rejectHandler) {
            fulfillHandler = _fulfillHandler;
            rejectHandler = _rejectHandler;

            return then.apply(this, arguments);
        });

        promise = new RunnerPromise(function() {});
    });

    it('should be a promise', function() {
        expect(promise).toEqual(jasmine.any(Promise));
    });

    describe('methods:', function() {
        describe('then(fulfillHandler, rejectHandler)', function() {
            let onFulfillment, onRejection;
            let value, reason, result;

            beforeEach(function() {
                value = { data: 'I am a value!' };
                reason = new Error('I failed!');

                onFulfillment = jasmine.createSpy('onFulfillment()').and.returnValue(value);
                onRejection = jasmine.createSpy('onRejection()').and.returnValue(reason);

                spyOn(Runner, 'run').and.callThrough();

                result = promise.then(onFulfillment, onRejection);
            });

            it('should call super with some different functions', function() {
                expect(Promise.prototype.then).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function));
                expect(fulfillHandler).not.toBe(onFulfillment);
                expect(rejectHandler).not.toBe(onRejection);
            });

            it('should return another RunnerPromise', function() {
                expect(result).toEqual(jasmine.any(RunnerPromise));
            });

            describe('fulfillment handler', function() {
                let result, data;

                beforeEach(function() {
                    data = { name: 'Cinema6' };
                    result = Promise.prototype.then.calls.mostRecent().args[0](data);
                });

                it('should call the provided handler with the Runner', function() {
                    expect(Runner.run).toHaveBeenCalledWith(onFulfillment, data);
                });

                it('should return the result of the original function', function() {
                    expect(result).toBe(value);
                });
            });

            describe('rejection handler', function() {
                let result, data;

                beforeEach(function() {
                    data = { name: 'MOTA9' };
                    result = Promise.prototype.then.calls.mostRecent().args[1](data);
                });

                it('should call the provided handler with the Runner', function() {
                    expect(Runner.run).toHaveBeenCalledWith(onRejection, data);
                });

                it('should return the result of the original function', function() {
                    expect(result).toBe(reason);
                });
            });

            describe('if called with only a fulfillment handler', function() {
                beforeEach(function() {
                    Promise.prototype.then.calls.reset();

                    promise.then(onFulfillment);
                });

                it('should not call super with a rejection handler', function() {
                    expect(Promise.prototype.then).toHaveBeenCalledWith(jasmine.any(Function), undefined);
                });
            });

            describe('if called with only a rejection handler', function() {
                beforeEach(function() {
                    Promise.prototype.then.calls.reset();

                    promise.then(null, onRejection);
                });

                it('should not call super with a rejection handler', function() {
                    expect(Promise.prototype.then).toHaveBeenCalledWith(null, jasmine.any(Function));
                });
            });
        });
    });
});
