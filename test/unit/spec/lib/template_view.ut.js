describe('TemplateView', function() {
    import Runner from '../../../../lib/Runner.js';
    import View from '../../../../lib/core/View.js';
    import TemplateView from '../../../../lib/core/TemplateView.js';
    import twobits from 'twobits.js';

    let view;
    let tbCompileFn;
    let queues;

    beforeEach(function() {
        queues = { render: [] };

        view = new TemplateView();
        view.tag = 'span';

        {
            const {parse} = twobits;

            spyOn(twobits, 'parse').and.callFake(function() {
                return (tbCompileFn = jasmine.createSpy('compile()').and.callFake(parse.apply(twobits, arguments)));
            });
        }

        spyOn(Runner, 'schedule').and.callFake(function(queue, task) {
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
    });

    describe('methods:', function() {
        describe('update(data)', function() {
            let data;

            beforeEach(function() {
                data = {
                    company: 'Cinema6'
                };

                view.create();

                view.update(data);
                queues.render.pop()();
            });

            it('should compile the template', function() {
                expect(tbCompileFn).toHaveBeenCalledWith(data);
            });

            describe('if called again', function() {
                beforeEach(function() {
                    view.update({
                        name: 'Josh'
                    });
                    view.update({
                        age: 23
                    });
                    queues.render.pop()();
                    tbCompileFn.calls.reset();

                    queues.render.pop()();
                });

                it('should extend the data each time', function() {
                    expect(tbCompileFn).toHaveBeenCalledWith({
                        company: 'Cinema6',
                        name: 'Josh',
                        age: 23
                    });
                });
            });

            describe('if the view was not created yet', function() {
                beforeEach(function() {
                    tbCompileFn = undefined;
                    view.constructor();
                    view.tag = 'span';

                    spyOn(view, 'create').and.callThrough();

                    view.update(data);
                    queues.render.pop()();
                });

                it('should create and compile the element', function() {
                    expect(view.create).toHaveBeenCalled();
                    expect(tbCompileFn).toHaveBeenCalledWith(data);
                });
            });
        });
    });

    describe('hooks:', function() {
        describe('didCreateElement()', function() {
            let element;

            class ButtonView extends View {}
            class TextFieldView extends View {}

            beforeEach(function() {
                element = document.createElement('span');
                view.element = element;

                view.instantiates = {ButtonView, TextFieldView};

                element.innerHTML = `
                    <p>Hello {{name}}</p>
                    We now have curlybracey templates!
                    <div>
                        <button data-view="button:ButtonView">My Button</button>
                        <input data-view="text:TextFieldView" />
                    </div>
                `;

                spyOn(ButtonView.prototype, 'create').and.callThrough();
                spyOn(TextFieldView.prototype, 'create').and.callThrough();

                view.didCreateElement();
            });

            it('should parse the element with TwoBits.js', function() {
                expect(twobits.parse).toHaveBeenCalledWith(element);
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

            it('should create the child views declared in the templates', function() {
                const [button, text] = view.children;

                expect(button).toEqual(jasmine.any(ButtonView));
                expect(button.element).toBe(element.querySelector('button'));
                expect(button.create).toHaveBeenCalled();

                expect(text).toEqual(jasmine.any(TextFieldView));
                expect(text.element).toBe(element.querySelector('input'));
                expect(text.create).toHaveBeenCalled();

                expect(view.button).toBe(button);
                expect(view.text).toBe(text);
            });

            describe('if a child has an unknow constructor', function() {
                let badElement;

                beforeEach(function() {
                    element = document.createElement('span');
                    view.element = element;

                    badElement = document.createElement('div');
                    badElement.setAttribute('data-view', 'foo:FooView');

                    element.appendChild(badElement);
                });

                it('should throw an error', function() {
                    expect(function() {
                        view.didCreateElement();
                    }).toThrow(new Error('Unknown class (FooView). Make sure your class is in the \'instantiates\' array.'));
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
