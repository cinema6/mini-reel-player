import timer from '../../../../lib/timer.js';
import global from '../../../../lib/global.js';
import RunnerPromise from '../../../../lib/RunnerPromise.js';
import Runner from '../../../../lib/Runner.js';

describe('timer', function() {
    beforeEach(function(done) {
        process.nextTick(done);
        timer.constructor();
        jasmine.clock().install();
    });

    afterEach(function() {
        jasmine.clock().uninstall();
    });

    it('should exist', function() {
        expect(timer).toEqual(jasmine.any(Object));
    });

    describe('methods:', function() {
        describe('wait(ms)', function() {
            let result;

            beforeEach(function() {
                spyOn(global, 'setTimeout').and.callThrough();

                result = timer.wait(300);
            });

            it('should set a timeout for the amount of ms provided', function() {
                expect(global.setTimeout).toHaveBeenCalledWith(jasmine.any(Function), 300);
            });

            it('should return a RunnerPromise', function() {
                expect(result).toEqual(jasmine.any(RunnerPromise));
            });

            describe('if canceled', function() {
                let done, cancelResult;

                beforeEach(function(_done) {
                    done = jasmine.createSpy('done()').and.callFake(_done);
                    result.catch(done);

                    cancelResult = timer.cancel(result);
                    jasmine.clock().tick(10);
                });

                it('should reject the promise', function() {
                    expect(done).toHaveBeenCalledWith(undefined);
                });

                it('should return the promise', function() {
                    expect(cancelResult).toBe(result);
                });
            });

            describe('when the timeout is over', function() {
                let done;

                beforeEach(function(_done) {
                    done = jasmine.createSpy('done()').and.callFake(_done);
                    result.then(done);

                    jasmine.clock().tick(315);
                });

                it('should resolve the promise with undefined', function() {
                    expect(done).toHaveBeenCalledWith(undefined);
                });
            });
        });

        describe('interval(fn, ms)', function() {
            let result, fn;

            beforeEach(function() {
                spyOn(Runner, 'run').and.callThrough();
                fn = jasmine.createSpy('fn()').and.callFake(() => Runner.schedule('render', null, () => {}));

                result = timer.interval(fn, 50);
            });

            it('should return a promise', function() {
                expect(result).toEqual(jasmine.any(RunnerPromise));
            });

            it('should call the fn every x ms', function() {
                jasmine.clock().tick(50);
                expect(fn.calls.count()).toBe(1);
                expect(Runner.run.calls.count()).toBe(1);

                jasmine.clock().tick(50);
                expect(fn.calls.count()).toBe(2);
                expect(Runner.run.calls.count()).toBe(2);

                fn.calls.all().forEach(call => expect(call.args[0]).toEqual(jasmine.any(Function)));
            });

            describe('if canceled with the done() function passed to the callback each time', function() {
                beforeEach(function() {
                    spyOn(timer, 'cancel');

                    jasmine.clock().tick(50);
                    fn.calls.mostRecent().args[0]();
                });

                it('should cancel the timer', function() {
                    expect(timer.cancel).toHaveBeenCalledWith(result);
                });
            });

            describe('if canceled', function() {
                let done, cancelResult;

                beforeEach(function(_done) {
                    done = jasmine.createSpy('done()').and.callFake(_done);
                    result.then(done);

                    fn.calls.reset();
                    cancelResult = timer.cancel(result);
                    jasmine.clock().tick(15);
                });

                it('should fulfill the promise', function() {
                    expect(done).toHaveBeenCalledWith(undefined);
                });

                it('should return the promise', function() {
                    expect(cancelResult).toBe(result);
                });

                it('should not call the callback anymore', function() {
                    jasmine.clock().tick(50);
                    expect(fn).not.toHaveBeenCalled();
                });
            });
        });

        describe('cancel(promise)', function() {
            describe('if called with a promise it didn\'t generate', function() {
                it('should throw a useful error', function() {
                    expect(function() {
                        timer.cancel(new Promise(function() {}));
                    }).toThrow(new Error('Unknown promise passed to timer.cancel(). The promise must be one created by wait() or interval().'));
                });
            });
        });

        describe('nextTick(fn)', function() {
            let fn1, fn2, fn3;

            beforeEach(function() {
                fn1 = jasmine.createSpy('fn1()');
                fn2 = jasmine.createSpy('fn2()');
                fn3 = jasmine.createSpy('fn3()');

                spyOn(process, 'nextTick');

                timer.nextTick(fn1);
                timer.nextTick(fn2);
                timer.nextTick(fn3);
            });

            it('should not call any of the fns', function() {
                [fn1, fn2, fn3].forEach(spy => expect(spy).not.toHaveBeenCalled());
            });

            it('should schedule one action in the nextTick()', function() {
                expect(process.nextTick).toHaveBeenCalledWith(jasmine.any(Function));
                expect(process.nextTick.calls.count()).toBe(1);
            });

            describe('in the next tick', function() {
                beforeEach(function() {
                    spyOn(Runner, 'run').and.callThrough();

                    process.nextTick.calls.mostRecent().args[0]();
                });

                it('should call every function in a single call to Runner.run()', function() {
                    expect(Runner.run.calls.count()).toBe(1);
                    [fn1, fn2, fn3].forEach(spy => expect(spy).toHaveBeenCalled());
                });

                describe('when called again', function() {
                    let fn4;

                    beforeEach(function() {
                        fn4 = jasmine.createSpy('fn4()');

                        [fn1, fn2, fn3].forEach(spy => spy.calls.reset());
                        process.nextTick.calls.reset();

                        timer.nextTick(fn4);
                    });

                    it('should schedule another tick', function() {
                        expect(process.nextTick.calls.count()).toBe(1);
                    });

                    describe('in the next tick', function() {
                        beforeEach(function() {
                            process.nextTick.calls.mostRecent().args[0]();
                        });

                        it('should only call the function passed to it', function() {
                            expect(fn4).toHaveBeenCalled();
                            [fn1, fn2, fn2].forEach(spy => expect(spy).not.toHaveBeenCalled());
                        });
                    });
                });
            });
        });
    });
});
