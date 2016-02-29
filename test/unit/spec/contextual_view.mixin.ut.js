import ContextualView from '../../../src/mixins/ContextualView.js';
import View from '../../../lib/core/View.js';

describe('ContextualView', function() {
    let view;
    let element;

    class MyView extends View {
        constructor() {
            super(...arguments);

            this.tag = 'span';
        }
    }
    MyView.mixin(ContextualView);

    beforeEach(function() {
        element = document.createElement('span');
    });

    describe('properties:', function() {
        describe('context', function() {
            describe('if the element has a data-link-context attribute', function() {
                beforeEach(function() {
                    element.setAttribute('data-link-context', 'the-context');
                    view = new MyView(element);
                    view.create();
                });

                it('should be the value of the attribute', function() {
                    expect(view.context).toBe('the-context');
                });
            });

            describe('if the element has no data-link-context attribute', function() {
                beforeEach(function() {
                    view = new MyView(element);
                    view.create();
                });

                it('should be null', function() {
                    expect(view.context).toBeNull();
                });
            });
        });
    });
});
