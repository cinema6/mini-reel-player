describe('Hideable', function() {
    import Hideable from '../../../src/mixins/Hideable.js';
    import View from '../../../lib/core/View.js';
    import Runner from '../../../lib/Runner.js';
    import animator from '../../../lib/animator.js';
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
                expect(testView.element.style.display).toBe('');
            });

            describe('after the view is hidden', function() {
                beforeEach(function(done) {
                    testView.attributes = { style: 'display: inline-block;' };
                    Runner.run(() => {
                        testView.hide();
                        testView.show();
                    });
                    Promise.all([animator.flush('view:hide'), animator.flush('view:show')]).then(done);
                });

                it('should set the display prop back to its inital value', function() {
                    expect(testView.element.style.display).toBe('inline-block');
                });
            });
        });
    });
});
