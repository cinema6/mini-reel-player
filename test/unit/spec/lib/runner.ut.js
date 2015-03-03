describe('Runner', function() {
    import Runner from '../../../../lib/Runner.js';
    import global from '../../../../lib/global.js';

    class Queue {
        constructor(name) {
            this.name = name;
            this.hasWork = false;

            this.add = jasmine.createSpy('queue.add()');
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
                                queue.add(function() {});
                            });

                            it('should set hasWork to true', function() {
                                expect(queue.hasWork).toBe(true);
                            });
                        });

                        describe('flush(next)', function() {
                            let next;
                            let fn1;
                            let fn2;
                            let fn3;

                            beforeEach(function(done) {
                                next = jasmine.createSpy('next()').and.callFake(done);

                                fn1 = jasmine.createSpy('fn1()').and.callFake(function() {
                                    return new Promise(function(fulfill) {
                                        setTimeout(fulfill, 3);
                                    });
                                });
                                fn2 = jasmine.createSpy('fn2()').and.callFake(function() {
                                    return new Promise(function(fulfill, reject) {
                                        setTimeout(reject, 2);
                                    });
                                });
                                fn3 = jasmine.createSpy('fn3()').and.callFake(function() {
                                    return 'foo';
                                });

                                queue.add(fn1);
                                queue.add(fn2);
                                queue.add(fn3);

                                queue.flush(next);
                            });

                            it('should call each function in the queue', function() {
                                expect(fn1).toHaveBeenCalled();
                                expect(fn2).toHaveBeenCalled();
                                expect(fn3).toHaveBeenCalled();
                            });

                            it('should hasWork to false', function() {
                                expect(queue.hasWork).toBe(false);
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
                            queue.add(function() {});
                        });

                        it('should set hasWork to true', function() {
                            expect(queue.hasWork).toBe(true);
                        });
                    });

                    describe('flush(next)', function() {
                        let next;
                        let fn1;
                        let fn2;
                        let fn3;

                        beforeEach(function() {
                            next = jasmine.createSpy('next()');

                            fn1 = jasmine.createSpy('fn1()').and.callFake(function() {
                                return new Promise(function(fulfill) {
                                    setTimeout(fulfill, 3);
                                });
                            });
                            fn2 = jasmine.createSpy('fn2()').and.callFake(function() {
                                return new Promise(function(fulfill, reject) {
                                    setTimeout(reject, 2);
                                });
                            });
                            fn3 = jasmine.createSpy('fn3()').and.callFake(function() {
                                return 'foo';
                            });

                            queue.add(fn1);
                            queue.add(fn2);
                            queue.add(fn3);

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
                                expect(fn1).toHaveBeenCalled();
                                expect(fn2).toHaveBeenCalled();
                                expect(fn3).toHaveBeenCalled();
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
                            Runner.schedule('beforeRender', function() {});
                            Runner.schedule('render', function() {});
                            Runner.schedule('afterRender', function() {});
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
            });

            describe('schedule(queue, fn)', function() {
                let fn1;
                let fn2;
                let fn3;

                beforeEach(function() {

                    spyOn(Runner.prototype, 'schedule');
                    spyOn(Runner.prototype, 'flush');

                    fn1 = function() {};
                    fn2 = function() {};
                    fn3 = function() {};

                    Runner.run(function() {
                        Runner.schedule('beforeRender', fn1);
                        Runner.schedule('render', fn2);
                        Runner.schedule('afterRender', fn3);
                    });
                });

                it('should schedule actions on the current runner instance', function() {
                    expect(Runner.prototype.schedule).toHaveBeenCalledWith('beforeRender', fn1);
                    expect(Runner.prototype.schedule).toHaveBeenCalledWith('render', fn2);
                    expect(Runner.prototype.schedule).toHaveBeenCalledWith('afterRender', fn3);
                });

                describe('if there is no open runner', function() {
                    it('should throw an error', function() {
                        expect(function() {
                            Runner.schedule('beforeRender', function() {});
                        }).toThrow(new Error('Cannot schedule task because there is no open runner instance.'));
                    });
                });
            });

            describe('runNext(fn, ...args)', function() {
                let runFn, arg1, arg2;

                beforeEach(function() {
                    runFn = jasmine.createSpy('runFun()').and.callFake(() => Runner.schedule('render', () => {}));

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

                        runFn2 = jasmine.createSpy('runFn2()').and.callFake(() => Runner.schedule('beforeRender', () => {}));

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
            describe('schedule(queue, fn)', function() {
                let fn1;
                let fn2;
                let fn3;
                let fn4;

                beforeEach(function() {
                    fn1 = function() {};
                    fn2 = function() {};
                    fn3 = function() {};
                    fn4 = function() {};

                    runner.schedule('beforeRender', fn2);
                    runner.schedule('render', fn1);
                    runner.schedule('afterRender', fn4);
                    runner.schedule('render', fn3);
                });

                it('should add functions to the queue', function() {
                    expect(beforeRender.add).toHaveBeenCalledWith(fn2);
                    expect(render.add).toHaveBeenCalledWith(fn1);
                    expect(afterRender.add).toHaveBeenCalledWith(fn4);
                    expect(render.add).toHaveBeenCalledWith(fn3);
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
