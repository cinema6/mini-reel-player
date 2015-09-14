import ActionableItemView from '../../../src/views/ActionableItemView.js';
import TemplateView from '../../../lib/core/TemplateView.js';
import Touchable from '../../../src/mixins/Touchable.js';

describe('ActionableItemView', function() {
    let view;

    beforeEach(function() {
        view = new ActionableItemView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(TemplateView));
    });

    it('should mixin Touchable', function() {
        expect(ActionableItemView.mixins).toContain(Touchable);
    });

    describe('properties', function() {
        describe('private', function() {
            describe('item', function() {
                it('should be null', function() {
                    expect(view.__private__.item).toBeNull();
                });
            });
        });
    });

    describe('methods', function() {
        describe('update(data)', function() {
            beforeEach(function() {
                spyOn(TemplateView.prototype, 'update');
                view.update({
                    foo: 'bar'
                });
            });

            it('should call super', function() {
                expect(TemplateView.prototype.update).toHaveBeenCalled();
            });

            it('should set the item', function() {
                expect(view.__private__.item).toEqual({
                    foo: 'bar'
                });
            });
        });

        describe('click', function() {
            beforeEach(function() {
                spyOn(view, 'sendAction');
                view.__private__.item = {
                    foo: 'bar'
                };
                view.click();
            });

            it('should call send action', function() {
                expect(view.sendAction).toHaveBeenCalledWith(view, {
                    foo: 'bar'
                });
            });
        });
    });
});
