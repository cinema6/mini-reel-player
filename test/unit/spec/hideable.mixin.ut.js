import Hideable from '../../../src/mixins/Hideable.js';
import View from '../../../lib/core/View.js';
import Runner from '../../../lib/Runner.js';
import animator from '../../../lib/animator.js';

describe('Hideable', function() {
    let testView;

    class TestView extends View {
        constructor() {
            super(...arguments);

            this.tag = 'span';
        }
    }
    TestView.mixin(Hideable);

    beforeEach(function() {
        testView = new TestView();
    });

    describe('methods:', function() {
        describe('hide()', function() {
            beforeEach(function(done) {
                Runner.run(() => testView.hide());
                animator.flush('view:hide').then(done);
            });

            it('should set display to "none"', function() {
                expect(testView.element.style.display).toBe('none');
            });
        });

        describe('show()', function() {
            it('should not throw any errors if the element has not been created yet', function() {
                expect(function() {
                    Runner.run(() => testView.show());
                }).not.toThrow();
            });

            describe('if called before the view is hidden', function() {
                beforeEach(function() {
                    spyOn(animator, 'trigger').and.returnValue(new Promise(() => {}));

                    Runner.run(() => testView.show());
                });

                it('should not trigger any animations', function() {
                    expect(animator.trigger).not.toHaveBeenCalled();
                });
            });

            describe('after the view is hidden', function() {
                beforeEach(function(done) {
                    testView.attributes = { style: 'display: inline-block;' };
                    Runner.run(() => testView.hide());

                    animator.flush('view:hide').then(() => {
                        Runner.run(() => testView.hide());
                    }).then(() => {
                        return animator.flush('view:hide');
                    }).then(() => {
                        Runner.run(() => testView.show());
                    }).then(() => {
                        return animator.flush('view:show');
                    }).then(done, done);
                });

                it('should set the display prop back to its inital value', function() {
                    expect(testView.element.style.display).toBe('inline-block');
                });
            });
        });
    });
});
