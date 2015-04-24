import TemplateView from '../../../lib/core/TemplateView.js';
import PlayerView from '../../../src/views/PlayerView.js';
import ButtonView from '../../../src/views/ButtonView.js';
import HideableView from '../../../src/views/HideableView.js';
import Runner from '../../../lib/Runner.js';
import LinksListView from '../../../src/views/LinksListView.js';

describe('PlayerView', function() {
    let playerView;

    beforeEach(function() {
        playerView = new PlayerView();
    });

    it('should be a TemplateView', function() {
        expect(playerView).toEqual(jasmine.any(TemplateView));
    });

    describe('properties:', function() {
        describe('tag', function() {
            it('should be "main"', function() {
                expect(playerView.tag).toBe('main');
            });
        });

        describe('nextButtons', function() {
            it('should be an array', function() {
                expect(playerView.nextButtons).toEqual([]);
            });
        });

        describe('previousButtons', function() {
            it('should be an array', function() {
                expect(playerView.previousButtons).toEqual([]);
            });
        });

        describe('closeButtons', function() {
            it('should be an array', function() {
                expect(playerView.closeButtons).toEqual([]);
            });
        });

        describe('skipTimers', function() {
            it('should be an array', function() {
                expect(playerView.skipTimers).toEqual([]);
            });
        });

        describe('navItems', function() {
            it('should be an array', function() {
                expect(playerView.navItems).toEqual([]);
            });
        });

        describe('navEnabled', function() {
            it('should be false', function() {
                expect(playerView.navEnabled).toBe(false);
            });
        });
    });

    describe('methods:', function() {
        describe('disableNavigation()', function() {
            beforeEach(function() {
                playerView.skipTimers = [new HideableView(), new HideableView()];
                playerView.skipTimers.forEach(view => spyOn(view, 'show'));
                spyOn(playerView, 'hideNavigation');
                playerView.navEnabled = true;

                playerView.disableNavigation();
            });

            it('should show the skip timers', function() {
                playerView.skipTimers.forEach(view => expect(view.show).toHaveBeenCalled());
            });

            it('should hide the navigation', function() {
                expect(playerView.hideNavigation).toHaveBeenCalled();
            });

            it('should set navEnabled to false', function() {
                expect(playerView.navEnabled).toBe(false);
            });
        });

        describe('enableNavigation()', function() {
            beforeEach(function() {
                playerView.skipTimers = [new HideableView(), new HideableView()];
                playerView.skipTimers.forEach(view => spyOn(view, 'hide'));
                spyOn(playerView, 'showNavigation');
                playerView.navEnabled = false;

                playerView.enableNavigation();
            });

            it('should hide the skip timers', function() {
                playerView.skipTimers.forEach(view => expect(view.hide).toHaveBeenCalled());
            });

            it('should show the navigation', function() {
                expect(playerView.showNavigation).toHaveBeenCalled();
            });

            it('should set navEnabled to true', function() {
                expect(playerView.navEnabled).toBe(true);
            });
        });

        describe('updateSkipTimer(time)', function() {
            class SkipTimerView {
                update() {}
            }

            beforeEach(function() {
                playerView.skipTimers = [new SkipTimerView(), new SkipTimerView()];
                playerView.skipTimers.forEach(view => spyOn(view, 'update'));

                playerView.updateSkipTimer(5);
            });

            it('should update the skip timers', function() {
                playerView.skipTimers.forEach(view => expect(view.update).toHaveBeenCalledWith(5));
            });
        });

        describe('hideNavigation()', function() {
            beforeEach(function() {
                spyOn(playerView, 'hidePaginators');

                playerView.hideNavigation();
            });

            it('should hide the paginators', function() {
                expect(playerView.hidePaginators).toHaveBeenCalled();
            });
        });

        describe('showNavigation()', function() {
            beforeEach(function() {
                spyOn(playerView, 'showPaginators');

                playerView.showNavigation();
            });

            it('should show the paginators', function() {
                expect(playerView.showPaginators).toHaveBeenCalled();
            });
        });

        describe('hidePaginators()', function() {
            beforeEach(function() {
                playerView.navItems = [new HideableView(), new HideableView(), new HideableView(), new HideableView()];
                playerView.navItems.forEach(view => spyOn(view, 'hide'));

                playerView.hidePaginators();
            });

            it('should hide the next and previous buttons', function() {
                playerView.navItems.forEach(view => expect(view.hide).toHaveBeenCalled());
            });
        });

        describe('showPaginators()', function() {
            beforeEach(function() {
                playerView.navItems = [new HideableView(), new HideableView(), new HideableView(), new HideableView()];
                playerView.navItems.forEach(view => spyOn(view, 'show'));

                playerView.showPaginators();
            });

            it('should hide the next and previous buttons', function() {
                playerView.navItems.forEach(view => expect(view.show).toHaveBeenCalled());
            });
        });

        describe('toggleNavigation()', function() {
            beforeEach(function() {
                Runner.run(() => playerView.create());

                spyOn(playerView, 'showNavigation').and.callThrough();
                spyOn(playerView, 'hideNavigation').and.callThrough();
            });

            describe('when called initially', function() {
                beforeEach(function() {
                    Runner.run(() => playerView.toggleNavigation());
                });

                it('should hide the navigation', function() {
                    expect(playerView.hideNavigation).toHaveBeenCalled();
                });
            });

            describe('when called after the navigation has been hidden', function() {
                beforeEach(function() {
                    Runner.run(() => playerView.hideNavigation());
                    Runner.run(() => playerView.toggleNavigation());
                });

                it('should show the navigation', function() {
                    expect(playerView.showNavigation).toHaveBeenCalled();
                });
            });
        });

        describe('update(data)', function() {
            let data;
            let buttons;

            beforeEach(function() {
                data = {
                    title: 'title',
                    foo: 'bar',
                    canGoForward: true,
                    canGoBack: true,
                    links: [
                        { type: 'youtube', label: 'YouTube', href: 'yt.com' },
                        { type: 'facebook', label: 'Facebook', href: 'fb.com' }
                    ]
                };
                spyOn(TemplateView.prototype, 'update').and.callThrough();

                playerView.links = new LinksListView();
                spyOn(playerView.links, 'update');

                playerView.nextButtons = [new ButtonView(), new ButtonView()];
                playerView.previousButtons = [new ButtonView(), new ButtonView()];
                buttons = [].concat(playerView.nextButtons, playerView.previousButtons);

                buttons.forEach(button => {
                    spyOn(button, 'enable').and.callThrough();
                    spyOn(button, 'disable').and.callThrough();
                });

                Runner.run(() => playerView.update(data));
            });

            it('should call super()', function() {
                expect(TemplateView.prototype.update).toHaveBeenCalledWith(data);
            });

            it('should udpate its links view with data', function() {
                expect(playerView.links.update).toHaveBeenCalledWith(data.links);
            });

            it('should enable all of the buttons', function() {
                buttons.forEach(button => {
                    expect(button.enable).toHaveBeenCalled();
                    expect(button.disable).not.toHaveBeenCalled();
                });
            });

            describe('if called without links', function() {
                beforeEach(function() {
                    playerView.links.update.calls.reset();
                    delete data.links;

                    Runner.run(() => playerView.update(data));
                });

                it('should not update its links', function() {
                    expect(playerView.links.update).not.toHaveBeenCalled();
                });
            });

            describe('if the minireel can\'t go forward', function() {
                beforeEach(function() {
                    data.canGoForward = false;
                    buttons.forEach(button => {
                        button.enable.calls.reset();
                        button.disable.calls.reset();
                    });

                    Runner.run(() => playerView.update(data));
                });

                it('should disable the next buttons and enable the previous buttons', function() {
                    playerView.nextButtons.forEach(button => {
                        expect(button.disable).toHaveBeenCalled();
                        expect(button.enable).not.toHaveBeenCalled();
                    });

                    playerView.previousButtons.forEach(button => {
                        expect(button.enable).toHaveBeenCalled();
                        expect(button.disable).not.toHaveBeenCalled();
                    });
                });
            });

            describe('if the minireel can\'t go back', function() {
                beforeEach(function() {
                    data.canGoBack = false;
                    buttons.forEach(button => {
                        button.enable.calls.reset();
                        button.disable.calls.reset();
                    });

                    Runner.run(() => playerView.update(data));
                });

                it('should disable the previousButtons buttons and enable the nextButtons', function() {
                    playerView.nextButtons.forEach(button => {
                        expect(button.enable).toHaveBeenCalled();
                        expect(button.disable).not.toHaveBeenCalled();
                    });

                    playerView.previousButtons.forEach(button => {
                        expect(button.disable).toHaveBeenCalled();
                        expect(button.enable).not.toHaveBeenCalled();
                    });
                });
            });
        });
    });
});
