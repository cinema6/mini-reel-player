import MobilePlayerView from '../../../../src/views/mobile/MobilePlayerView.js';
import PlayerView from '../../../../src/views/PlayerView.js';
import Runner from '../../../../lib/Runner.js';
import View from '../../../../lib/core/View.js';
import NavbarView from '../../../../src/views/mobile/NavbarView.js';
import CloseButtonView from '../../../../src/views/CloseButtonView.js';
import TOCButtonView from '../../../../src/views/mobile/TOCButtonView.js';
import NavButtonView from '../../../../src/views/mobile/NavButtonView.js';
import SkipTimerView from '../../../../src/views/SkipTimerView.js';
import HideableView from '../../../../src/views/HideableView.js';
import LinksListView from '../../../../src/views/LinksListView.js';
import DeckView from '../../../../src/views/DeckView.js';

describe('MobilePlayerView', function() {
    let mobilePlayerView;

    beforeEach(function() {
        mobilePlayerView = new MobilePlayerView();
    });

    it('should be a TemplateView', function() {
        expect(mobilePlayerView).toEqual(jasmine.any(PlayerView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be an external HTML template', function() {
                expect(mobilePlayerView.template).toBe(require('../../../../src/views/mobile/MobilePlayerView.html'));
            });
        });

        describe('cards', function() {
            beforeEach(function() {
                Runner.run(() => mobilePlayerView.create());
            });

            it('should be a DeckView', function() {
                expect(mobilePlayerView.cards).toEqual(jasmine.any(DeckView));
            });
        });

        describe('prerollOutlet', function() {
            beforeEach(function() {
                Runner.run(() => mobilePlayerView.create());
            });

            it('should be a DeckView', function() {
                expect(mobilePlayerView.prerollOutlet).toEqual(jasmine.any(DeckView));
            });
        });

        describe('links', function() {
            beforeEach(function() {
                Runner.run(() => mobilePlayerView.create());
            });

            it('should be a LinksListView', function() {
                expect(mobilePlayerView.links).toEqual(jasmine.any(LinksListView));
            });
        });

        describe('toc', function() {
            beforeEach(function() {
                Runner.run(() => mobilePlayerView.create());
            });

            it('should be a view', function() {
                expect(mobilePlayerView.toc).toEqual(jasmine.any(View));
            });
        });

        describe('navbar', function() {
            beforeEach(function() {
                Runner.run(() => mobilePlayerView.create());
            });

            it('should be a NavbarView', function() {
                expect(mobilePlayerView.navbar).toEqual(jasmine.any(NavbarView));
            });
        });

        describe('landscapeLeftSidebar', function() {
            beforeEach(function() {
                Runner.run(() => mobilePlayerView.create());
            });

            it('should be a NavbarView', function() {
                expect(mobilePlayerView.landscapeLeftSidebar).toEqual(jasmine.any(NavbarView));
            });
        });

        describe('closeButton', function() {
            beforeEach(function() {
                Runner.run(() => mobilePlayerView.create());
            });

            it('should be a ButtonView', function() {
                expect(mobilePlayerView.closeButton).toEqual(jasmine.any(CloseButtonView));
            });
        });

        describe('landscapeCloseButton', function() {
            beforeEach(function() {
                Runner.run(() => mobilePlayerView.create());
            });

            it('should be a ButtonView', function() {
                expect(mobilePlayerView.landscapeCloseButton).toEqual(jasmine.any(CloseButtonView));
            });
        });

        describe('tocButton', function() {
            beforeEach(function() {
                Runner.run(() => mobilePlayerView.create());
            });

            it('should be a ButtonView', function() {
                expect(mobilePlayerView.tocButton).toEqual(jasmine.any(TOCButtonView));
            });
        });

        describe('landscapeTocButton', function() {
            beforeEach(function() {
                Runner.run(() => mobilePlayerView.create());
            });

            it('should be a ButtonView', function() {
                expect(mobilePlayerView.landscapeTocButton).toEqual(jasmine.any(TOCButtonView));
            });
        });

        describe('nextButton', function() {
            beforeEach(function() {
                Runner.run(() => mobilePlayerView.create());
            });

            it('should be a NavButtonView', function() {
                expect(mobilePlayerView.nextButton).toEqual(jasmine.any(NavButtonView));
            });
        });

        describe('landscapeNextButton', function() {
            beforeEach(function() {
                Runner.run(() => mobilePlayerView.create());
            });

            it('should be a NavButtonView', function() {
                expect(mobilePlayerView.landscapeNextButton).toEqual(jasmine.any(NavButtonView));
            });
        });

        describe('previousButton', function() {
            beforeEach(function() {
                Runner.run(() => mobilePlayerView.create());
            });

            it('should be a NavButtonView', function() {
                expect(mobilePlayerView.previousButton).toEqual(jasmine.any(NavButtonView));
            });
        });

        describe('landscapePreviousButton', function() {
            beforeEach(function() {
                Runner.run(() => mobilePlayerView.create());
            });

            it('should be a NavButtonView', function() {
                expect(mobilePlayerView.landscapePreviousButton).toEqual(jasmine.any(NavButtonView));
            });
        });

        describe('skipTimer', function() {
            beforeEach(function() {
                Runner.run(() => mobilePlayerView.create());
            });

            it('should be a SkipTimerView', function() {
                expect(mobilePlayerView.skipTimer).toEqual(jasmine.any(SkipTimerView));
            });
        });

        describe('landscapeSkipTimer', function() {
            beforeEach(function() {
                Runner.run(() => mobilePlayerView.create());
            });

            it('should be a SkipTimerView', function() {
                expect(mobilePlayerView.landscapeSkipTimer).toEqual(jasmine.any(SkipTimerView));
            });
        });

        describe('closeSkipTimer', function() {
            beforeEach(function() {
                Runner.run(() => mobilePlayerView.create());
            });

            it('should be a SkipTimerView', function() {
                expect(mobilePlayerView.closeSkipTimer).toEqual(jasmine.any(SkipTimerView));
            });
        });

        describe('tocButtons', function() {
            it('should be an array', function() {
                expect(mobilePlayerView.tocButtons).toEqual([]);
            });
        });

        describe('chromeItems', function() {
            it('should be an array', function() {
                expect(mobilePlayerView.chromeItems).toEqual([]);
            });
        });
    });

    describe('methods:', function() {
        describe('hideNavigation()', function() {
            beforeEach(function() {
                mobilePlayerView.tocButtons = [new HideableView(), new HideableView()];
                mobilePlayerView.tocButtons.forEach(view => spyOn(view, 'hide'));
                spyOn(PlayerView.prototype, 'hideNavigation');

                mobilePlayerView.hideNavigation();
            });

            it('should call super()', function() {
                expect(PlayerView.prototype.hideNavigation).toHaveBeenCalled();
            });

            it('should hide the toc buttons', function() {
                mobilePlayerView.tocButtons.forEach(button => expect(button.hide).toHaveBeenCalled());
            });
        });

        describe('showNavigation()', function() {
            beforeEach(function() {
                mobilePlayerView.tocButtons = [new HideableView(), new HideableView()];
                mobilePlayerView.tocButtons.forEach(view => spyOn(view, 'show'));
                spyOn(PlayerView.prototype, 'showNavigation');

                mobilePlayerView.showNavigation();
            });

            it('should show the toc buttons', function() {
                mobilePlayerView.tocButtons.forEach(button => expect(button.show).toHaveBeenCalled());
            });

            it('should call super()', function() {
                expect(PlayerView.prototype.showNavigation).toHaveBeenCalled();
            });
        });

        describe('hideChrome()', function() {
            beforeEach(function() {
                mobilePlayerView.chromeItems = [new HideableView(), new HideableView(), new HideableView()];
                mobilePlayerView.chromeItems.forEach(view => spyOn(view, 'hide'));
                spyOn(mobilePlayerView, 'hidePaginators');

                mobilePlayerView.hideChrome();
            });

            it('should hide the navigation', function() {
                expect(mobilePlayerView.hidePaginators).toHaveBeenCalled();
            });

            it('should hide the navbar, landscapeLeftSidebar and closeButtons', function() {
                mobilePlayerView.chromeItems.forEach(view => expect(view.hide).toHaveBeenCalled());
            });
        });

        describe('showChrome()', function() {
            beforeEach(function() {
                mobilePlayerView.chromeItems = [new HideableView(), new HideableView(), new HideableView()];
                mobilePlayerView.chromeItems.forEach(view => spyOn(view, 'show'));
                spyOn(mobilePlayerView, 'showPaginators');

                mobilePlayerView.showChrome();
            });

            it('should show the navigation', function() {
                expect(mobilePlayerView.showPaginators).toHaveBeenCalled();
            });

            it('should hide the navbar, landscapeLeftSidebar and closeButtons', function() {
                mobilePlayerView.chromeItems.forEach(view => expect(view.show).toHaveBeenCalled());
            });
        });

        describe('update(data)', function() {
            let data;

            beforeEach(function() {
                data = {
                    thumbs: {
                        next: 'next-thumb.jpg',
                        previous: 'prev-thumb.jpg'
                    }
                };
                spyOn(PlayerView.prototype, 'update').and.callThrough();

                Runner.run(() => mobilePlayerView.create());

                mobilePlayerView.navItems.forEach(button => {
                    spyOn(button, 'setThumb').and.callThrough();
                });

                Runner.run(() => mobilePlayerView.update(data));
            });

            describe('when called without thumb info', function() {
                beforeEach(function() {
                    data = { title: 'My MiniReel' };
                    PlayerView.prototype.update.calls.reset();

                    Runner.run(() => mobilePlayerView.update(data));
                });

                it('should call super()', function() {
                    expect(PlayerView.prototype.update).toHaveBeenCalledWith(data);
                });
            });

            it('should call super()', function() {
                expect(PlayerView.prototype.update).toHaveBeenCalledWith(data);
            });

            it('should set the thumbnails for the buttons', function() {
                mobilePlayerView.nextButtons.forEach(button => expect(button.setThumb).toHaveBeenCalledWith(data.thumbs.next));
                mobilePlayerView.previousButtons.forEach(button => expect(button.setThumb).toHaveBeenCalledWith(data.thumbs.previous));
            });
        });
    });

    describe('hooks:', function() {
        describe('didCreateElement()', function() {
            beforeEach(function() {
                spyOn(mobilePlayerView, 'enableNavigation');
                Runner.run(() => mobilePlayerView.create());
            });

            it('should populate nextButtons', function() {
                expect(mobilePlayerView.nextButtons).toEqual([mobilePlayerView.nextButton, mobilePlayerView.landscapeNextButton]);
            });

            it('should populate previousButtons', function() {
                expect(mobilePlayerView.previousButtons).toEqual([mobilePlayerView.previousButton, mobilePlayerView.landscapePreviousButton]);
            });

            it('should populate closeButtons', function() {
                expect(mobilePlayerView.closeButtons).toEqual([mobilePlayerView.closeButton, mobilePlayerView.landscapeCloseButton]);
            });

            it('should populate tocButtons', function() {
                expect(mobilePlayerView.tocButtons).toEqual([mobilePlayerView.tocButton, mobilePlayerView.landscapeTocButton]);
            });

            it('should populate skipTimers', function() {
                expect(mobilePlayerView.skipTimers).toEqual([mobilePlayerView.skipTimer, mobilePlayerView.landscapeSkipTimer, mobilePlayerView.closeSkipTimer]);
            });

            it('should populate navItems', function() {
                expect(mobilePlayerView.navItems).toEqual([].concat(mobilePlayerView.nextButtons, mobilePlayerView.previousButtons));
            });

            it('should populate chromeItems', function() {
                expect(mobilePlayerView.chromeItems).toEqual([mobilePlayerView.navbar, mobilePlayerView.landscapeLeftSidebar].concat(mobilePlayerView.closeButtons));
            });

            it('should enable navigation', function() {
                expect(mobilePlayerView.enableNavigation).toHaveBeenCalled();
            });
        });
    });
});
