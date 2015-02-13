describe('View', function() {
    import View from '../../../../lib/core/View.js';
    import eventDelegator from '../../../../lib/event_delegator.js';
    import {EventEmitter} from 'events';
    import Runner from '../../../../lib/Runner.js';
    let view;
    let queues;

    beforeEach(function() {
        view = new View();

        queues = {
            render: []
        };

        spyOn(Runner, 'schedule').and.callFake(function(queue, task) {
            queues[queue].push(task);
        });
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(EventEmitter));
    });

    describe('if constructed with another view\'s element', function() {
        beforeEach(function() {
            view.tag = 'div';
            view.create();
        });

        it('should throw an error', function() {
            expect(function() {
                new View(view.element);
            }).toThrow(new Error(`Cannot create View because the provided element already belongs to [View:${view.id}].`));
        });
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be an empty string', function() {
                expect(view.template).toBe('');
            });

            describe('if called with an element', function() {
                let element;

                beforeEach(function() {
                    element = document.createElement('span');
                    element.innerHTML = '<p>I am a template.</p>';

                    view = new View(element);
                });

                it('should be the element\'s innerHTML', function() {
                    expect(view.template).toBe(element.innerHTML);
                });
            });
        });

        describe('element', function() {
            it('should be null', function() {
                expect(view.element).toBeNull();
            });

            describe('if called with an element', function() {
                let element;

                beforeEach(function() {
                    element = document.createElement('span');

                    view = new View(element);
                });

                it('should be the element', function() {
                    expect(view.element).toBe(element);
                });
            });
        });

        describe('tag', function() {
            it('should be undefined', function() {
                expect(view.tag).toBeUndefined();
            });

            describe('if called with an element', function() {
                let element;

                beforeEach(function() {
                    element = document.createElement('button');

                    view = new View(element);
                });

                it('should be the lowercase name of the element\'s tag', function() {
                    expect(view.tag).toBe('button');
                });
            });
        });

        describe('id', function() {
            it('should be "c6-view-number"', function() {
                expect(view.id).toMatch(/c6-view-(\d+)/);
            });

            it('should increment with each view', function() {
                const num = parseInt((new View()).id.match(/\d+$/)[0], 10);
                const newNum = parseInt((new View()).id.match(/\d+$/)[0], 10);

                expect(newNum).toBeGreaterThan(num);
            });

            describe('if called with an element', function() {
                let element;

                beforeEach(function() {
                    element = document.createElement('span');
                });

                describe('if the element has an id', function() {
                    beforeEach(function() {
                        element.id = 'the-id';

                        view = new View(element);
                    });

                    it('should be the id of the element', function() {
                        expect(view.id).toBe('the-id');
                    });
                });

                describe('if the element has no id', function() {
                    beforeEach(function() {
                        view = new View(element);
                    });

                    it('should be the auto-created id', function() {
                        expect(view.id).toMatch(/c6-view-\d+/);
                    });
                });
            });
        });

        describe('classes', function() {
            it('should be an array with "c6-view"', function() {
                expect(view.classes).toEqual(['c6-view']);
            });

            describe('if called with an element', function() {
                let element;

                beforeEach(function() {
                    element = document.createElement('span');
                });

                describe('if the element has classes', function() {
                    beforeEach(function() {
                        element.className = 'foo bar test';

                        view = new View(element);
                    });

                    it('should make the array include the element\'s classes', function() {
                        expect(view.classes).toEqual(['foo', 'bar', 'test', 'c6-view']);
                    });
                });

                describe('if the element has no classes', function() {
                    beforeEach(function() {
                        view = new View(element);
                    });

                    it('should only include the default class', function() {
                        expect(view.classes).toEqual(['c6-view']);
                    });
                });
            });
        });

        describe('attributes', function() {
            it('should be an object', function() {
                expect(view.attributes).toEqual({});
            });

            describe('if called with an element', function() {
                let element;

                beforeEach(function() {
                    element = document.createElement('span');

                    element.setAttribute('data-foo', 'bar');
                    element.setAttribute('style', 'left: 50px;');

                    view = new View(element);
                });

                it('should be populated with the element\'s attributes', function() {
                    expect(view.attributes).toEqual({
                        'data-foo': 'bar',
                        style: 'left: 50px;'
                    });
                });
            });
        });
    });

    describe('methods:', function() {
        beforeEach(function() {
            view.tag = 'span';
        });

        describe('create()', function() {
            let result, element;

            beforeEach(function() {
                spyOn(view, 'didCreateElement');

                view.classes.push('my-class', 'foo-class');
                view.attributes = {
                    style: 'left: 20px;',
                    'data-foo': 'bar',
                    disabled: true
                };
                view.template = '<p>I am a great view.</p>';
                view.tag = 'button';

                result = view.create();
                element = view.element;
            });

            describe('if no tag is specified', function() {
                beforeEach(function() {
                    view.constructor();
                });

                it('should throw an error', function() {
                    expect(function() {
                        view.create();
                    }).toThrow(new Error(`Cannot create element for [View:${view.id}] because 'tag' is undefined.`));
                });
            });

            it('should create an element of the specified tag', function() {
                expect(element.tagName).toBe('BUTTON');
            });

            it('should give the element the specified id', function() {
                expect(element.id).toBe(view.id);
            });

            it('should give the element the specified classes', function() {
                expect(element.className).toBe('c6-view my-class foo-class');
            });

            it('should give the element the specified attributes', function() {
                expect(element.getAttribute('style')).toBe('left: 20px;');
                expect(element.getAttribute('data-foo')).toBe('bar');
                expect(element.getAttribute('disabled')).toBe('');
            });

            it('should innerHTML the template', function() {
                expect(element.innerHTML).toBe(view.template);
            });

            it('should return the element', function() {
                expect(result).toBe(element);
            });

            it('should call didCreateElement()', function() {
                expect(view.didCreateElement).toHaveBeenCalled();
            });

            describe('if called again', function() {
                let element;

                beforeEach(function() {
                    element = view.element;

                    view.create();
                });

                it('should not create a new element', function() {
                    expect(view.element).toBe(element);
                });

                describe('if the element is not in the DOM', function() {
                    beforeEach(function() {
                        spyOn(view, 'didInsertElement');
                        view.create();
                    });

                    it('should not call didInsertElement()', function() {
                        expect(view.didInsertElement).not.toHaveBeenCalled();
                    });
                });

                describe('if the element is in the DOM', function() {
                    beforeEach(function() {
                        document.body.appendChild(view.element);

                        spyOn(view, 'didInsertElement');
                        view.create();
                    });

                    afterEach(function() {
                        document.body.appendChild(view.element);
                    });

                    it('should call didInsertElement()', function() {
                        expect(view.didInsertElement).toHaveBeenCalled();
                    });
                });
            });
        });

        describe('appendTo(view)', function() {
            let parentView;

            beforeEach(function() {
                parentView = new View();
                parentView.tag = 'span';

                spyOn(parentView, 'create').and.callThrough();
                spyOn(view, 'create').and.callThrough();
                spyOn(view, 'didInsertElement');

                view.appendTo(parentView);
            });

            it('should create both elements', function() {
                expect(parentView.create).toHaveBeenCalled();
                expect(view.create).toHaveBeenCalled();
            });

            describe('in the render queue', function() {
                beforeEach(function() {
                    queues.render.pop()();
                });

                it('should append its element to the parent\'s element', function() {
                    expect(parentView.element.firstChild).toBe(view.element);
                });

                it('should call didInsertElement()', function() {
                    expect(view.didInsertElement).toHaveBeenCalled();
                });
            });

            describe('if the elements have been created', function() {
                beforeEach(function() {
                    view = new View();
                    view.tag = 'span';
                    view.create();

                    parentView.create.calls.reset();
                    spyOn(view, 'create').and.callThrough();

                    view.appendTo(parentView);
                });

                it('should not create new elements', function() {
                    expect(view.create).not.toHaveBeenCalled();
                    expect(parentView.create).not.toHaveBeenCalled();
                });

                it('should append its element to the parent\'s element', function() {
                    queues.render.pop()();
                    expect(parentView.element.firstChild).toBe(view.element);
                });
            });
        });

        describe('append(view)', function() {
            let child;

            beforeEach(function() {
                child = new View();

                spyOn(child, 'appendTo');

                view.append(child);
            });

            it('should append the child to itself', function() {
                expect(child.appendTo).toHaveBeenCalledWith(view);
            });
        });

        describe('remove()', function() {
            let parentView, element;

            beforeEach(function() {
                parentView = new View();
                parentView.tag = 'span';

                parentView.append(view);
                queues.render.pop()();

                spyOn(view, 'willRemoveElement');

                element = view.element;
                view.remove();
            });

            it('should call willRemoveElement()', function() {
                expect(view.willRemoveElement).toHaveBeenCalled();
            });

            it('should set its element to null', function() {
                expect(view.element).toBeNull();
            });

            describe('in the render queue', function() {
                beforeEach(function() {
                    spyOn(parentView.element, 'removeChild').and.callThrough();
                    queues.render.pop()();
                });

                it('should remove the element from the dom', function() {
                    expect(parentView.element.removeChild).toHaveBeenCalledWith(element);
                });
            });
        });

        describe('addClass(className)', function() {
            describe('before the element is created', function() {
                beforeEach(function() {
                    Runner.run(() => view.addClass('new-class'));
                });

                it('should add the class to the classes array', function() {
                    expect(view.classes).toEqual(['c6-view', 'new-class']);
                });
            });

            describe('if called with a class that is already added', function() {
                beforeEach(function() {
                    Runner.run(() => view.addClass('c6-view'));
                });

                it('should not add the same class again', function() {
                    expect(view.classes).toEqual(['c6-view']);
                });
            });

            describe('after the element is created', function() {
                beforeEach(function() {
                    view.create();

                    Runner.run(() => view.addClass('a-class'));
                    queues.render.pop()();
                });

                it('should add the class to the classes array', function() {
                    expect(view.classes).toEqual(['c6-view', 'a-class']);
                });

                it('should mutate the className of the element', function() {
                    expect(view.element.className).toBe('c6-view a-class');
                });
            });
        });

        describe('removeClass(className)', function() {
            describe('before the element is created', function() {
                beforeEach(function() {
                    view.classes.push('some-class', 'cool-class');

                    Runner.run(() => view.removeClass('some-class'));
                });

                it('should remove the class from the classes array', function() {
                    expect(view.classes).toEqual(['c6-view', 'cool-class']);
                });

                describe('if called with a class that doesn\'t exist', function() {
                    beforeEach(function() {
                        Runner.run(() => view.removeClass('foo-class'));
                    });

                    it('should do nothing', function() {
                        expect(view.classes).toEqual(['c6-view', 'cool-class']);
                    });
                });
            });

            describe('after the element is created', function() {
                beforeEach(function() {
                    view.classes.push('some-class', 'cool-class');
                    view.create();

                    Runner.run(() => view.removeClass('some-class'));
                    queues.render.pop()();
                });

                it('should remove the class from the classes array', function() {
                    expect(view.classes).toEqual(['c6-view', 'cool-class']);
                });

                it('should mutate the className of the element', function() {
                    expect(view.element.className).toBe('c6-view cool-class');
                });
            });
        });

        describe('setAttribute(attribute, value)', function() {
            describe('before the element is created', function() {
                beforeEach(function() {
                    Runner.run(() => view.setAttribute('data-test-thing', 'hello-world'));
                });

                it('should set the value on the attributes object', function() {
                    expect(view.attributes['data-test-thing']).toBe('hello-world');
                });
            });

            describe('after the element is created', function() {
                beforeEach(function() {
                    view.create();

                    Runner.run(() => view.setAttribute('data-name', 'Josh'));
                    queues.render.pop()();
                });

                it('should set the value on the attributes object', function() {
                    expect(view.attributes['data-name']).toBe('Josh');
                });

                it('should mutate the attribute on the element', function() {
                    expect(view.element.getAttribute('data-name')).toBe('Josh');
                });

                describe('if set to an existing value', function() {
                    beforeEach(function() {
                        spyOn(view.element, 'setAttribute').and.callThrough();
                        Runner.schedule.calls.reset();
                        view.setAttribute('data-name', 'Josh');
                    });

                    it('should not call setAttribute() on the element', function() {
                        expect(Runner.schedule).not.toHaveBeenCalled();
                        expect(view.element.setAttribute).not.toHaveBeenCalled();
                    });
                });

                describe('if set to false', function() {
                    beforeEach(function() {
                        view.setAttribute('data-name', false);
                        queues.render.pop()();
                    });

                    it('should remove the attribute', function() {
                        expect(view.element.getAttribute('data-name')).toBeNull();
                    });
                });

                describe('if set to true', function() {
                    beforeEach(function() {
                        view.setAttribute('data-name', true);
                        queues.render.pop()();
                    });

                    it('should add the attribute with no value', function() {
                        expect(view.element.getAttribute('data-name')).toBe('');
                    });
                });
            });
        });
    });

    describe('hooks:', function() {
        describe('didCreateElement()', function() {
            beforeEach(function() {
                spyOn(eventDelegator, 'addListeners');

                view.element = document.createElement('span');
                view.click = function() {};
                view.mouseMove = function() {};

                view.didCreateElement();
            });

            it('should add a listener for every event handler that has been overridden', function() {
                expect(eventDelegator.addListeners).toHaveBeenCalledWith(view, ['click', 'mouseMove']);
            });
        });

        describe('didInsertElement()', function() {
            it('should exist', function() {
                expect(view.didInsertElement).toEqual(jasmine.any(Function));
            });
        });

        describe('willRemoveElement()', function() {
            let element;

            beforeEach(function() {
                view.tag = 'span';
                view.create();
                element = view.element;
                spyOn(eventDelegator, 'removeListeners');

                view.willRemoveElement();
            });

            it('should remove event listeners', function() {
                expect(eventDelegator.removeListeners).toHaveBeenCalledWith(view);
            });

            describe('if another view is created with the view\'s old element', function() {
                it('should allow it', function() {
                    expect(function() {
                        new View(element);
                    }).not.toThrow();
                });
            });
        });
    });
});
