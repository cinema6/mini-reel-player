import LinkItemView from '../../../src/views/LinkItemView.js';
import TemplateView from '../../../lib/core/TemplateView.js';

describe('LinkItemView', function() {
    let view;

    beforeEach(function() {
        view = new LinkItemView();
    });

    it('should be a TemplateView', function() {
        expect(view).toEqual(jasmine.any(TemplateView));
    });

    describe('properties:', function() {
        describe('context', function() {
            it('should be null', function() {
                expect(view.context).toBeNull();
            });

            describe('if the element has a "data-link-context" attribute', function() {
                beforeEach(function() {
                    const element = document.createElement('a');
                    element.setAttribute('data-link-context', 'some-context');

                    view = new LinkItemView(element);
                });

                it('should be the value of that attribute', function() {
                    expect(view.context).toBe('some-context');
                });
            });
        });
    });

    describe('handlers:', function() {
        describe('click()', function() {
            beforeEach(function() {
                spyOn(view, 'sendAction');

                view.click();
            });

            it('should send an action', function() {
                expect(view.sendAction).toHaveBeenCalledWith(view);
            });
        });
    });
});
