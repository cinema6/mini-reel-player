import View from '../../../lib/core/View.js';
import DominoView from '../../../src/mixins/DominoView.js';
import domino from '../../../src/services/domino.js';
import Runner from '../../../lib/Runner.js';

describe('DominoView mixin', function() {
    let view;
    let didInsertElement;

    class MyView extends View {
        constructor(element) {
            super(element);
        }
    }
    didInsertElement = MyView.prototype.didInsertElement = jasmine.createSpy('didInsertElement()').and.callFake(View.prototype.didInsertElement);
    MyView.mixin(DominoView);

    beforeEach(function() {
        view = new MyView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(MyView));
    });

    describe('methods:', function() {
        describe('didInsertElement()', function() {
            beforeEach(function() {
                spyOn(View.prototype, 'didInsertElement').and.callThrough();
                spyOn(domino, 'apply').and.callThrough();

                spyOn(Runner, 'scheduleOnce').and.callThrough();

                Runner.run(() => view.didInsertElement());
            });

            it('should call this.super()', function() {
                expect(didInsertElement).toHaveBeenCalled();
            });

            it('should apply domino styles once in the render queue', function() {
                expect(Runner.scheduleOnce).toHaveBeenCalledWith('render', domino, 'apply');
                expect(domino.apply).toHaveBeenCalledWith();
            });
        });
    });
});
