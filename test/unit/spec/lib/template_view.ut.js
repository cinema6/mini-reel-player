import Runner from '../../../../lib/Runner.js';
import View from '../../../../lib/core/View.js';
import TemplateView from '../../../../lib/core/TemplateView.js';
import twobits from 'twobits.js';

describe('TemplateView', function() {
    let view;
    let tbCompileFns;
    let queues;

    beforeEach(function() {
        tbCompileFns = [];
        queues = { render: [] };

        view = new TemplateView();
        view.tag = 'span';

        {
            const {parse} = twobits;

            spyOn(twobits, 'parse').and.callFake(function() {
                const spy = jasmine.createSpy(`compile${tbCompileFns.length}()`).and.callFake(parse.apply(twobits, arguments));
                tbCompileFns.push(spy);
                return spy;
            });
        }

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

    it('should be a view', function() {
        expect(view).toEqual(jasmine.any(View));
    });

    describe('properties:', function() {
        describe('children', function() {
            it('should be an empty array', function() {
                expect(view.children).toEqual([]);
            });
        });

        describe('instantiates', function() {
            it('should be an object', function() {
                expect(view.instantiates).toEqual({});
            });
        });

        describe('data', function() {
            it('should be and empty, frozen Object', function() {
                expect(view.data).toEqual({});
                expect(Object.isFrozen(view.data)).toBe(true);
            });

            it('should not be settable', function() {
                expect(() => view.data = {}).toThrow();
            });
        });
    });

    describe('methods:', function() {
        describe('update(data)', function() {
            let data;

            beforeEach(function() {
                data = {
                    company: 'Cinema6'
                };
                view.template = '<span>Hello!</span><span>World!</span>';

                view.create();

                view.update(data);
                queues.render.pop()();
            });

            it('should compile the template', function() {
                tbCompileFns.forEach(fn => expect(fn).toHaveBeenCalledWith(data));
            });

            it('should update the data property', function() {
                expect(view.data).toEqual(data);
                expect(Object.isFrozen(view.data)).toBe(true);
            });

            describe('if called again', function() {
                beforeEach(function() {
                    view.update({
                        name: 'Josh'
                    });
                    view.update({
                        age: 23
                    });
                    queues.render.shift()();
                    tbCompileFns.forEach(spy => spy.calls.reset());

                    queues.render.shift()();
                });

                it('should extend the data each time', function() {
                    tbCompileFns.forEach(fn => expect(fn).toHaveBeenCalledWith({
                        company: 'Cinema6',
                        name: 'Josh',
                        age: 23
                    }));
                });

                it('should update the data property', function() {
                    expect(view.data).toEqual({
                        company: 'Cinema6',
                        name: 'Josh',
                        age: 23
                    });
                    expect(Object.isFrozen(view.data)).toBe(true);
                });
            });

            describe('if the view was not created yet', function() {
                beforeEach(function() {
                    tbCompileFns = [];
                    view.constructor();
                    view.tag = 'span';

                    spyOn(view, 'create').and.callThrough();

                    view.update(data);
                    queues.render.pop()();
                });

                it('should create and compile the element', function() {
                    expect(view.create).toHaveBeenCalled();
                    tbCompileFns.forEach(fn => expect(fn).toHaveBeenCalledWith(data));
                });
            });
        });
    });

    describe('hooks:', function() {
        describe('didCreateElement()', function() {
            let element;

            class ButtonView extends View {}
            class TextFieldView extends View {}
            class MyTemplateView extends TemplateView {}

            beforeEach(function() {
                element = document.createElement('span');
                view.element = element;

                view.instantiates = {ButtonView, TextFieldView, MyTemplateView};

                element.innerHTML = `
                    <p>Hello {{name}}</p>
                    We now have curlybracey templates!
                    <div>
                        <button data-view="button:ButtonView" data-target="controller" data-action="doControllerStuff">My Button</button>
                        <input data-view="text:TextFieldView" />
                        <div id="custom" data-view="foo:MyTemplateView" data-target="view" data-action="doSomething"></div>
                    </div>
                `;

                spyOn(ButtonView.prototype, 'create').and.callThrough();
                spyOn(TextFieldView.prototype, 'create').and.callThrough();
                spyOn(MyTemplateView.prototype, 'create').and.callThrough();

                view.didCreateElement();
            });

            it('should parse the element with TwoBits.js', function() {
                Array.prototype.slice.call(element.childNodes).forEach(child => expect(twobits.parse).toHaveBeenCalledWith(child, jasmine.any(Object)));
            });

            it('should not cause update()s to throw errors', function() {
                expect(function() {
                    view.foo.update({});
                    queues.render.pop()();
                }).not.toThrow();
            });

            describe('if the template contains a <use></use> element', function() {
                let element;

                beforeEach(function() {
                    view = new TemplateView();
                    view.tag = 'span';
                    view.template = `
                        <use xlink:href="#{{type}}"></use>'
                    `;

                    view.create();
                    element = view.element.querySelector('use');
                });

                it('should give the attribute an absolute URL', function() {
                    expect(element.getAttribute('xlink:href')).toBe(window.location.href + '#{{type}}');
                });

                describe('when update is called', function() {
                    beforeEach(function() {
                        view.update({ type: 'hello' });
                        queues.render.pop()();
                    });

                    it('should keep the URL as absolute', function() {
                        expect(element.getAttribute('xlink:href')).toBe(window.location.href + '#hello');
                    });
                });

                describe('without an xlink:href', function() {
                    beforeEach(function() {
                        view = new TemplateView();
                        view.tag = 'span';
                        view.template = `
                            <use></use>'
                        `;

                        view.create();
                        element = view.element.querySelector('use');
                    });

                    it('should not give it an xlink:href', function() {
                        expect(element.getAttribute('xlink:href')).toBeNull();
                    });
                });

                describe('with an absolute xlink:href', function() {
                    beforeEach(function() {
                        view = new TemplateView();
                        view.tag = 'span';
                        view.template = `
                            <use xlink:href="foo#{{type}}"></use>'
                        `;

                        view.create();
                        element = view.element.querySelector('use');
                    });

                    it('should not change the value', function() {
                        expect(element.getAttribute('xlink:href')).toBe('foo#{{type}}');
                    });
                });
            });

            describe('if the template contains a data-attributes="" directive', function() {
                let element;

                beforeEach(function() {
                    view = new TemplateView();
                    view.tag = 'span';
                    view.template = `
                        <button data-attributes="type:button.type disabled:button.disabled"></button>
                    `;

                    view.create();
                    element = view.element.querySelector('button');
                });

                describe('when update is called', function() {
                    beforeEach(function() {
                        view.update({
                            button: {
                                type: 'button',
                                disabled: true
                            }
                        });
                        queues.render.pop()();
                    });

                    it('should set the non-boolean values to the associated attribute', function() {
                        expect(element.getAttribute('type')).toBe('button');
                    });

                    it('should add attributes if a boolean value is true', function() {
                        expect(element.getAttribute('disabled')).toBe('');
                    });

                    describe('when update is called again', function() {
                        beforeEach(function() {
                            view.update({
                                button: {
                                    type: 'link',
                                    disabled: false
                                }
                            });
                            queues.render.pop()();
                        });

                        it('should change the non-boolean values', function() {
                            expect(element.getAttribute('type')).toBe('link');
                        });

                        it('should remove attributes if a boolean value is false', function() {
                            expect(element.getAttribute('disabled')).toBe(null);
                        });

                        describe('with the same values', function() {
                            beforeEach(function() {
                                spyOn(element, 'setAttribute').and.callThrough();
                                spyOn(element, 'removeAttribute').and.callThrough();

                                view.update({
                                    button: {
                                        type: 'link',
                                        disabled: false
                                    }
                                });
                                queues.render.pop()();
                            });

                            it('should not modify the element', function() {
                                expect(element.setAttribute).not.toHaveBeenCalled();
                                expect(element.removeAttribute).not.toHaveBeenCalled();
                            });
                        });
                    });
                });
            });

            describe('if the template contains a data-class="" directive', function() {
                let element;

                beforeEach(function() {
                    view = new TemplateView();
                    view.tag = 'span';
                    view.template = `
                        <p class="hello foo" data-class="button.type button.size"></p>';
                    `;

                    view.create();
                    element = view.element.querySelector('p');
                });

                it('should not change the element\'s classes', function() {
                    expect(element.className).toEqual('hello foo');
                });

                describe('when update is called', function() {
                    beforeEach(function() {
                        view.update({
                            button: {
                                type: 'success',
                                size: 'small'
                            }
                        });
                        queues.render.pop()();
                    });

                    it('should modify the element\'s classes', function() {
                        expect(element.className).toEqual('hello foo success small');
                    });

                    describe('when called again', function() {
                        beforeEach(function() {
                            view.update({
                                button: {
                                    type: 'success',
                                    size: 'large'
                                }
                            });
                            queues.render.pop()();
                        });

                        it('should update the classes', function() {
                            expect(element.className).toEqual('hello foo success large');
                        });
                    });
                });

                describe('if binding to boolean values', function() {
                    describe('if just a truthy class is specified', function() {
                        beforeEach(function() {
                            view = new TemplateView();
                            view.tag = 'span';
                            view.template = `
                                <button data-class="state.valid:btn--valid state.active:btn--active">Hey!</button>
                            `;

                            view.create();
                            element = view.element.querySelector('button');
                        });

                        describe('when truthy', function() {
                            beforeEach(function() {
                                view.update({
                                    state: {
                                        valid: {},
                                        active: true
                                    }
                                });
                                queues.render.pop()();
                            });

                            it('should add the specified class', function() {
                                expect(element.className).toBe('btn--valid btn--active');
                            });
                        });

                        describe('when falsy', function() {
                            beforeEach(function() {
                                view.update({
                                    state: {
                                        valid: true,
                                        active: true
                                    }
                                });
                                queues.render.pop()();

                                view.update({
                                    state: {
                                        valid: null,
                                        active: true
                                    }
                                });
                                queues.render.pop()();
                            });

                            it('should remove the class', function() {
                                expect(element.className).toBe('btn--active');
                            });
                        });
                    });

                    describe('if a truthy and falsy class are specified', function() {
                        beforeEach(function() {
                            view = new TemplateView();
                            view.tag = 'span';
                            view.template = `
                                <button data-class="state.valid:btn--valid:btn--invalid state.active:btn--active:btn--inactive">Hey!</button>
                            `;

                            view.create();
                            element = view.element.querySelector('button');
                        });

                        it('should add the truthy or falsy class depending on the supplied value', function() {
                            view.update({ state: { valid: 'hey', active: false } });
                            queues.render.pop()();
                            expect(element.className).toEqual('btn--valid btn--inactive');

                            view.update({ state: { valid: '', active: true } });
                            queues.render.pop()();
                            expect(element.className).toEqual('btn--invalid btn--active');
                        });
                    });

                    describe('if just a falsy class is specified', function() {
                        beforeEach(function() {
                            view = new TemplateView();
                            view.tag = 'span';
                            view.template = `
                                <button data-class="state.valid::btn--invalid state.active::btn--inactive">Hey!</button>
                            `;

                            view.create();
                            element = view.element.querySelector('button');
                        });

                        it('should add the falsy class if the value is falsy', function() {
                            view.update({ state: { valid: 'hey', active: false } });
                            queues.render.pop()();
                            expect(element.className).toEqual('btn--inactive');

                            view.update({ state: { valid: '', active: true } });
                            queues.render.pop()();
                            expect(element.className).toEqual('btn--invalid');
                        });
                    });
                });
            });

            describe('if template contains a data-if="" directive', function() {
                beforeEach(function() {
                    view = new TemplateView();
                    view.tag = 'span';
                    view.template = `
                        <div>I am a normal div</div>
                        <div data-if="foo.bar"></div>
                        <div>I am also normal.</div>
                    `;

                    view.create();
                });

                it('should add a placeholder comment above the element with the directive', function() {
                    const comment = view.element.querySelector('[data-if]').previousSibling;

                    expect(comment).toEqual(jasmine.any(window.Comment));
                    expect(comment.nodeValue).toBe(' data-if="foo.bar" ');
                });

                describe('when update() is called', function() {
                    describe('if the specified value is falsy', function() {
                        beforeEach(function() {
                            view.update({
                                foo: {
                                    bar: false
                                }
                            });
                            queues.render.pop()();
                        });

                        it('should remove the element from the DOM', function() {
                            expect(view.element.querySelector('[data-if]')).not.toEqual(jasmine.any(Element));
                        });

                        describe('if the element has already been removed', function() {
                            beforeEach(function() {
                                spyOn(view.element, 'removeChild').and.callThrough();

                                view.update({
                                    foo: {
                                        bar: false
                                    }
                                });
                                queues.render.pop()();
                            });

                            it('should not remove the element again', function() {
                                expect(view.element.removeChild).not.toHaveBeenCalled();
                            });
                        });
                    });

                    describe('if the specified value is truthy', function() {
                        let element, comment;

                        beforeEach(function() {
                            element = view.element.querySelector('[data-if]');
                            comment = element.previousSibling;
                            view.element.removeChild(element);

                            view.update({
                                foo: {
                                    bar: true
                                }
                            });
                            queues.render.pop()();
                        });

                        it('should add the element to the DOM', function() {
                            expect(element.previousSibling).toBe(comment);
                        });

                        describe('if the element has already been added', function() {
                            beforeEach(function() {
                                spyOn(view.element, 'insertBefore').and.callThrough();
                                spyOn(view.element, 'removeChild').and.callThrough();

                                view.update({
                                    foo: {
                                        bar: true
                                    }
                                });
                                queues.render.pop()();
                            });

                            it('should not replace the element', function() {
                                expect(view.element.insertBefore).not.toHaveBeenCalled();
                                expect(view.element.removeChild).not.toHaveBeenCalled();
                            });
                        });
                    });
                });
            });

            describe('if the template contains a data-unless directive', function() {
                beforeEach(function() {
                    view = new TemplateView();
                    view.tag = 'span';
                    view.template = `
                        <div>Foo</div>
                        <div data-unless="person.name"></div>
                        <div>Bar</div>
                    `;

                    view.create();
                });

                it('should add a placeholder comment above the element with the directive', function() {
                    const comment = view.element.querySelector('[data-unless]').previousSibling;

                    expect(comment).toEqual(jasmine.any(window.Comment));
                    expect(comment.nodeValue).toBe(' data-unless="person.name" ');
                });

                describe('when update() is called', function() {
                    describe('if the specified value is truthy', function() {
                        beforeEach(function() {
                            view.update({
                                person: {
                                    name: 'Josh'
                                }
                            });
                            queues.render.pop()();
                        });

                        it('should remove the element from the DOM', function() {
                            expect(view.element.querySelector('[data-unless]')).not.toEqual(jasmine.any(Element));
                        });

                        describe('if the element has already been removed', function() {
                            beforeEach(function() {
                                spyOn(view.element, 'removeChild').and.callThrough();

                                view.update({
                                    person: {
                                        name: 'Josh'
                                    }
                                });
                                queues.render.pop()();
                            });

                            it('should not remove the element again', function() {
                                expect(view.element.removeChild).not.toHaveBeenCalled();
                            });
                        });
                    });

                    describe('if the specified value is falsy', function() {
                        let element, comment;

                        beforeEach(function() {
                            element = view.element.querySelector('[data-unless]');
                            comment = element.previousSibling;
                            view.element.removeChild(element);

                            view.update({
                                person: {
                                    name: null
                                }
                            });
                            queues.render.pop()();
                        });

                        it('should add the element to the DOM', function() {
                            expect(element.previousSibling).toBe(comment);
                        });

                        describe('if the element has already been added', function() {
                            beforeEach(function() {
                                spyOn(view.element, 'insertBefore').and.callThrough();
                                spyOn(view.element, 'removeChild').and.callThrough();

                                view.update({
                                    person: {
                                        name: null
                                    }
                                });
                                queues.render.pop()();
                            });

                            it('should not replace the element', function() {
                                expect(view.element.insertBefore).not.toHaveBeenCalled();
                                expect(view.element.removeChild).not.toHaveBeenCalled();
                            });
                        });
                    });
                });
            });

            describe('if there are child template views', function() {
                class MyTemplateView extends TemplateView {}
                class ButtonView extends View {}

                beforeEach(function() {
                    view = new TemplateView();
                    view.tag = 'span';
                    view.instantiates = {MyTemplateView, ButtonView};
                    view.template = `
                        <span>My name is {{first}} {{last}}.</span>
                        <span data-name="{{first}} {{last}}" data-view="child:MyTemplateView">
                            My name is {{first}} {{last}}.
                        </span>
                        <div>
                            <button data-view="button:ButtonView">{{last}}</button>
                        </div>
                    `;

                    view.update({ first: 'Josh', last: 'Minzner' });
                    view.child.update({ first: 'Evan', last: 'Leichter' });
                    queues.render.pop()();
                    queues.render.pop()();
                });

                it('should not update the templates of any child TemplateViews', function() {
                    expect(view.child.element.innerText.trim()).toBe('My name is Evan Leichter.');
                });

                it('should update its template', function() {
                    expect(view.element.querySelectorAll('span')[0].innerText.trim()).toBe('My name is Josh Minzner.');
                    expect(view.element.querySelectorAll('span')[1].getAttribute('data-name')).toBe('Josh Minzner');
                    expect(view.element.querySelector('button').innerText.trim()).toBe('Minzner');
                });
            });

            describe('if a child view has a data-model=""', function() {
                let data;

                beforeEach(function() {
                    view = new TemplateView();
                    view.tag = 'span';
                    view.template = `
                        <span data-view="child:TemplateView" data-model="bar">{{foo}}</span>
                    `;
                    view.instantiates = {TemplateView};

                    data = {
                        bar: {
                            foo: 'bar'
                        }
                    };

                    view.create();
                    spyOn(view.child, 'update').and.callThrough();

                    view.update(data);
                    queues.render.pop()();
                });

                it('should update() the child with the specified value', function() {
                    expect(view.child.update).toHaveBeenCalledWith(data.bar);
                });

                describe('and a data-update-method=""', function() {
                    class MyTemplateView extends TemplateView {
                        updateWith() {}
                    }

                    beforeEach(function() {
                        view = new TemplateView();
                        view.tag = 'span';
                        view.template = `
                            <span data-view="child:MyTemplateView" data-model="bar" data-update-method="updateWith">{{foo}}</span>
                        `;
                        view.instantiates = {MyTemplateView};

                        data = {
                            bar: {
                                foo: 'bar'
                            }
                        };

                        view.create();
                        spyOn(view.child, 'updateWith').and.callThrough();

                        view.update(data);
                        queues.render.pop()();
                    });

                    it('should call the method specified in data-update-method', function() {
                        expect(view.child.updateWith).toHaveBeenCalledWith(data.bar);
                    });
                });
            });

            it('should create the child views declared in the templates', function() {
                const [button, text, custom] = view.children;

                expect(button).toEqual(jasmine.any(ButtonView));
                expect(button.element).toBe(element.querySelector('button'));
                expect(button.create).toHaveBeenCalled();
                expect(button.target).toBe('controller');
                expect(button.action).toBe('doControllerStuff');
                expect(button.parent).toBe(view);

                expect(text).toEqual(jasmine.any(TextFieldView));
                expect(text.element).toBe(element.querySelector('input'));
                expect(text.create).toHaveBeenCalled();
                expect(text.target).toBeNull();
                expect(text.action).toBeNull();
                expect(text.parent).toBe(view);

                expect(custom).toEqual(jasmine.any(MyTemplateView));
                expect(custom.element).toBe(element.querySelector('#custom'));
                expect(custom.create).toHaveBeenCalled();
                expect(custom.target).toBe('view');
                expect(custom.action).toBe('doSomething');
                expect(custom.parent).toBe(view);

                expect(view.button).toBe(button);
                expect(view.text).toBe(text);
                expect(view.foo).toBe(custom);
            });

            describe('when a child emits the "action" event', function() {
                let child;

                describe('if its target is "view"', function() {
                    beforeEach(function() {
                        child = view.foo;
                    });

                    describe('if the TemplateView implements a method with the name of the action', function() {
                        beforeEach(function() {
                            view.doSomething = jasmine.createSpy('view.doSomething()');

                            child.emit('action', child.target, child.action, ['how', 'are', 'you?']);
                        });

                        it('should call the TemplateView\'s method', function() {
                            expect(view.doSomething).toHaveBeenCalledWith('how', 'are', 'you?');
                        });
                    });

                    describe('if the TemplateView does not implement a method with the name of the action', function() {
                        beforeEach(function() {
                            view.doSomething = 42;
                        });

                        it('should throw an error', function() {
                            expect(function() {
                                child.emit('action', child.target, child.action, ['how', 'are', 'you?']);
                            }).toThrow(new TypeError(`TemplateView [${view.id}] tried to respond to action [${child.action}] from View [${child.id}] but it does not implement ${child.action}().`));
                        });
                    });
                });

                describe('if its target is "controller"', function() {
                    let action;

                    beforeEach(function() {
                        action = jasmine.createSpy('action()');
                        view.on('action', action);

                        child = view.button;

                        child.emit('action', child.target, child.action, ['how', 'is', 'life?']);
                    });

                    it('should emit the action event on the TemplateView', function() {
                        expect(action).toHaveBeenCalledWith(child.target, child.action, ['how', 'is', 'life?']);
                    });
                });
            });

            describe('if a child has an unknow constructor', function() {
                beforeEach(function() {
                    view = new TemplateView();
                    view.tag = 'span';
                    view.template = `
                        <p><div data-view="foo:FooView">BAD</div></p>
                    `;
                });

                it('should throw an error', function() {
                    expect(function() {
                        view.create();
                    }).toThrow(new Error('Unknown class (FooView). Make sure your class is in the \'instantiates\' object.'));
                });
            });
        });

        describe('didInsertElement()', function() {
            let element;

            beforeEach(function() {
                element = document.createElement('div');
                view.element = element;

                view.children = [new View(), new View()];
                view.children.forEach(view => spyOn(view, 'didInsertElement').and.callThrough());

                view.didInsertElement();
            });

            it('should call didInsertElement() on its children', function() {
                view.children.forEach(view => expect(view.didInsertElement).toHaveBeenCalled());
            });
        });
    });
});
