describe('animator', function() {
    import animator from '../../../../lib/animator.js';

    beforeEach(function() {
        animator.constructor();
    });

    it('should exist', function() {
        expect(animator).toEqual(jasmine.any(Object));
    });

    describe('methods:', function() {
        describe('remove(event, listener)', function() {
            let listener1, listener2;

            beforeEach(function() {
                listener1 = jasmine.createSpy('listener1()');
                listener2 = jasmine.createSpy('listener2()');

                animator.on('my-event', listener1);
                animator.on('my-event', listener2);

                animator.remove('my-event', listener1);

                animator.trigger('my-event', {});
            });

            it('should not call the removed listener', function() {
                expect(listener2).toHaveBeenCalled();
                expect(listener1).not.toHaveBeenCalled();
            });
        });

        describe('trigger(event, view)', function() {
            let result;
            let listener1, listener2, listener3;
            let view;

            beforeEach(function() {
                view = { id: 'c6-view-1', element: document.createElement('span') };

                listener1 = jasmine.createSpy('listener1()');
                listener2 = jasmine.createSpy('listener2()');
                listener3 = jasmine.createSpy('listener3()');

                animator.on('some-event', listener1);
                animator.on('some-event', listener2);
                animator.on('some-event', listener3);

                result = animator.trigger('some-event', view);
            });

            it('should return a promise', function() {
                expect(result).toEqual(jasmine.any(Promise));
            });

            it('should call every listener with the view and a done function', function() {
                [listener1, listener2, listener3].forEach(listener => expect(listener).toHaveBeenCalledWith(view, jasmine.any(Function)));
            });

            describe('if called with an event with no listeners', function() {
                let success;

                beforeEach(function(done) {
                    success = jasmine.createSpy('success()');

                    animator.trigger('8943urh4', {}).then(success).then(done);
                });

                it('should resolve the promise', function() {
                    expect(success).toHaveBeenCalledWith(undefined);
                });
            });

            describe('when all but one of the done() functions have been called', function() {
                let success;

                beforeEach(function(done) {
                    success = jasmine.createSpy('success()');

                    result.then(success);

                    [listener1, listener2].forEach(listener => listener.calls.mostRecent().args[1]());

                    setTimeout(done, 10);
                });

                it('should not resolve the promise', function() {
                    expect(success).not.toHaveBeenCalled();
                });

                describe('when the final done() function is called', function() {
                    beforeEach(function(done) {
                        result.then(done);

                        listener3.calls.mostRecent().args[1]();
                    });

                    it('should fulfill the promise', function() {
                        expect(success).toHaveBeenCalledWith(undefined);
                    });
                });
            });
        });
    });
});
