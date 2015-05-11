import AnimatedCardView from '../../../src/mixins/AnimatedCardView.js';
import CardView from '../../../src/views/CardView.js';
import animator from '../../../lib/animator.js';
import Runner from '../../../lib/Runner.js';

describe('AnimatedCardView', function() {
    class MyCardView extends CardView {}
    MyCardView.mixin(AnimatedCardView);

    let view;

    beforeEach(function() {
        view = new MyCardView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(MyCardView));
    });

    describe('methods:', function() {
        describe('show()', function() {
            beforeEach(function() {
                spyOn(animator, 'trigger');

                Runner.run(() => view.show());
            });

            it('should trigger a "card:show" on the animator', function() {
                expect(animator.trigger).toHaveBeenCalledWith('card:show', view);
            });
        });

        describe('hide()', function() {
            beforeEach(function() {
                spyOn(animator, 'trigger');

                Runner.run(() => view.hide());
            });

            it('should trigger a "card:hide" on the animator', function() {
                expect(animator.trigger).toHaveBeenCalledWith('card:hide', view);
            });
        });
    });
});
