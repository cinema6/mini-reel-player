import MockRunner from '../../../../../lib/mocks/Runner.js';
import Runner from '../../../../../.tmp/lib-real/Runner.js';

describe('mock Runner', function() {
    it('should be a subclass of the real Runner', function() {
        expect(new MockRunner([])).toEqual(jasmine.any(Runner));
    });

    describe('static', function() {
        describe('methods:', function() {
            describe('run(fn, ...args)', function() {
                let beforeRender1, beforeRender1Context, beforeRender1Args;
                let beforeRender2, beforeRender2Context, beforeRender2Args;

                let render1, render1Context, render1Args;
                let render2, render2Context, render2Args;
                let afterRender1, afterRender1Context, afterRender1Args;
                let afterRender2, afterRender2Context, afterRender2Args;

                beforeEach(function() {
                    beforeRender1 = jasmine.createSpy('beforeRender1()');
                    beforeRender1Context = { name: 'beforeRender1Context' };
                    beforeRender1Args = ['I', 'am', 'a', 'mock.'];

                    beforeRender2 = jasmine.createSpy('beforeRender2()');
                    beforeRender2Context = {};
                    beforeRender2Context.method = beforeRender2;
                    beforeRender2Args = ['hey'];

                    render1 = jasmine.createSpy('render1()');
                    render1Context = { name: 'render1Context' };
                    render1Args = ['hello', 'world'];

                    render2 = jasmine.createSpy('render2()');
                    render2Context = {};
                    render2Context.myMethod = render2;

                    afterRender1 = jasmine.createSpy('afterRender1()');
                    afterRender1Context = { name: 'afterRender1Context' };
                    afterRender1Args = ['cool', 'beans'];

                    afterRender2 = jasmine.createSpy('afterRender2()');
                    afterRender2Context = {};
                    afterRender2Context.sayHello = afterRender2;

                    MockRunner.run(() => {
                        Runner.schedule('beforeRender', beforeRender1Context, beforeRender1, beforeRender1Args);
                        Runner.schedule('beforeRender', beforeRender2Context, 'method', beforeRender2Args);

                        Runner.schedule('render', render1Context, render1, render1Args);
                        Runner.schedule('render', render2Context, 'myMethod', render2Args);

                        Runner.schedule('afterRender', afterRender1Context, afterRender1, afterRender1Args);
                        Runner.schedule('afterRender', afterRender2Context, 'sayHello', afterRender2Args);
                    });
                });

                it('should flush the queues synchronously', function() {
                    expect(beforeRender1).toHaveBeenCalledWith(...beforeRender1Args);
                    expect(beforeRender1.calls.mostRecent().object).toBe(beforeRender1Context);

                    expect(beforeRender2).toHaveBeenCalledWith(...beforeRender2Args);
                    expect(beforeRender2.calls.mostRecent().object).toBe(beforeRender2Context);

                    expect(render1).toHaveBeenCalledWith(...render1Args);
                    expect(render1.calls.mostRecent().object).toBe(render1Context);

                    expect(render2).toHaveBeenCalledWith();
                    expect(render2.calls.mostRecent().object).toBe(render2Context);

                    expect(afterRender1).toHaveBeenCalledWith(...afterRender1Args);
                    expect(afterRender1.calls.mostRecent().object).toBe(afterRender1Context);

                    expect(afterRender2).toHaveBeenCalledWith();
                    expect(afterRender2.calls.mostRecent().object).toBe(afterRender2Context);
                });

                it('should allow Runner.runNext() to be called', function() {
                    const nextFn = jasmine.createSpy('nextFn()');
                    expect(() => Runner.run(() => Runner.runNext(nextFn))).not.toThrow();
                });

                describe('when Runner.scheduleOnce() is called', function() {
                    let fn1, fn2;
                    let context1, context2;

                    beforeEach(function() {
                        fn1 = jasmine.createSpy('fn1()');
                        context1 = {};

                        fn2 = jasmine.createSpy('fn2()');
                        context2 = {};

                        MockRunner.run(() => {
                            MockRunner.scheduleOnce('render', context1, fn1, ['hello']);
                            MockRunner.schedule('render', context1, fn1, ['always leave a note!']);
                            MockRunner.scheduleOnce('render', context1, fn1, ['greetings']);
                            MockRunner.scheduleOnce('render', context2, fn1, ['coolness']);
                            MockRunner.scheduleOnce('render', context1, fn2, ['HEY!']);
                            MockRunner.scheduleOnce('render', context1, fn2, ['Sup?']);
                            MockRunner.scheduleOnce('render', context2, fn2, ['NEATO!']);
                        });
                    });

                    it('should only call each fn once for each context when scheduled with scheduleOnce()', function() {
                        expect(fn1).toHaveBeenCalledWith('always leave a note!');
                        expect(fn1).toHaveBeenCalledWith('greetings');
                        expect(fn1).toHaveBeenCalledWith('coolness');
                        expect(fn1.calls.all()[0].object).toBe(context1);
                        expect(fn1.calls.all()[1].object).toBe(context1);
                        expect(fn1.calls.all()[2].object).toBe(context2);
                        expect(fn1.calls.count()).toBe(3);

                        expect(fn2).toHaveBeenCalledWith('Sup?');
                        expect(fn2).toHaveBeenCalledWith('NEATO!');
                        expect(fn2.calls.first().object).toBe(context1);
                        expect(fn2.calls.mostRecent().object).toBe(context2);
                        expect(fn2.calls.count()).toBe(2);
                    });
                });
            });
        });
    });
});
