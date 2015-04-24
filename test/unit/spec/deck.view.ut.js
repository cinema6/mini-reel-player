import DeckView from '../../../src/views/DeckView.js';
import View from '../../../lib/core/View.js';
import Runner from '../../../lib/Runner.js';

describe('DeckView', function() {
    let view;

    beforeEach(function() {
        Runner.run(() => view = new DeckView());
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(View));
    });

    it('should start hidden', function() {
        expect(view.classes).toContain('ui--offscreen');
    });

    describe('methods:', function() {
        describe('show()', function() {
            beforeEach(function() {
                spyOn(view, 'removeClass');

                view.show();
            });

            it('should remove the "ui--offscreen" class', function() {
                expect(view.removeClass).toHaveBeenCalledWith('ui--offscreen');
            });
        });

        describe('hide()', function() {
            beforeEach(function() {
                spyOn(view, 'addClass');

                view.hide();
            });

            it('should add the "ui--offscreen" class', function() {
                expect(view.addClass).toHaveBeenCalledWith('ui--offscreen');
            });
        });
    });
});
