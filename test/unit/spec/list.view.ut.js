import ListView from '../../../src/views/ListView.js';
import View from '../../../lib/core/View.js';
import TemplateView from '../../../lib/core/TemplateView.js';
import Runner from '../../../lib/Runner.js';
import {
    map
} from '../../../lib/utils.js';

describe('ListView', function() {
    let listView;

    beforeEach(function() {
        listView = new ListView();
    });

    it('should be a view', function() {
        expect(listView).toEqual(jasmine.any(View));
    });

    describe('properties:', function() {
        describe('tag', function() {
            it('should be "ul"', function() {
                expect(listView.tag).toBe('ul');
            });
        });

        describe('itemViewClass', function() {
            it('should be TemplateView', function() {
                expect(listView.itemViewClass).toBe(TemplateView);
            });
        });

        describe('itemIdentifier', function() {
            it('should be "id"', function() {
                expect(listView.itemIdentifier).toBe('id');
            });
        });
    });

    describe('methods:', function() {
        describe('update(collection)', function() {
            let collection;
            let children;
            let spy;

            beforeEach(function() {
                class ItemView extends TemplateView {
                    constructor() {
                        super(...arguments);

                        this.tag = 'li';
                    }
                }

                spy = jasmine.createSpy('spy()');

                collection = [
                    { id: 'thing1', value: 'The' },
                    { id: 'thing2', value: 'hills' },
                    { id: 'thing3', value: 'are' },
                    { id: 'thing4', value: 'alive.' }
                ];
                listView.itemViewClass = ItemView;
                spyOn(listView.itemViewClass.prototype, 'update');
                spyOn(listView, 'append').and.callThrough();
                listView.on('addChild', spy);

                Runner.run(() => listView.update(collection));

                children = listView.append.calls.all().map(call => call.args[0]);
            });

            describe('if the template has an element', function() {
                beforeEach(function() {
                    listView = new ListView();
                    listView.template = `
                        <li>I will be repeated.</li>
                    `;
                    spyOn(listView, 'append').and.callThrough();

                    Runner.run(() => listView.update(collection));
                    children = listView.append.calls.all().map(call => call.args[0]);
                });

                it('should empty the element', function() {
                    expect(listView.element.childNodes.length).toBe(collection.length);
                });

                it('should create the children with a clone of the list\'s child', function() {
                    children.forEach(child => {
                        expect(child.template).toEqual('I will be repeated.');
                        expect(child.tag).toBe('li');
                    });
                });
            });

            describe('if the template has more than one element', function() {
                beforeEach(function() {
                    listView = new ListView();
                    listView.template = `
                        <p>One</p>
                        <strong>Two</strong>
                    `;
                });

                it('should throw an error', function() {
                    expect(function() {
                        listView.create();
                    }).toThrow(new RangeError(`ListView [${listView.id}] cannot have more than one child element in its template.`));
                });
            });

            it('should create a child for each item in the collection', function() {
                expect(listView.append.calls.count()).toBe(collection.length);
                expect(children).toEqual(collection.map(() => jasmine.any(TemplateView)));
            });

            it('should emit the addChild event', function() {
                children.forEach((child, index) => expect(spy).toHaveBeenCalledWith(child, index));
            });

            it('should create an id for each child', function() {
                children.forEach((child, index) => expect(child.id).toBe(`${listView.id}--${collection[index][listView.itemIdentifier]}`));
            });

            it('should update each child with the collection item', function() {
                children.forEach((child, index) => expect(child.update).toHaveBeenCalledWith(collection[index]));
            });

            describe('if an item is added', function() {
                beforeEach(function() {
                    collection = [
                        { id: 'thing1', value: 'The' },
                        { id: 'thing2', value: 'hills' },
                        { id: 'thingA', value: 'really' },
                        { id: 'thingB', value: 'really' },
                        { id: 'thing3', value: 'are' },
                        { id: 'thing4', value: 'alive.' }
                    ];
                    listView.append.calls.reset();
                    spy.calls.reset();

                    Runner.run(() => listView.update(collection));

                    children = listView.append.calls.all().map(call => call.args[0]);
                });

                it('should append the new children', function() {
                    expect(map(listView.element.childNodes, child => child.id)).toEqual(collection.map(item => `${listView.id}--${item.id}`));
                });

                it('should emit "addChild" with the new children', function() {
                    expect(spy.calls.count()).toBe(2);
                    expect(spy).toHaveBeenCalledWith(children[0], 2);
                    expect(spy).toHaveBeenCalledWith(children[1], 3);
                });
            });

            describe('if an item is removed', function() {
                beforeEach(function() {
                    collection = [
                        { id: 'thing2', value: 'hills' },
                        { id: 'thing4', value: 'alive.' }
                    ];
                    listView.append.calls.reset();
                    children.forEach(child => spyOn(child, 'remove').and.callThrough());
                    spy.calls.reset();

                    listView.on('removeChild', spy);

                    Runner.run(() => listView.update(collection));
                });

                it('should remove the proper children', function() {
                    expect(children[0].remove).toHaveBeenCalled();
                    expect(children[1].remove).not.toHaveBeenCalled();
                    expect(children[2].remove).toHaveBeenCalled();
                    expect(children[3].remove).not.toHaveBeenCalled();
                });

                it('should emit "removeChild"', function() {
                    expect(spy.calls.count()).toBe(2);
                    expect(spy).toHaveBeenCalledWith(children[0], 0);
                    expect(spy).toHaveBeenCalledWith(children[2], 2);
                });

                describe('if an element is added again', function() {
                    let prevThing3;

                    beforeEach(function() {
                        prevThing3 = children[2];

                        collection = [
                            { id: 'thing2', value: 'hills' },
                            { id: 'thing4', value: 'alive.' },
                            { id: 'thing3', value: 'are' }
                        ];

                        Runner.run(() => listView.update(collection));
                    });

                    it('should create a new view', function() {
                        expect(listView.element.childNodes[2]).not.toBe(prevThing3.element);
                    });
                });
            });

            describe('if items are moved', function() {
                beforeEach(function() {
                    collection = [
                        { id: 'thing1', value: 'The' },
                        { id: 'thing4', value: 'alive.' },
                        { id: 'thing2', value: 'hills' },
                        { id: 'thing3', value: 'are' }
                    ];
                    listView.append.calls.reset();
                    children.forEach(child => child.update.calls.reset());

                    Runner.run(() => listView.update(collection));
                });

                it('should rearrange the items', function() {
                    expect(children[0].element.nextSibling).toBe(children[3].element);
                    expect(children[1].element.nextSibling).toBe(children[2].element);
                    expect(children[2].element.nextSibling).toBeNull();
                    expect(children[3].element.nextSibling).toBe(children[1].element);
                    expect(map(listView.element.childNodes, child => child.id)).toEqual(collection.map(item => `${listView.id}--${item.id}`));
                });

                it('should update all of the items', function() {
                    children.forEach((child, index) => expect(child.update).toHaveBeenCalledWith(collection[index]));
                });
            });
        });
    });

    describe('hooks:', function() {
        describe('didCreateElement()', function() {
        });
    });
});
