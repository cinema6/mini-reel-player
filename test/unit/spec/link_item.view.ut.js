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
        describe('type', function() {
            it('should be null', function() {
                expect(view.type).toBeNull();
            });
        });
    });

    describe('methods:', function() {
        describe('update()', function() {
            let data;

            beforeEach(function() {
                data = {
                    label: 'YouTube'
                };
                spyOn(TemplateView.prototype, 'update');

                view.update(data);
            });

            it('should set the type property to the data\'s label property', function() {
                expect(view.type).toBe(data.label);
            });

            it('should call super()', function() {
                expect(TemplateView.prototype.update).toHaveBeenCalledWith(data);
            });

            describe('if called with no data', function() {
                beforeEach(function() {
                    TemplateView.prototype.update.calls.reset();

                    view.update();
                });

                it('should call super()', function() {
                    expect(TemplateView.prototype.update).toHaveBeenCalled();
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
