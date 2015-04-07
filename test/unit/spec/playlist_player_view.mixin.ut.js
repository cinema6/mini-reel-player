import PlaylistPlayerView from '../../../src/mixins/PlaylistPlayerView.js';
import PlayerView from '../../../src/views/PlayerView.js';
import Runner from '../../../lib/Runner.js';
import View from '../../../lib/core/View.js';
import ResizableNavButtonView from '../../../src/views/ResizableNavButtonView.js';
class MyPlayerView extends PlayerView {}
MyPlayerView.mixin(PlaylistPlayerView);

describe('PlaylistPlayerView mixin', function() {
    let view;

    beforeEach(function() {
        view = new MyPlayerView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(PlayerView));
    });

    describe('methods:', function() {
        describe('expand()', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
                view.cards = new View();
                view.nextButtons = [new ResizableNavButtonView()];

                spyOn(view.cards, 'addClass');
                view.nextButtons.forEach(button => spyOn(button, 'hide'));

                view.expand();
            });

            it('should add the "cards__list--fullWidth" class to the cards view', function() {
                expect(view.cards.addClass).toHaveBeenCalledWith('cards__list--fullWidth');
            });

            it('should hide the nextButtons', function() {
                view.nextButtons.forEach(button => expect(button.hide).toHaveBeenCalled());
            });
        });

        describe('contract()', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
                view.cards = new View();
                view.nextButtons = [new ResizableNavButtonView()];

                spyOn(view.cards, 'removeClass');
                view.nextButtons.forEach(button => spyOn(button, 'show'));

                view.contract();
            });

            it('should remove the "cards__list--fullWidth" class from the cards view', function() {
                expect(view.cards.removeClass).toHaveBeenCalledWith('cards__list--fullWidth');
            });

            it('should show the nextButtons', function() {
                view.nextButtons.forEach(button => expect(button.show).toHaveBeenCalled());
            });

            describe('if the navigation is hidden', function() {
                beforeEach(function() {
                    view.nextButtons.forEach(button => button.show.calls.reset());
                    Runner.run(() => view.hideNavigation());

                    Runner.run(() => view.contract());
                });

                it('should not show the nextButtons', function() {
                    view.nextButtons.forEach(button => expect(button.show).not.toHaveBeenCalled());
                });

                describe('if the navigation is shown again', function() {
                    beforeEach(function() {
                        Runner.run(() => view.showNavigation());
                        view.nextButtons.forEach(button => button.show.calls.reset());

                        Runner.run(() => view.contract());
                    });

                    it('should show the nextButtons', function() {
                        view.nextButtons.forEach(button => expect(button.show).toHaveBeenCalled());
                    });
                });
            });
        });
    });
});
