import PlayerOutletView from '../../../src/views/PlayerOutletView.js';
import View from '../../../lib/core/View.js';

describe('PlayerOutletView', function() {
    let view;

    beforeEach(function() {
        view = new PlayerOutletView();
    });

    it('should be a View', function() {
        expect(view).toEqual(jasmine.any(View));
    });

    describe('methods:', function() {
        describe('show()', function() {
            beforeEach(function() {
                spyOn(view, 'removeClass');
                view.show();
            });

            it('should remove the "player--fly-away" class', function() {
                expect(view.removeClass).toHaveBeenCalledWith('player--fly-away');
            });
        });

        describe('hide()', function() {
            beforeEach(function() {
                spyOn(view, 'addClass');
                view.hide();
            });

            it('should add the "player--fly-away" class', function() {
                expect(view.addClass).toHaveBeenCalledWith('player--fly-away');
            });
        });
    });
});
