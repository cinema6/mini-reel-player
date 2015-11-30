import Touchable from '../../../src/mixins/Touchable.js';
import View from '../../../lib/core/View.js';

describe('Touchable', function() {
    let testView, clickSpy;

    class TestView extends View {
        constructor() {
            super(...arguments);

            this.tag = 'span';
        }
        click() {
            clickSpy();
        }
    }
    TestView.mixin(Touchable);

    beforeEach(function() {
        clickSpy = jasmine.createSpy('click');
        testView = new TestView();
    });

    describe('methods', function() {
        describe('touchStart()', function() {
            let evt;

            beforeEach(function() {
                evt = {
                    preventDefault: jasmine.createSpy('event.preventDefault()')
                };

                testView.touchStart(evt);
            });

            it('should prevent default on the event', function() {
                expect(evt.preventDefault).toHaveBeenCalled();
            });
        });

        describe('touchEnd()', function() {
            let evt;

            beforeEach(function() {
                evt = {
                    preventDefault: jasmine.createSpy('event.preventDefault()')
                };
            });

            it('should preventDefault()', function() {
                testView.touchEnd(evt);
                expect(evt.preventDefault).toHaveBeenCalled();
            });

            it('should call click()', function() {
                testView.touchEnd(evt);
                expect(clickSpy).toHaveBeenCalled();
            });

            describe('when click does not exist', function() {
                it('should not call click', function() {
                    testView.click = undefined;
                    testView.touchEnd(evt);
                    expect(clickSpy).not.toHaveBeenCalled();
                });
            });
        });
    });
});
