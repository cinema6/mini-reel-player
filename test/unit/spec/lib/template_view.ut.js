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
            it('should be an empty array', function() {
                expect(view.instantiates).toEqual([]);
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

                view.instantiates = [ButtonView, TextFieldView];

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
