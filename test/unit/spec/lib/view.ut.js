import View from '../../../../lib/core/View.js';
import Mixable from '../../../../lib/core/Mixable.js';
import eventDelegator from '../../../../lib/event_delegator.js';
import {EventEmitter} from 'events';
import Runner from '../../../../lib/Runner.js';

describe('View', function() {
    let view;
    let queues;

    beforeEach(function() {
        view = new View();

        queues = {
            render: []
        };

        spyOn(Runner, 'schedule').and.callFake(function(queue, context, fn, args = []) {
            if (typeof fn === 'string') { fn = context[fn]; }
            const task = (() => fn.call(context, ...args));
            queues[queue].push(task);
        });

        spyOn(Runner, 'scheduleOnce').and.callFake(function(queue, context, fn, args = []) {
            if (typeof fn === 'string') { fn = context[fn]; }
            const task = (() => fn.call(context, ...args));
            queues[queue].push(task);
        });
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(Mixable));
    });

    it('should mixin the EventEmitter', function() {
        expect(View.mixins).toContain(EventEmitter);
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

        describe('inserted', function() {
            it('should be false', function() {
                expect(view.inserted).toBe(false);
            });
        });

        describe('parent', function() {
            it('should be null', function() {
                expect(view.parent).toBeNull();
            });
        });

        describe('target', function() {
            it('should be null', function() {
                expect(view.target).toBeNull();
            });
        });

        describe('action', function() {
            it('should be null', function() {
                expect(view.action).toBeNull();
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

            describe('if the element\'s innerHTML is the same as the template', function() {
                let contents;

                beforeEach(function() {
                    view.element.innerHTML = '<p>Hello!</p>';
                    view.template = '<p>Hello!</p>';

                    contents = view.element.firstChild;
                    view.create();
                });

                it('should not set the element\'s innerHTML', function() {
                    expect(view.element.firstChild).toBe(contents);
                });
            });

            it('should return the element', function() {
                expect(result).toBe(element);
            });

            it('should call didCreateElement()', function() {
                expect(view.didCreateElement).toHaveBeenCalled();
            });

            describe('if the view already has a parent', function() {
                let parentView;

                beforeEach(function() {
                    parentView = new View();
                    view.parent = parentView;

                    view.create();
                });

                describe('when the parentView is destroyed', function() {
                    beforeEach(function() {
                        parentView.emit('destroyed');
                    });

                    it('should set the parent to null', function() {
                        expect(view.parent).toBeNull();
                    });
                });
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
                parentView.inserted = true;

                spyOn(parentView, 'create').and.callThrough();
                spyOn(view, 'create').and.callThrough();
                spyOn(view, 'didInsertElement').and.callThrough();

                view.appendTo(parentView);
            });

            it('should create both elements', function() {
                expect(parentView.create).toHaveBeenCalled();
                expect(view.create).toHaveBeenCalled();
            });

            it('should set the parent to the provided view', function() {
                expect(view.parent).toBe(parentView);
            });

            describe('if the parentView is destroyed', function() {
                beforeEach(function() {
                    parentView.emit('destroyed');
                });

                it('should remove its reference to the parentView', function() {
                    expect(view.parent).toBeNull();
                });
            });

            describe('if the parentView is inserted', function() {
                beforeEach(function() {
                    view.didInsertElement.calls.reset();
                    parentView.emit('inserted');
                });

                it('should call didInsertElement()', function() {
                    expect(view.didInsertElement).toHaveBeenCalled();
                });
            });

            describe('if the view\'s parent is switched', function() {
                let newParent;

                beforeEach(function() {
                    newParent = new View();
                    newParent.tag = 'span';

                    view.appendTo(newParent);
                });

                describe('when the old parent is destroyed', function() {
                    beforeEach(function() {
                        parentView.emit('destroyed');
                    });

                    it('should do nothing', function() {
                        expect(view.parent).toBe(newParent);
                    });
                });

                describe('when the old parent is inserted', function() {
                    beforeEach(function() {
                        view.didInsertElement.calls.reset();

                        parentView.emit('inserted');
                    });

                    it('should do nothing', function() {
                        expect(view.didInsertElement).not.toHaveBeenCalled();
                    });
                });

                describe('when the new parent is destroyed', function() {
                    beforeEach(function() {
                        newParent.emit('destroyed');
                    });

                    it('should remove its reference to the parent', function() {
                        expect(view.parent).toBeNull();
                    });
                });

                describe('when the new parent is inserted', function() {
                    beforeEach(function() {
                        view.didInsertElement.calls.reset();

                        newParent.emit('inserted');
                    });

                    it('should call didInsertElement()', function() {
                        expect(view.didInsertElement).toHaveBeenCalled();
                    });
                });
            });

            describe('if the parent is not inserted', function() {
                beforeEach(function() {
                    parentView.inserted = false;
                    queues.render.pop()();
                });

                it('should not call didInsertElement()', function() {
                    expect(view.didInsertElement).not.toHaveBeenCalled();
                });
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

                describe('if called again', function() {
                    beforeEach(function() {
                        view.didInsertElement.calls.reset();
                        view.appendTo(parentView);
                        queues.render.pop()();
                    });

                    it('should not call didInsertElement() again', function() {
                        expect(view.didInsertElement).not.toHaveBeenCalled();
                    });
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

        describe('insertInto(parent, before)', function() {
            let parentView;
            let sibling;

            beforeEach(function() {
                parentView = new View();
                parentView.tag = 'span';
                parentView.inserted = true;

                sibling = new View();
                sibling.tag = 'span';
                sibling.create();

                spyOn(view, 'create').and.callThrough();
                spyOn(parentView, 'create').and.callThrough();

                view.insertInto(parentView, sibling);
            });

            it('should create the view and the view to insert', function() {
                expect(view.create).toHaveBeenCalled();
                expect(parentView.create).toHaveBeenCalled();
            });

            it('should set the parent to the provided parent', function() {
                expect(view.parent).toBe(parentView);
            });

            describe('if the parentView is destroyed', function() {
                beforeEach(function() {
                    parentView.emit('destroyed');
                });

                it('should remove its reference to the parentView', function() {
                    expect(view.parent).toBeNull();
                });
            });

            describe('if the parentView is inserted', function() {
                beforeEach(function() {
                    spyOn(view, 'didInsertElement');
                    parentView.emit('inserted');
                });

                it('should call didInsertElement()', function() {
                    expect(view.didInsertElement).toHaveBeenCalled();
                });
            });

            describe('if the view\'s parent is switched', function() {
                let newParent;

                beforeEach(function() {
                    newParent = new View();
                    newParent.tag = 'span';
                    spyOn(view, 'didInsertElement');

                    view.appendTo(newParent);
                });

                describe('when the old parent is destroyed', function() {
                    beforeEach(function() {
                        parentView.emit('destroyed');
                    });

                    it('should do nothing', function() {
                        expect(view.parent).toBe(newParent);
                    });
                });

                describe('when the old parent is inserted', function() {
                    beforeEach(function() {
                        view.didInsertElement.calls.reset();

                        parentView.emit('inserted');
                    });

                    it('should do nothing', function() {
                        expect(view.didInsertElement).not.toHaveBeenCalled();
                    });
                });

                describe('when the new parent is destroyed', function() {
                    beforeEach(function() {
                        newParent.emit('destroyed');
                    });

                    it('should remove its reference to the parent', function() {
                        expect(view.parent).toBeNull();
                    });
                });

                describe('when the new parent is inserted', function() {
                    beforeEach(function() {
                        view.didInsertElement.calls.reset();

                        newParent.emit('inserted');
                    });

                    it('should call didInsertElement()', function() {
                        expect(view.didInsertElement).toHaveBeenCalled();
                    });
                });
            });

            describe('if the parent is not inserted', function() {
                beforeEach(function() {
                    parentView.inserted = false;
                    spyOn(view, 'didInsertElement').and.callThrough();
                    spyOn(parentView.element, 'insertBefore');
                    queues.render.pop()();
                });

                it('should not call didInsertElement()', function() {
                    expect(view.didInsertElement).not.toHaveBeenCalled();
                });
            });

            describe('in the render queue', function() {
                beforeEach(function() {
                    spyOn(parentView.element, 'insertBefore');
                    spyOn(view, 'didInsertElement').and.callThrough();

                    queues.render.pop()();
                });

                it('should insert the child before the sibling', function() {
                    expect(parentView.element.insertBefore).toHaveBeenCalledWith(view.element, sibling.element);
                });

                it('should call didInsertElement()', function() {
                    expect(view.didInsertElement).toHaveBeenCalled();
                });

                describe('if called again', function() {
                    beforeEach(function() {
                        view.didInsertElement.calls.reset();
                        view.insertInto(parentView, sibling);
                        queues.render.pop()();
                    });

                    it('should not call didInsertElement()', function() {
                        expect(view.didInsertElement).not.toHaveBeenCalled();
                    });
                });
            });

            describe('if sibling is not provided', function() {
                beforeEach(function() {
                    view.insertInto(parentView);
                });

                describe('in the render queue', function() {
                    beforeEach(function() {
                        spyOn(parentView.element, 'insertBefore');
                        queues.render.pop()();
                    });

                    it('should call with the second parameter as null', function() {
                        expect(parentView.element.insertBefore).toHaveBeenCalledWith(view.element, null);
                    });
                });
            });

            describe('if the views were already created', function() {
                beforeEach(function() {
                    view.create();
                    parentView.create();
                    view.create.calls.reset();
                    parentView.create.calls.reset();

                    view.insertInto(parentView, sibling);
                });

                it('should not create them again', function() {
                    expect(view.create).not.toHaveBeenCalled();
                    expect(parentView.create).not.toHaveBeenCalled();
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

        describe('insert(child, sibling)', function() {
            let child;
            let sibling;

            beforeEach(function() {
                child = new View();
                sibling = new View();

                spyOn(child, 'insertInto');

                view.insert(child, sibling);
            });

            it('should call insertInto() on the child', function() {
                expect(child.insertInto).toHaveBeenCalledWith(view, sibling);
            });
        });

        describe('remove()', function() {
            let parentView, element;

            beforeEach(function() {
                parentView = new View();
                parentView.tag = 'span';
                parentView.inserted = true;

                parentView.append(view);
                queues.render.pop()();

                spyOn(view, 'willRemoveElement').and.callThrough();
                spyOn(parentView.element, 'removeChild').and.callThrough();

                element = view.element;
                view.remove();
            });

            it('should call willRemoveElement()', function() {
                expect(view.willRemoveElement).toHaveBeenCalled();
            });

            describe('in the render queue', function() {
                beforeEach(function() {
                    expect(parentView.element.removeChild).not.toHaveBeenCalled();
                    queues.render.pop()();
                });

                it('should remove the element from the dom', function() {
                    expect(parentView.element.removeChild).toHaveBeenCalledWith(element);
                });
            });

            describe('if called again', function() {
                beforeEach(function() {
                    view.willRemoveElement.calls.reset();

                    view.remove();
                });

                it('should do nothing', function() {
                    expect(view.willRemoveElement).not.toHaveBeenCalled();
                });
            });
        });

        describe('destroy()', function() {
            beforeEach(function() {
                spyOn(view, 'remove');
                spyOn(view, 'willDestroyElement').and.callThrough();
                view.create();

                view.destroy();
            });

            it('should remove() the view', function() {
                expect(view.remove).toHaveBeenCalled();
            });

            it('should call willDestroyElement()', function() {
                expect(view.willDestroyElement).toHaveBeenCalled();
            });

            it('should make the element null', function() {
                expect(view.element).toBeNull();
            });

            describe('if called again', function() {
                beforeEach(function() {
                    view.remove.calls.reset();
                    view.willDestroyElement.calls.reset();

                    view.destroy();
                });

                it('should do nothing', function() {
                    expect(view.remove).not.toHaveBeenCalled();
                    expect(view.willDestroyElement).not.toHaveBeenCalled();
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

                describe('if called multiple times', function() {
                    beforeEach(function() {
                        view.setAttribute('preload', true);
                        queues.render.pop()();

                        spyOn(view.element, 'setAttribute').and.callThrough();
                        spyOn(view.element, 'removeAttribute').and.callThrough();

                        view.setAttribute('data-name', 'Moo');
                        view.setAttribute('data-name', 'Howard');
                        view.setAttribute('data-name', 'Josh');
                        view.setAttribute('preload', false);
                        view.setAttribute('preload', true);
                        view.setAttribute('preload', false);
                        view.setAttribute('preload', false);
                        view.setAttribute('data-age', '21');
                        view.setAttribute('data-age', '22');
                        view.setAttribute('data-age', '23');
                        view.setAttribute('data-age', false);
                        view.setAttribute('data-age', '23');

                        queues.render.pop()();
                    });

                    it('should make the minimal number of changes', function() {
                        expect(view.element.setAttribute.calls.count()).toBe(2);
                        expect(view.element.setAttribute).toHaveBeenCalledWith('data-name', 'Josh');
                        expect(view.element.setAttribute).toHaveBeenCalledWith('data-age', '23');

                        expect(view.element.removeAttribute.calls.count()).toBe(1);
                        expect(view.element.removeAttribute).toHaveBeenCalledWith('preload');
                    });
                });
            });
        });

        describe('sendAction(...args)', function() {
            let action;

            beforeEach(function() {
                action = jasmine.createSpy('action()');
                view.on('action', action);

                view.target = 'controller';
                view.action = 'nextPage';

                view.sendAction('greetings', 'from', 'princeton');
            });

            it('should emit the "action" event', function() {
                expect(action).toHaveBeenCalledWith(view.target, view.action, ['greetings', 'from', 'princeton']);
            });

            describe('if there is no target', function() {
                beforeEach(function() {
                    action.calls.reset();
                    view.target = null;

                    view.sendAction('hello!');
                });

                it('should not emit "action"', function() {
                    expect(action).not.toHaveBeenCalled();
                });
            });

            describe('if there is no action', function() {
                beforeEach(function() {
                    action.calls.reset();
                    view.action = null;

                    view.sendAction('hello!');
                });

                it('should not emit "action"', function() {
                    expect(action).not.toHaveBeenCalled();
                });
            });
        });

        describe('reflow()', function() {
            let element;
            let offsetHeight;

            beforeEach(function() {
                offsetHeight = jasmine.createSpy('offsetHeight()');
                element = {};
                Object.defineProperty(element, 'offsetHeight', { get: offsetHeight });
                view.element = element;

                view.reflow();
            });

            it('should access the element\'s offsetHeight', function() {
                expect(offsetHeight).toHaveBeenCalled();
            });

            describe('if the view has no element', function() {
                beforeEach(function() {
                    view.element = null;
                });

                it('should do nothing', function() {
                    expect(() => view.reflow()).not.toThrow();
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
            let inserted;

            beforeEach(function() {
                inserted = jasmine.createSpy('inserted()').and.callFake(() => expect(view.inserted).toBe(true));
                view.on('inserted', inserted);

                view.didInsertElement();
            });

            it('should set inserted to true', function() {
                expect(view.inserted).toBe(true);
            });

            it('should emit "inserted"', function() {
                expect(inserted).toHaveBeenCalled();
            });
        });

        describe('willDestroyElement()', function() {
            let element;
            let destroyed;

            beforeEach(function() {
                destroyed = jasmine.createSpy('destroyed()');
                view.on('destroyed', destroyed);

                view.tag = 'span';
                view.inserted = true;
                view.create();
                element = view.element;
                spyOn(eventDelegator, 'removeListeners');
                spyOn(view, 'removeAllListeners').and.callThrough();

                view.willDestroyElement();
            });

            it('should remove event listeners', function() {
                expect(eventDelegator.removeListeners).toHaveBeenCalledWith(view);
            });

            it('should remove all of its event listeners', function() {
                expect(view.removeAllListeners).toHaveBeenCalled();
            });

            it('should emit "destroyed"', function() {
                expect(destroyed).toHaveBeenCalled();
            });

            describe('if another view is created with the view\'s old element', function() {
                it('should allow it', function() {
                    expect(function() {
                        new View(element);
                    }).not.toThrow();
                });
            });
        });

        describe('willRemoveElement()', function() {
            let element;
            let removed;

            beforeEach(function() {
                removed = jasmine.createSpy('removed()').and.callFake(() => expect(view.inserted).toBe(false));
                view.on('removed', removed);

                view.tag = 'span';
                view.inserted = true;
                view.create();
                element = view.element;
                spyOn(eventDelegator, 'removeListeners');
                spyOn(view, 'removeAllListeners');

                view.willRemoveElement();
            });

            it('should set inserted to false', function() {
                expect(view.inserted).toBe(false);
            });

            it('should emit "removed"', function() {
                expect(removed).toHaveBeenCalled();
            });
        });
    });
});
