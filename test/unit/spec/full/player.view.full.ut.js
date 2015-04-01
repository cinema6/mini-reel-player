import FullPlayerView from '../../../../src/views/full/FullPlayerView.js';
import PlayerView from '../../../../src/views/PlayerView.js';
import Runner from '../../../../lib/Runner.js';
import ResizableNavButtonView from '../../../../src/views/ResizableNavButtonView.js';
import View from '../../../../lib/core/View.js';

describe('FullPlayerView', function() {
    let view;

    beforeEach(function() {
        view = new FullPlayerView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(PlayerView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of FullPlayerView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/full/FullPlayerView.html'));
            });
        });

        describe('child views:', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
            });

            describe('nextButton', function() {
                it('should be a ResizableNavButtonView', function() {
                    expect(view.nextButton).toEqual(jasmine.any(ResizableNavButtonView));
                });
            });

            describe('previousButton', function() {
                it('should be a ResizableNavButtonView', function() {
                    expect(view.previousButton).toEqual(jasmine.any(ResizableNavButtonView));
                });
            });

            describe('nextButtons', function() {
                it('should contain the nextButton', function() {
                    expect(view.nextButtons).toEqual([view.nextButton]);
                });
            });

            describe('previousButtons', function() {
                it('should contain the previousButton', function() {
                    expect(view.previousButtons).toEqual([view.previousButton]);
                });
            });

            describe('navButtons', function() {
                it('should contain the nextButton and previousButton', function() {
                    expect(view.navItems).toEqual([view.nextButton, view.previousButton]);
                });
            });

            describe('cards', function() {
                it('should be a View', function() {
                    expect(view.cards).toEqual(jasmine.any(View));
                });
            });

            describe('playlistOutlet', function() {
                it('should be a View', function() {
                    expect(view.playlistOutlet).toEqual(jasmine.any(View));
                });
            });

            describe('displayAdOutlet', function() {
                it('should be a View', function() {
                    expect(view.displayAdOutlet).toEqual(jasmine.any(View));
                });
            });
        });
    });

    describe('methods:', function() {
        describe('expand()', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
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

        describe('setButtonSize(size)', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
                view.navItems.forEach(button => spyOn(button, 'setSize'));

                view.setButtonSize('small');
            });

            it('should set each nav button\'s size', function() {
                view.navItems.forEach(button => expect(button.setSize).toHaveBeenCalledWith('small'));
            });
        });

        describe('hideNavigation()', function() {
            beforeEach(function() {
                spyOn(PlayerView.prototype, 'hideNavigation');

                view.hideNavigation();
            });

            it('should call super()', function() {
                expect(PlayerView.prototype.hideNavigation).toHaveBeenCalled();
            });
        });

        describe('showNavigation()', function() {
            beforeEach(function() {
                spyOn(PlayerView.prototype, 'showNavigation');

                view.showNavigation();
            });

            it('should call super()', function() {
                expect(PlayerView.prototype.showNavigation).toHaveBeenCalled();
            });
        });

        describe('disableNavigation()', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
                spyOn(PlayerView.prototype, 'disableNavigation');
                view.navItems.forEach(button => spyOn(button, 'disable'));
                view.navEnabled = true;

                view.disableNavigation();
            });

            it('should not call super()', function() {
                expect(PlayerView.prototype.disableNavigation).not.toHaveBeenCalled();
            });

            it('should disable the nav buttons', function() {
                view.navItems.forEach(button => expect(button.disable).toHaveBeenCalled());
            });

            it('should set navEnabled to false', function() {
                expect(view.navEnabled).toBe(false);
            });
        });

        describe('enableNavigation()', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
                spyOn(PlayerView.prototype, 'enableNavigation');
                view.navItems.forEach(button => spyOn(button, 'enable'));
                Runner.run(() => view.disableNavigation());
                Runner.run(() => view.update({ title: 'hello', canGoBack: false, canGoForward: true }));
                spyOn(view, 'update');

                view.enableNavigation();
            });

            it('should not call super()', function() {
                expect(PlayerView.prototype.enableNavigation).not.toHaveBeenCalled();
            });

            it('should enable the nav buttons', function() {
                view.navItems.forEach(button => expect(button.enable).toHaveBeenCalled());
            });

            it('should call update() with the last value passed to update() for canGoBack and canGoForward', function() {
                expect(view.update).toHaveBeenCalledWith({ canGoBack: false, canGoForward: true });
            });

            it('should set navEnabled to true', function() {
                expect(view.navEnabled).toBe(true);
            });
        });

        describe('update(data)', function() {
            let data;

            beforeEach(function() {
                data = { title: 'Hello', totalCards: '5', canGoForward: true, canGoBack: false };
                spyOn(PlayerView.prototype, 'update');
            });

            describe('if the navigation is enabled', function() {
                beforeEach(function() {
                    view.navEnabled = true;
                    view.update(data);
                });

                it('should call super() with the data', function() {
                    expect(PlayerView.prototype.update).toHaveBeenCalledWith(data);
                });
            });

            describe('if the navigation is disabled', function() {
                beforeEach(function() {
                    view.navEnabled = false;
                    view.update(data);
                });

                it('should call super() with the data but canGoBack and canGoForward set to false', function() {
                    expect(PlayerView.prototype.update).toHaveBeenCalledWith({
                        title: data.title,
                        totalCards: data.totalCards,
                        canGoForward: false,
                        canGoBack: false
                    });
                });
            });
        });
    });

    describe('hooks:', function() {
        describe('didCreateElement()', function() {
            beforeEach(function() {
                spyOn(view, 'addListeners');
                spyOn(view, 'enableNavigation');

                Runner.run(() => view.create());
            });

            it('should add its event listeners', function() {
                expect(view.addListeners).toHaveBeenCalled();
            });

            it('should enable navigation', function() {
                expect(view.enableNavigation).toHaveBeenCalled();
            });
        });
    });
});
