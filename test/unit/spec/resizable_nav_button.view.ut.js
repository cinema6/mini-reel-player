import ResizableNavButtonView from '../../../src/views/ResizableNavButtonView.js';
import ButtonView from '../../../src/views/ButtonView.js';
import Hideable from '../../../src/mixins/Hideable.js';

describe('ResizableNavButtonView', function() {
    let view;

    beforeEach(function() {
        view = new ResizableNavButtonView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(ButtonView));
    });

    it('should be hideable', function() {
        expect(ResizableNavButtonView.mixins).toContain(Hideable);
    });

    describe('methods:', function() {
        describe('setSize(size)', function() {
            beforeEach(function() {
                spyOn(view, 'addClass');
                spyOn(view, 'removeClass');

                view.setSize('small');
            });

            it('should add the class "slideNav__btn--${size}"', function() {
                expect(view.addClass).toHaveBeenCalledWith('slideNav__btn--small');
            });

            it('should not remove any classes', function() {
                expect(view.removeClass).not.toHaveBeenCalled();
            });

            describe('if called again', function() {
                beforeEach(function() {
                    view.addClass.calls.reset();

                    view.setSize('med');
                });

                it('should add the proper class', function() {
                    expect(view.addClass).toHaveBeenCalledWith('slideNav__btn--med');
                });

                it('should remove the previous class', function() {
                    expect(view.removeClass).toHaveBeenCalledWith('slideNav__btn--small');
                });
            });
        });
    });
});
