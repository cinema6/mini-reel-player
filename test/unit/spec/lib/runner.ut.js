import Runner from '../../../../lib/Runner.js';
import global from '../../../../lib/global.js';

describe('Runner', function() {
    class Queue {
        constructor(name) {
            this.name = name;
            this.hasWork = false;

            this.add = jasmine.createSpy('queue.add()');
            this.addOnce = jasmine.createSpy('queue.addOnce()');
            this.flush = jasmine.createSpy('queue.flush()');
        }
    }

    it('should exist', function() {
        expect(Runner).toEqual(jasmine.any(Function));
    });

    describe('class', function() {
        describe('queues', function() {
            let [BeforeRender, Render, AfterRender] = Runner.queues;

            [
                { name: 'beforeRender', Queue: BeforeRender },
                { name: 'afterRender', Queue: AfterRender }
            ].forEach(function({ name, Queue }) {
                describe(`${name} queue`, function() {
                    let queue;

                    beforeEach(function() {
                        queue = new Queue();
                    });

                    it('should exist', function() {
                        expect(queue).toEqual(jasmine.any(Object));
                    });

                    describe('properties:', function() {
                        describe('name', function() {
                            it(`should be ${name}`, function() {
                                expect(queue.name).toBe(name);
                            });
                        });

                        describe('hasWork', function() {
                            it('should be initialized as false', function() {
                                expect(queue.hasWork).toBe(false);
                            });
                        });
                    });

                    describe('methods', function() {
                        describe('add(fn)', function() {
                            beforeEach(function() {
                                queue.add({}, function() {}, ['hey']);
                            });

                            it('should set hasWork to true', function() {
                                expect(queue.hasWork).toBe(true);
                            });
                        });

                        describe('addOnce(context, fn, args)', function() {
                            let fn1, fn2;
                            let context;

                            beforeEach(function() {
                                context = {};

                                fn1 = jasmine.createSpy('fn1()');
                                fn2 = jasmine.createSpy('fn2()');

                                queue.addOnce(context, fn1, ['hello']);
                                queue.addOnce(context, fn1, ['nevermind']);
                                queue.addOnce(context, fn2, ['HEY!']);
                                queue.addOnce(context, fn1, ['got', 'it']);
                                queue.add(context, fn2, ['Still call me!']);
                                queue.addOnce(context, fn2, ['cool!']);

                                queue.flush();
                            });

                            it('should call each function with the most recent arguments', function() {
                                expect(fn1).toHaveBeenCalledWith('got', 'it');
                                expect(fn1.calls.mostRecent().object).toBe(context);
                                expect(fn1.calls.count()).toBe(1);

                                expect(fn2).toHaveBeenCalledWith('cool!');
                                expect(fn2).toHaveBeenCalledWith('Still call me!');
                                fn2.calls.all().forEach(call => expect(call.object).toBe(context));
                                expect(fn2.calls.count()).toBe(2);
                            });

                            describe('if the same function is called with different contexts', function() {
                                let fn;
                                let context1;
                                let context2;

                                beforeEach(function() {
                                    fn = jasmine.createSpy('fn()');
                                    context1 = {};
                                    context2 = {};

                                    queue.addOnce(context1, fn, ['foo']);
                                    queue.addOnce(context1, fn, ['cool']);
                                    queue.addOnce(context2, fn, ['another']);
                                    queue.addOnce(context2, fn, ['beans']);

                                    queue.flush();
                                });

                                it('should call the function once per context', function() {
                                    expect(fn).toHaveBeenCalledWith('cool');
                                    expect(fn.calls.first().object).toBe(context1);

                                    expect(fn).toHaveBeenCalledWith('beans');
                                    expect(fn.calls.mostRecent().object).toBe(context2);

                                    expect(fn.calls.count()).toBe(2);
                                });
                            });
                        });

                        describe('flush(next)', function() {
                            let next;
                            let fn1, context1, args1;
                            let fn2, context2, args2;
                            let fn3, context3, args3;

                            beforeEach(function(done) {
                                next = jasmine.createSpy('next()').and.callFake(done);

                                fn1 = jasmine.createSpy('fn1()').and.callFake(function() {
                                    return new Promise(function(fulfill) {
                                        setTimeout(fulfill, 3);
                                    });
                                });
                                context1 = { foo: 'bar' };
                                args1 = ['how', 'are', 'you?'];

                                fn2 = jasmine.createSpy('fn2()').and.callFake(function() {
                                    return new Promise(function(fulfill) {
                                        setTimeout(fulfill, 2);
                                    });
                                });
                                context2 = { name: 'Josh' };

                                context3 = {};
                                fn3 = context3.someMethod = jasmine.createSpy('fn3()').and.callFake(function() {
                                    return 'foo';
                                });
                                args3 = ['HEY!'];

                                queue.add(context1, fn1, args1);
                                queue.add(context2, fn2, args2);
                                queue.add(context3, 'someMethod', args3);

                                queue.flush(next);
                            });

                            it('should call each function in the queue', function() {
                                expect(fn1).toHaveBeenCalledWith(...args1);
                                expect(fn1.calls.mostRecent().object).toBe(context1);

                                expect(fn2).toHaveBeenCalledWith();
                                expect(fn2.calls.mostRecent().object).toBe(context2);

                                expect(fn3).toHaveBeenCalledWith(...args3);
                                expect(fn3.calls.mostRecent().object).toBe(context3);
                            });

                            it('should hasWork to false', function() {
                                expect(queue.hasWork).toBe(false);
                            });

                            describe('if there is a failure', function() {
                                let error;

                                beforeEach(function(done) {
                                    let foo;

                                    try { foo.bar = 'hey'; } catch (e) { error = e; }
                                    queue.add({}, () => Promise.reject(error));
                                    spyOn(process, 'nextTick');

                                    queue.flush();
                                    Promise.resolve().then(() => {}).then(() => {}).then(done);
                                });

                                it('should throw the error in the next turn of the event loop', function() {
                                    expect(process.nextTick.calls.mostRecent().args[0]).toThrow(error);
                                });
                            });

                            describe('when called again', function() {
                                beforeEach(function(done) {
                                    queue.flush(done);
                                });

                                it('should not call the same items', function() {
                                    [fn1, fn2, fn3].forEach(function(spy) {
                                        expect(spy.calls.count()).not.toBeGreaterThan(1);
                                    });
                                });
                            });
                        });
                    });
                });
            });

            describe('render queue', function() {
                let queue;

                beforeEach(function() {
                    queue = new Render();
                });

                it('should exist', function() {
                    expect(queue).toEqual(jasmine.any(Object));
                });

                describe('properties:', function() {
                    describe('name', function() {
                        it('should be render', function() {
                            expect(queue.name).toBe('render');
                        });
                    });

                    describe('hasWork', function() {
                        it('should be initialized as false', function() {
                            expect(queue.hasWork).toBe(false);
                        });
                    });
                });

                describe('methods', function() {
                    describe('add(fn)', function() {
                        beforeEach(function() {
                            queue.add({}, function() {});
                        });

                        it('should set hasWork to true', function() {
                            expect(queue.hasWork).toBe(true);
                        });
                    });

                    describe('addOnce(context, fn, args)', function() {
                        let fn1, fn2;
                        let context;

                        beforeEach(function() {
                            context = {};

                            fn1 = jasmine.createSpy('fn1()');
                            fn2 = jasmine.createSpy('fn2()');

                            queue.addOnce(context, fn1, ['hello']);
                            queue.addOnce(context, fn1, ['nevermind']);
                            queue.addOnce(context, fn2, ['HEY!']);
                            queue.addOnce(context, fn1, ['got', 'it']);
                            queue.add(context, fn2, ['Still call me!']);
                            queue.addOnce(context, fn2, ['cool!']);

                            spyOn(global, 'requestAnimationFrame');

                            queue.flush();
                            global.requestAnimationFrame.calls.mostRecent().args[0]();
                        });

                        it('should call each function with the most recent arguments', function() {
                            expect(fn1).toHaveBeenCalledWith('got', 'it');
                            expect(fn1.calls.mostRecent().object).toBe(context);
                            expect(fn1.calls.count()).toBe(1);

                            expect(fn2).toHaveBeenCalledWith('cool!');
                            expect(fn2).toHaveBeenCalledWith('Still call me!');
                            fn2.calls.all().forEach(call => expect(call.object).toBe(context));
                            expect(fn2.calls.count()).toBe(2);
                        });

                        describe('if the same function is called with different contexts', function() {
                            let fn;
                            let context1;
                            let context2;

                            beforeEach(function() {
                                fn = jasmine.createSpy('fn()');
                                context1 = {};
                                context2 = {};

                                queue.addOnce(context1, fn, ['foo']);
                                queue.addOnce(context1, fn, ['cool']);
                                queue.addOnce(context2, fn, ['another']);
                                queue.addOnce(context2, fn, ['beans']);

                                queue.flush();
                                global.requestAnimationFrame.calls.mostRecent().args[0]();
                            });

                            it('should call the function once per context', function() {
                                expect(fn).toHaveBeenCalledWith('cool');
                                expect(fn.calls.first().object).toBe(context1);

                                expect(fn).toHaveBeenCalledWith('beans');
                                expect(fn.calls.mostRecent().object).toBe(context2);

                                expect(fn.calls.count()).toBe(2);
                            });
                        });
                    });

                    describe('flush(next)', function() {
                        let next;
                        let fn1, context1, args1;
                        let fn2, context2, args2;
                        let fn3, context3, args3;

                        beforeEach(function() {
                            next = jasmine.createSpy('next()');

                            fn1 = jasmine.createSpy('fn1()').and.callFake(function() {
                                return new Promise(function(fulfill) {
                                    setTimeout(fulfill, 3);
                                });
                            });
                            context1 = { foo: 'bar' };
                            args1 = ['how', 'are', 'you?'];

                            fn2 = jasmine.createSpy('fn2()').and.callFake(function() {
                                return new Promise(function(fulfill) {
                                    setTimeout(fulfill, 2);
                                });
                            });
                            context2 = { name: 'Josh' };

                            context3 = {};
                            fn3 = context3.someMethod = jasmine.createSpy('fn3()').and.callFake(function() {
                                return 'foo';
                            });
                            args3 = ['HEY!'];

                            queue.add(context1, fn1, args1);
                            queue.add(context2, fn2, args2);
                            queue.add(context3, 'someMethod', args3);

                            spyOn(global, 'requestAnimationFrame');

                            queue.flush(next);
                        });

                        it('should not call any of the functions', function() {
                            [fn1, fn2, fn3].forEach(function(spy) {
                                expect(spy).not.toHaveBeenCalled();
                            });
                        });

                        it('should schedule a request requestAnimationFrame', function() {
                            expect(global.requestAnimationFrame).toHaveBeenCalledWith(jasmine.any(Function));
                        });

                        describe('when the animation frame fires', function() {
                            let frame;

                            beforeEach(function(done) {
                                frame = global.requestAnimationFrame.calls.mostRecent().args[0];

                                next.and.callFake(done);

                                frame();
                            });

                            it('should call each function in the queue', function() {
                                expect(fn1).toHaveBeenCalledWith(...args1);
                                expect(fn1.calls.mostRecent().object).toBe(context1);

                                expect(fn2).toHaveBeenCalledWith();
                                expect(fn2.calls.mostRecent().object).toBe(context2);

                                expect(fn3).toHaveBeenCalledWith(...args3);
                                expect(fn3.calls.mostRecent().object).toBe(context3);
                            });

                            it('should hasWork to false', function() {
                                expect(queue.hasWork).toBe(false);
                            });

                            describe('when called again', function() {
                                beforeEach(function(done) {
                                    queue.flush(done);

                                    frame = global.requestAnimationFrame.calls.mostRecent().args[0];

                                    frame();
                                });

                                it('should not call the same items', function() {
                                    [fn1, fn2, fn3].forEach(function(spy) {
                                        expect(spy.calls.count()).not.toBeGreaterThan(1);
                                    });
                                });
                            });
                        });
                    });
                });

            });
        });

        describe('methods:', function() {
            describe('run(fn, ...args)', function() {
                let result;
                let object;
                let runFn, arg1, arg2;

                beforeEach(function() {
                    object = {};

                    runFn = jasmine.createSpy('runFn()').and.callFake(function() {
                        spyOn(Runner.prototype, 'flush');

                        expect(function() {
                            Runner.schedule('beforeRender', null, function() {});
                            Runner.schedule('render', null, function() {});
                            Runner.schedule('afterRender', null, function() {});
                        }).not.toThrow();

                        return object;
                    });
                    arg1 = { name: 'arg1' };
                    arg2 = { name: 'arg2' };

                    result = Runner.run(runFn, arg1, arg2);
                });

                it('should call the run function with the provided args', function() {
                    expect(runFn).toHaveBeenCalledWith(arg1, arg2);
                });

                it('should flush the queue', function() {
                    expect(Runner.prototype.flush).toHaveBeenCalled();
                    expect(Runner.prototype.flush.calls.mostRecent().object).toEqual(jasmine.any(Runner));
                });

                it('should return the result of the provided function', function() {
                    expect(result).toBe(object);
                });

                describe('if the provided function calls Runner.run()', function() {
                    let fn1, fn2;

                    beforeEach(function() {
                        spyOn(Runner.prototype, 'schedule').and.callThrough();
                        fn1 = (() => {
                            Runner.schedule('render', null, () => {});
                            Runner.run(fn2);
                        });
                        fn2 = (() => Runner.schedule('render', null, () => {}));
                    });

                    it('should throw an error', function() {
                        expect(() => Runner.run(fn1)).toThrow(new Error('Cannot call Runner.run() because a flush is already in progress.'));
                    });
                });

                describe('if the provided function throws an error', function() {
                    let fn;
                    let error;

                    beforeEach(function() {
                        error = new Error('I SUCK!');
                        fn = jasmine.createSpy('fn()').and.throwError(error);

                        expect(() => Runner.run(fn)).toThrow(error);
                    });

                    it('should allow Runner.run() to be called again', function() {
                        expect(() => Runner.run(() => {})).not.toThrow();
                    });
                });
            });

            describe('schedule(queue, context, fn, args)', function() {
                let fn1, context1, args1;
                let fn2, context2, args2;
                let fn3, context3, args3;

                beforeEach(function() {

                    spyOn(Runner.prototype, 'schedule');
                    spyOn(Runner.prototype, 'flush');

                    fn1 = function() {}; context1 = { foo: 'bar' }; args1 = ['hello', 'world'];
                    fn2 = function() {}; context2 = null; args2 = ['hey'];
                    fn3 = function() {}; context3 = { bar: 'foo' };

                    Runner.run(function() {
                        Runner.schedule('beforeRender', context1, fn1, args1);
                        Runner.schedule('render', context2, fn2, args2);
                        Runner.schedule('afterRender', context3, fn3, args3);
                    });
                });

                it('should schedule actions on the current runner instance', function() {
                    expect(Runner.prototype.schedule).toHaveBeenCalledWith('beforeRender', context1, fn1, args1);
                    expect(Runner.prototype.schedule).toHaveBeenCalledWith('render', context2, fn2, args2);
                    expect(Runner.prototype.schedule).toHaveBeenCalledWith('afterRender', context3, fn3, args3);
                });

                describe('if there is no open runner', function() {
                    it('should throw an error', function() {
                        expect(function() {
                            Runner.schedule('beforeRender', null, function() {});
                        }).toThrow(new Error('Cannot schedule task because there is no open runner instance.'));
                    });
                });
            });

            describe('scheduleOnce(queue, context, fn, args)', function() {
                let fn1, context1, args1;
                let fn2, context2, args2;
                let fn3, context3, args3;

                beforeEach(function() {
                    spyOn(Runner.prototype, 'scheduleOnce');
                    spyOn(Runner.prototype, 'flush');

                    fn1 = function() {}; context1 = { foo: 'bar' }; args1 = ['hello', 'world'];
                    fn2 = function() {}; context2 = null; args2 = ['hey'];
                    fn3 = function() {}; context3 = { bar: 'foo' };

                    Runner.run(function() {
                        Runner.scheduleOnce('beforeRender', context1, fn1, args1);
                        Runner.scheduleOnce('render', context2, fn2, args2);
                        Runner.scheduleOnce('afterRender', context3, fn3, args3);
                    });
                });

                it('should schedule actions on the current runner instance', function() {
                    expect(Runner.prototype.scheduleOnce).toHaveBeenCalledWith('beforeRender', context1, fn1, args1);
                    expect(Runner.prototype.scheduleOnce).toHaveBeenCalledWith('render', context2, fn2, args2);
                    expect(Runner.prototype.scheduleOnce).toHaveBeenCalledWith('afterRender', context3, fn3, args3);
                });

                describe('if there is no open runner', function() {
                    it('should throw an error', function() {
                        expect(function() {
                            Runner.scheduleOnce('beforeRender', null, function() {});
                        }).toThrow(new Error('Cannot schedule task because there is no open runner instance.'));
                    });
                });
            });

            describe('runNext(fn, ...args)', function() {
                let runFn, arg1, arg2;

                beforeEach(function() {
                    runFn = jasmine.createSpy('runFun()').and.callFake(() => Runner.schedule('render', null, () => {}));

                    arg1 = { data: 'arg1' };
                    arg2 = { data: 'arg2' };

                    spyOn(Runner, 'run').and.callThrough();
                });

                describe('if there is no open runner', function() {
                    beforeEach(function() {
                        Runner.runNext(runFn, arg1, arg2);
                    });

                    it('should call Runner.run()', function() {
                        expect(Runner.run).toHaveBeenCalledWith(runFn, arg1, arg2);
                    });
                });

                describe('if there is an open Runner', function() {
                    let flushDone;
                    let runFn2;

                    beforeEach(function() {
                        spyOn(Runner.prototype, 'flush').and.callFake(function(callback) {
                            flushDone = callback || function() {};
                        });

                        runFn2 = jasmine.createSpy('runFn2()').and.callFake(() => Runner.schedule('beforeRender', null, () => {}));

                        Runner.run(() => {
                            Runner.run.calls.reset();
                            Runner.runNext(runFn, arg1, arg2);
                            Runner.runNext(runFn2);
                        });
                    });

                    it('should not call Runner.run()', function() {
                        expect(Runner.run).not.toHaveBeenCalled();
                    });

                    it('should not call the provided function', function() {
                        expect(runFn).not.toHaveBeenCalled();
                        expect(runFn2).not.toHaveBeenCalled();
                    });

                    describe('when the current runner is done', function() {
                        beforeEach(function() {
                            flushDone();
                        });

                        it('should call Runner.run() once', function() {
                            expect(Runner.run).toHaveBeenCalledWith(jasmine.any(Function));
                            expect(Runner.run.calls.count()).toBe(1);
                        });

                        it('should call the functions with their specified args', function() {
                            expect(runFn).toHaveBeenCalledWith(arg1, arg2);
                            expect(runFn2).toHaveBeenCalledWith();
                        });
                    });
                });
            });
        });
    });

    describe('instance', function() {
        let runner;
        let beforeRender;
        let render;
        let afterRender;

        beforeEach(function() {
            beforeRender = new Queue('beforeRender');
            render = new Queue('render');
            afterRender = new Queue('afterRender');

            runner = new Runner([beforeRender, render, afterRender]);
        });

        describe('methods:', function() {
            describe('schedule(queue, context, fn, args)', function() {
                let fn1, context1, args1;
                let fn2, context2, args2;
                let fn3, context3, args3;
                let fn4, context4, args4;

                beforeEach(function() {
                    fn1 = function() {}; context1 = { foo: 'bar' }; args1 = ['hello', 'world'];
                    fn2 = function() {}; context2 = null; args2 = ['sup?'];
                    fn3 = function() {}; context3 = { bar: 'foo' };
                    fn4 = function() {};

                    runner.schedule('beforeRender', context2, fn2, args2);
                    runner.schedule('render', context1, fn1, args1);
                    runner.schedule('afterRender', context4, fn4, args4);
                    runner.schedule('render', context3, fn3, args3);
                });

                it('should add functions to the queue', function() {
                    expect(beforeRender.add).toHaveBeenCalledWith(context2, fn2, args2);
                    expect(render.add).toHaveBeenCalledWith(context1, fn1, args1);
                    expect(afterRender.add).toHaveBeenCalledWith(context4, fn4, args4);
                    expect(render.add).toHaveBeenCalledWith(context3, fn3, args3);
                });

                describe('if called with an unknown queue', function() {
                    it('should throw an error', function() {
                        expect(function() {
                            runner.schedule('foo', function() {});
                        }).toThrow(new Error('Unknown queue: [foo].'));
                    });
                });
            });

            describe('scheduleOnce(queue, context, fn, args)', function() {
                let fn1, context1, args1;
                let fn2, context2, args2;
                let fn3, context3, args3;
                let fn4, context4, args4;

                beforeEach(function() {
                    fn1 = function() {}; context1 = { foo: 'bar' }; args1 = ['hello', 'world'];
                    fn2 = function() {}; context2 = null; args2 = ['sup?'];
                    fn3 = function() {}; context3 = { bar: 'foo' };
                    fn4 = function() {};

                    runner.scheduleOnce('beforeRender', context2, fn2, args2);
                    runner.scheduleOnce('render', context1, fn1, args1);
                    runner.scheduleOnce('afterRender', context4, fn4, args4);
                    runner.scheduleOnce('render', context3, fn3, args3);
                });

                it('should add functions to the queue', function() {
                    expect(beforeRender.addOnce).toHaveBeenCalledWith(context2, fn2, args2);
                    expect(render.addOnce).toHaveBeenCalledWith(context1, fn1, args1);
                    expect(afterRender.addOnce).toHaveBeenCalledWith(context4, fn4, args4);
                    expect(render.addOnce).toHaveBeenCalledWith(context3, fn3, args3);
                });

                describe('if called with an unknown queue', function() {
                    it('should throw an error', function() {
                        expect(function() {
                            runner.schedule('foo', function() {});
                        }).toThrow(new Error('Unknown queue: [foo].'));
                    });
                });
            });

            describe('flush()', function() {
                let callback;

                beforeEach(function() {
                    callback = jasmine.createSpy('callback()');
                });

                describe('if no queues have work', function() {
                    beforeEach(function() {
                        beforeRender.hasWork = false;
                        render.hasWork = false;
                        afterRender.hasWork = false;

                        runner.flush();
                    });

                    it('should not flush any queues', function() {
                        expect(beforeRender.flush).not.toHaveBeenCalled();
                        expect(render.flush).not.toHaveBeenCalled();
                        expect(afterRender.flush).not.toHaveBeenCalled();
                    });
                });

                describe('if a queue has work', function() {
                    beforeEach(function() {
                        render.hasWork = true;

                        runner.flush(callback);
                    });

                    it('should flush the queue with work', function() {
                        expect(render.flush).toHaveBeenCalledWith(jasmine.any(Function));
                    });

                    describe('when the queue is done', function() {
                        let next;

                        beforeEach(function() {
                            next = render.flush.calls.mostRecent().args[0];

                            beforeRender.hasWork = true;
                            render.hasWork = false;
                            afterRender.hasWork = true;

                            next();
                        });

                        it('should flush the first queue with work it finds', function() {
                            expect(beforeRender.flush).toHaveBeenCalledWith(jasmine.any(Function));
                            expect(afterRender.flush).not.toHaveBeenCalled();
                        });

                        describe('when the queue is done', function() {
                            beforeEach(function() {
                                next = beforeRender.flush.calls.mostRecent().args[0];

                                beforeRender.hasWork = false;
                                render.hasWork = true;
                                afterRender.hasWork = true;

                                render.flush.calls.reset();

                                next();
                            });

                            it('should flush the first queue with work it finds', function() {
                                expect(render.flush).toHaveBeenCalledWith(jasmine.any(Function));
                                expect(afterRender.flush).not.toHaveBeenCalled();
                            });

                            describe('when the queue after that is done', function() {
                                beforeEach(function() {
                                    next = render.flush.calls.mostRecent().args[0];

                                    beforeRender.hasWork = false;
                                    render.hasWork = false;
                                    afterRender.hasWork = true;

                                    next();
                                });

                                it('should flush the next queue', function() {
                                    expect(afterRender.flush).toHaveBeenCalledWith(jasmine.any(Function));
                                });

                                describe('when all queues has been flushed', function() {
                                    beforeEach(function() {
                                        next = afterRender.flush.calls.mostRecent().args[0];

                                        beforeRender.hasWork = false;
                                        render.hasWork = false;
                                        afterRender.hasWork = false;

                                        expect(callback).not.toHaveBeenCalled();

                                        next();
                                    });

                                    it('should call the callback', function() {
                                        expect(callback).toHaveBeenCalled();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});
