describe('eventDelegator', function() {
    import eventDelegator from '../../../../lib/event_delegator.js';
    import View from '../../../../lib/core/View.js';
    import Runner from '../../../../lib/Runner.js';

    let listeners;

    beforeEach(function() {
        listeners = {};

        eventDelegator.constructor();

        spyOn(document.body, 'addEventListener').and.callFake(function(event, handler) {
            (listeners[event] || (listeners[event] = [])).push(handler);
        });
    });

    it('should exist', function() {
        expect(eventDelegator).toEqual(jasmine.any(Object));
    });

    describe('properties', function() {
        describe('events', function() {
            it('should be a list of camel-cased event names', function() {
                expect(eventDelegator.events).toEqual([
                    'touchStart',
                    'touchMove',
                    'touchEnd',
                    'touchCancel',
                    'keyDown',
                    'keyUp',
                    'keyPress',
                    'mouseDown',
                    'mouseUp',
                    'contextMenu',
                    'click',
                    'doubleClick',
                    'mouseMove',
                    'mouseEnter',
                    'mouseLeave',
                    'focusIn',
                    'focusOut',
                    'submit',
                    'change',
                    'dragStart',
                    'drag',
                    'dragEnter',
                    'dragLeave',
                    'dragOver',
                    'drop',
                    'dragEnd'
                ]);
            });
        });
    });

    describe('methods', function() {
        describe('addListeners(view, events)', function() {
            let view, element;

            beforeEach(function() {
                element = document.createElement('span');
                document.body.appendChild(element);

                view = new View();
                view.element = element;

                eventDelegator.addListeners(view, ['click', 'mouseMove']);
            });

            afterEach(function() {
                document.body.removeChild(element);
            });

            it('should add event handlers for each event', function() {
                expect(document.body.addEventListener).toHaveBeenCalledWith('click', jasmine.any(Function), false);
                expect(document.body.addEventListener).toHaveBeenCalledWith('mousemove', jasmine.any(Function), false);
            });

            describe('if called again', function() {
                let otherView;

                beforeEach(function() {
                    otherView = new View();
                    otherView.element = document.createElement('div');

                    document.body.addEventListener.calls.reset();

                    eventDelegator.addListeners(otherView, ['click', 'keyPress']);
                });

                it('should not add listeners it has already added', function() {
                    expect(document.body.addEventListener).not.toHaveBeenCalledWith('click', jasmine.any(Function), false);
                    expect(document.body.addEventListener).toHaveBeenCalledWith('keypress', jasmine.any(Function), false);
                });
            });
        });

        describe('removeListeners(view)', function() {
            let view1, view2;

            beforeEach(function() {
                view1 = new View(document.createElement('div'));
                view1.touchMove = jasmine.createSpy('view1.touchMove()');

                view2 = new View(document.createElement('div'));
                view2.touchMove = jasmine.createSpy('view2.touchMove()');

                eventDelegator.addListeners(view1, ['touchMove']);
                eventDelegator.addListeners(view2, ['touchMove']);

                spyOn(document.body, 'removeEventListener');

                eventDelegator.removeListeners(view1);
                expect(document.body.removeEventListener).not.toHaveBeenCalled();
            });

            describe('if called again with the same view', function() {
                it('should throw an error', function() {
                    expect(function() {
                        eventDelegator.removeListeners(view1);
                    }).toThrow();
                });
            });

            describe('when all listeners have been removed', function() {
                beforeEach(function() {
                    eventDelegator.removeListeners(view2);
                });

                it('should remove the global listener', function() {
                    expect(document.body.removeEventListener).toHaveBeenCalledWith('touchmove', listeners.touchmove[0], false);
                });

                describe('if another view starts listening for the event again', function() {
                    beforeEach(function() {
                        document.body.addEventListener.calls.reset();
                        eventDelegator.addListeners(view2, ['touchMove']);
                    });

                    it('should start listening again', function() {
                        expect(document.body.addEventListener).toHaveBeenCalledWith('touchmove', jasmine.any(Function), false);
                    });
                });
            });
        });
    });

    describe('when an event is received', function() {
        let sandbox;
        let wrapper1, wrapper2;
        let child;
        let view1, view2, view3;

        let runFn;

        beforeEach(function() {
            sandbox = document.createElement('div');
            document.body.appendChild(sandbox);

            wrapper1 = document.createElement('div');
            wrapper2 = document.createElement('span');

            child = document.createElement('button');

            view1 = new View(document.createElement('span'));
            view1.create();
            view2 = new View(document.createElement('div'));
            view2.create();
            view3 = new View(document.createElement('nav'));
            view3.create();

            view1.element.appendChild(wrapper1);
            wrapper1.appendChild(view2.element);
            view2.element.appendChild(wrapper2);
            wrapper2.appendChild(view3.element);
            view3.element.appendChild(child);

            sandbox.appendChild(view1.element);

            eventDelegator.addListeners(view1, ['click', 'keyPress']);
            eventDelegator.addListeners(view3, ['click']);
            eventDelegator.addListeners(view2, ['keyPress', 'mouseMove']);

            view1.click = jasmine.createSpy('view1.click()');
            view1.keyPress = jasmine.createSpy('view1.keyPress()');
            view3.click = jasmine.createSpy('view3.click()');
            view2.keyPress = jasmine.createSpy('view2.keyPress()');
            view2.mouseMove = jasmine.createSpy('view2.mouseMove()');

            spyOn(Runner, 'run').and.callFake(function(fn) {
                runFn = fn;
            });
        });

        afterEach(function() {
            document.body.removeChild(sandbox);
        });

        it('should bubble events based on the view hierarchy', function() {
            let event = {
                target: child
            };

            listeners.click[0](event);
            expect(Runner.run).toHaveBeenCalledWith(jasmine.any(Function));
            runFn();
            expect(view3.click).toHaveBeenCalledWith(event);
            expect(view1.click).toHaveBeenCalledWith(event);
            Runner.run.calls.reset();

            listeners.keypress[0](event);
            expect(Runner.run).toHaveBeenCalledWith(jasmine.any(Function));
            runFn();
            expect(view2.keyPress).toHaveBeenCalledWith(event);
            expect(view1.keyPress).toHaveBeenCalledWith(event);
            Runner.run.calls.reset();

            listeners.mousemove[0](event);
            expect(Runner.run).toHaveBeenCalledWith(jasmine.any(Function));
            runFn();
            expect(view2.mouseMove).toHaveBeenCalledWith(event);
            Runner.run.calls.reset();

            event = {
                target: view2.element
            };
            view1.click.calls.reset();
            listeners.click[0](event);
            expect(Runner.run).toHaveBeenCalledWith(jasmine.any(Function));
            runFn();
            expect(view1.click).toHaveBeenCalledWith(event);
        });
    });
});
