describe('mock Runner', function() {
    import MockRunner from '../../../../../lib/mocks/Runner.js';
    import Runner from '../../../../../lib/Runner.js';

    it('should be a subclass of the real Runner', function() {
        expect(new MockRunner([])).toEqual(jasmine.any(Runner));
    });

    describe('static', function() {
        describe('methods:', function() {
            describe('run(fn, ...args)', function() {
                let beforeRender1, beforeRender2;
                let render1, render2;
                let afterRender1, afterRender2;

                beforeEach(function() {
                    beforeRender1 = jasmine.createSpy('beforeRender1()');
                    beforeRender2 = jasmine.createSpy('beforeRender2()');

                    render1 = jasmine.createSpy('render1()');
                    render2 = jasmine.createSpy('render2()');

                    afterRender1 = jasmine.createSpy('afterRender1()');
                    afterRender2 = jasmine.createSpy('afterRender2()');

                    MockRunner.run(() => {
                        Runner.schedule('beforeRender', beforeRender1);
                        Runner.schedule('beforeRender', beforeRender2);

                        Runner.schedule('render', render1);
                        Runner.schedule('render', render2);

                        Runner.schedule('afterRender', afterRender1);
                        Runner.schedule('afterRender', afterRender2);
                    });
                });

                it('should flush the queues synchronously', function() {
                    [beforeRender1, beforeRender2, render1, render2, afterRender1, afterRender2].forEach(spy => expect(spy).toHaveBeenCalled());
                });
            });
        });
    });
});
