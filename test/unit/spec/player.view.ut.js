describe('PlayerView', function() {
    import TemplateView from '../../../lib/core/TemplateView.js';
    import View from '../../../lib/core/View.js';
    import PlayerView from '../../../src/views/PlayerView.js';
    import TOCButtonView from '../../../src/views/TOCButtonView.js';
    import CloseButtonView from '../../../src/views/CloseButtonView.js';
    import NavButtonView from '../../../src/views/NavButtonView.js';
    import NavbarView from '../../../src/views/NavbarView.js';
    import SkipTimerView from '../../../src/views/SkipTimerView.js';
    import Runner from '../../../lib/Runner.js';
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

        describe('template', function() {
            it('should be an external HTML template', function() {
                expect(playerView.template).toBe(require('../../../src/views/PlayerView.html'));
            });
        });

        describe('cards', function() {
            beforeEach(function() {
                Runner.run(() => playerView.create());
            });

            it('should be a view', function() {
                expect(playerView.cards).toEqual(jasmine.any(View));
            });
        });

        describe('toc', function() {
            beforeEach(function() {
                Runner.run(() => playerView.create());
            });

            it('should be a view', function() {
                expect(playerView.toc).toEqual(jasmine.any(View));
            });
        });

        describe('navbar', function() {
            beforeEach(function() {
                Runner.run(() => playerView.create());
            });

            it('should be a NavbarView', function() {
                expect(playerView.navbar).toEqual(jasmine.any(NavbarView));
            });
        });

        describe('landscapeLeftSidebar', function() {
            beforeEach(function() {
                Runner.run(() => playerView.create());
            });

            it('should be a NavbarView', function() {
                expect(playerView.landscapeLeftSidebar).toEqual(jasmine.any(NavbarView));
            });
        });

        describe('closeButton', function() {
            beforeEach(function() {
                Runner.run(() => playerView.create());
            });

            it('should be a ButtonView', function() {
                expect(playerView.closeButton).toEqual(jasmine.any(CloseButtonView));
            });

            describe('events:', function() {
                describe('press', function() {
                    let spy;

                    beforeEach(function() {
                        spy = jasmine.createSpy('spy()');
                        playerView.on('close', spy);

                        playerView.closeButton.emit('press');
                    });

                    it('should emit the close event', function() {
                        expect(spy).toHaveBeenCalled();
                    });
                });
            });
        });

        describe('landscapeCloseButton', function() {
            beforeEach(function() {
                Runner.run(() => playerView.create());
            });

            it('should be a ButtonView', function() {
                expect(playerView.landscapeCloseButton).toEqual(jasmine.any(CloseButtonView));
            });

            describe('events:', function() {
                describe('press', function() {
                    let spy;

                    beforeEach(function() {
                        spy = jasmine.createSpy('spy()');
                        playerView.on('close', spy);

                        playerView.landscapeCloseButton.emit('press');
                    });

                    it('should emit the close event', function() {
                        expect(spy).toHaveBeenCalled();
                    });
                });
            });
        });

        describe('tocButton', function() {
            beforeEach(function() {
                Runner.run(() => playerView.create());
            });

            it('should be a ButtonView', function() {
                expect(playerView.tocButton).toEqual(jasmine.any(TOCButtonView));
            });

            describe('events:', function() {
                describe('press', function() {
                    let spy;

                    beforeEach(function() {
                        spy = jasmine.createSpy('spy()');
                        playerView.on('toggleToc', spy);

                        playerView.tocButton.emit('press');
                    });

                    it('should emit the toggleToc event', function() {
                        expect(spy).toHaveBeenCalled();
                    });
                });
            });
        });

        describe('landscapeTocButton', function() {
            beforeEach(function() {
                Runner.run(() => playerView.create());
            });

            it('should be a ButtonView', function() {
                expect(playerView.landscapeTocButton).toEqual(jasmine.any(TOCButtonView));
            });

            describe('events:', function() {
                describe('press', function() {
                    let spy;

                    beforeEach(function() {
                        spy = jasmine.createSpy('spy()');
                        playerView.on('toggleToc', spy);

                        playerView.landscapeTocButton.emit('press');
                    });

                    it('should emit the toggleToc event', function() {
                        expect(spy).toHaveBeenCalled();
                    });
                });
            });
        });

        describe('nextButton', function() {
            beforeEach(function() {
                Runner.run(() => playerView.create());
            });

            it('should be a NavButtonView', function() {
                expect(playerView.nextButton).toEqual(jasmine.any(NavButtonView));
            });

            describe('events:', function() {
                describe('press', function() {
                    let spy;

                    beforeEach(function() {
                        spy = jasmine.createSpy('spy()');
                        playerView.on('next', spy);

                        playerView.nextButton.emit('press');
                    });

                    it('should emit the next event', function() {
                        expect(spy).toHaveBeenCalled();
                    });
                });
            });
        });

        describe('landscapeNextButton', function() {
            beforeEach(function() {
                Runner.run(() => playerView.create());
            });

            it('should be a NavButtonView', function() {
                expect(playerView.landscapeNextButton).toEqual(jasmine.any(NavButtonView));
            });

            describe('events:', function() {
                describe('press', function() {
                    let spy;

                    beforeEach(function() {
                        spy = jasmine.createSpy('spy()');
                        playerView.on('next', spy);

                        playerView.landscapeNextButton.emit('press');
                    });

                    it('should emit the next event', function() {
                        expect(spy).toHaveBeenCalled();
                    });
                });
            });
        });

        describe('previousButton', function() {
            beforeEach(function() {
                Runner.run(() => playerView.create());
            });

            it('should be a NavButtonView', function() {
                expect(playerView.previousButton).toEqual(jasmine.any(NavButtonView));
            });

            describe('events:', function() {
                describe('press', function() {
                    let spy;

                    beforeEach(function() {
                        spy = jasmine.createSpy('spy()');
                        playerView.on('previous', spy);

                        playerView.previousButton.emit('press');
                    });

                    it('should emit the previous event', function() {
                        expect(spy).toHaveBeenCalled();
                    });
                });
            });
        });

        describe('landscapePreviousButton', function() {
            beforeEach(function() {
                Runner.run(() => playerView.create());
            });

            it('should be a NavButtonView', function() {
                expect(playerView.landscapePreviousButton).toEqual(jasmine.any(NavButtonView));
            });

            describe('events:', function() {
                describe('press', function() {
                    let spy;

                    beforeEach(function() {
                        spy = jasmine.createSpy('spy()');
                        playerView.on('previous', spy);

                        playerView.landscapePreviousButton.emit('press');
                    });

                    it('should emit the previous event', function() {
                        expect(spy).toHaveBeenCalled();
                    });
                });
            });
        });

        describe('skipTimer', function() {
            beforeEach(function() {
                Runner.run(() => playerView.create());
            });

            it('should be a SkipTimerView', function() {
                expect(playerView.skipTimer).toEqual(jasmine.any(SkipTimerView));
            });
        });

        describe('landscapeSkipTimer', function() {
            beforeEach(function() {
                Runner.run(() => playerView.create());
            });

            it('should be a SkipTimerView', function() {
                expect(playerView.landscapeSkipTimer).toEqual(jasmine.any(SkipTimerView));
            });
        });
    });

    describe('methods:', function() {
        describe('disableNavigation()', function() {
            beforeEach(function() {
                Runner.run(() => playerView.create());
                spyOn(playerView.skipTimer, 'show');
                spyOn(playerView.landscapeSkipTimer, 'show');
                spyOn(playerView, 'hideNavigation');

                playerView.disableNavigation();
            });

            it('should show the skip timers', function() {
                [playerView.skipTimer.show, playerView.landscapeSkipTimer.show].forEach(spy => expect(spy).toHaveBeenCalled());
            });

            it('should hide the navigation', function() {
                expect(playerView.hideNavigation).toHaveBeenCalled();
            });
        });

        describe('enableNavigation()', function() {
            beforeEach(function() {
                Runner.run(() => playerView.create());
                spyOn(playerView.skipTimer, 'hide');
                spyOn(playerView.landscapeSkipTimer, 'hide');
                spyOn(playerView, 'showNavigation');

                playerView.enableNavigation();
            });

            it('should hide the skip timers', function() {
                [playerView.skipTimer.hide, playerView.landscapeSkipTimer.hide].forEach(spy => expect(spy).toHaveBeenCalled());
            });

            it('should show the navigation', function() {
                expect(playerView.showNavigation).toHaveBeenCalled();
            });
        });

        describe('updateSkipTimer(time)', function() {
            beforeEach(function() {
                Runner.run(() => playerView.create());
                spyOn(playerView.skipTimer, 'update');
                spyOn(playerView.landscapeSkipTimer, 'update');

                playerView.updateSkipTimer(5);
            });

            it('should update the skip timers', function() {
                [playerView.skipTimer.update, playerView.landscapeSkipTimer.update].forEach(spy => expect(spy).toHaveBeenCalledWith(5));
            });
        });

        describe('hideNavigation()', function() {
            beforeEach(function() {
                Runner.run(() => playerView.create());
                [playerView.tocButton, playerView.landscapeTocButton].forEach(button => spyOn(button, 'hide'));
                spyOn(playerView, 'hidePaginators');

                playerView.hideNavigation();
            });

            it('should hide the toc buttons', function() {
                [playerView.tocButton, playerView.landscapeTocButton].forEach(button => expect(button.hide).toHaveBeenCalled());
            });

            it('should hide the paginators', function() {
                expect(playerView.hidePaginators).toHaveBeenCalled();
            });
        });

        describe('showNavigation()', function() {
            beforeEach(function() {
                Runner.run(() => playerView.create());
                [playerView.tocButton, playerView.landscapeTocButton].forEach(button => spyOn(button, 'show'));
                spyOn(playerView, 'showPaginators');

                playerView.showNavigation();
            });

            it('should show the toc buttons', function() {
                [playerView.tocButton, playerView.landscapeTocButton].forEach(button => expect(button.show).toHaveBeenCalled());
            });

            it('should show the paginators', function() {
                expect(playerView.showPaginators).toHaveBeenCalled();
            });
        });

        describe('hideChrome()', function() {
            beforeEach(function() {
                Runner.run(() => playerView.create());
                [playerView.navbar, playerView.landscapeLeftSidebar].concat(playerView.closeButtons).forEach(view => spyOn(view, 'hide'));
                spyOn(playerView, 'hidePaginators');

                playerView.hideChrome();
            });

            it('should hide the navigation', function() {
                expect(playerView.hidePaginators).toHaveBeenCalled();
            });

            it('should hide the navbar, landscapeLeftSidebar and closeButtons', function() {
                [playerView.navbar, playerView.landscapeLeftSidebar].concat(playerView.closeButtons).forEach(view => expect(view.hide).toHaveBeenCalled());
            });
        });

        describe('showChrome()', function() {
            beforeEach(function() {
                Runner.run(() => playerView.create());
                [playerView.navbar, playerView.landscapeLeftSidebar].concat(playerView.closeButtons).forEach(view => spyOn(view, 'show'));
                spyOn(playerView, 'showPaginators');

                playerView.showChrome();
            });

            it('should show the navigation', function() {
                expect(playerView.showPaginators).toHaveBeenCalled();
            });

            it('should hide the navbar, landscapeLeftSidebar and closeButtons', function() {
                [playerView.navbar, playerView.landscapeLeftSidebar].concat(playerView.closeButtons).forEach(view => expect(view.show).toHaveBeenCalled());
            });
        });

        describe('hidePaginators()', function() {
            beforeEach(function() {
                Runner.run(() => playerView.create());
                [].concat(playerView.nextButtons, playerView.previousButtons).forEach(view => spyOn(view, 'hide'));

                playerView.hidePaginators();
            });

            it('should hide the next and previous buttons', function() {
                [].concat(playerView.nextButtons, playerView.previousButtons).forEach(view => expect(view.hide).toHaveBeenCalled());
            });
        });

        describe('showPaginators()', function() {
            beforeEach(function() {
                Runner.run(() => playerView.create());
                [].concat(playerView.nextButtons, playerView.previousButtons).forEach(view => spyOn(view, 'show'));

                playerView.showPaginators();
            });

            it('should hide the next and previous buttons', function() {
                [].concat(playerView.nextButtons, playerView.previousButtons).forEach(view => expect(view.show).toHaveBeenCalled());
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

            beforeEach(function() {
                data = {
                    title: 'title',
                    foo: 'bar',
                    canGoForward: true,
                    canGoBack: true,
                    thumbs: {
                        next: 'next-thumb.jpg',
                        previous: 'prev-thumb.jpg'
                    }
                };
                spyOn(TemplateView.prototype, 'update').and.callThrough();

                Runner.run(() => playerView.create());

                [playerView.nextButton, playerView.landscapeNextButton, playerView.previousButton, playerView.landscapePreviousButton].forEach(button => {
                    spyOn(button, 'enable').and.callThrough();
                    spyOn(button, 'setThumb').and.callThrough();
                });

                Runner.run(() => playerView.update(data));
            });

            it('should call super()', function() {
                expect(TemplateView.prototype.update).toHaveBeenCalledWith(data);
            });

            it('should enable all of the buttons', function() {
                expect(playerView.nextButton.enable).toHaveBeenCalled();
                expect(playerView.landscapeNextButton.enable).toHaveBeenCalled();
                expect(playerView.previousButton.enable).toHaveBeenCalled();
                expect(playerView.landscapePreviousButton.enable).toHaveBeenCalled();
            });

            it('should set the thumbnails for the buttons', function() {
                expect(playerView.nextButton.setThumb).toHaveBeenCalledWith(data.thumbs.next);
                expect(playerView.landscapeNextButton.setThumb).toHaveBeenCalledWith(data.thumbs.next);
                expect(playerView.previousButton.setThumb).toHaveBeenCalledWith(data.thumbs.previous);
                expect(playerView.landscapePreviousButton.setThumb).toHaveBeenCalledWith(data.thumbs.previous);
            });

            describe('if the minireel can\'t go forward', function() {
                beforeEach(function() {
                    data.canGoForward = false;
                    playerView.nextButton.enable.calls.reset();
                    playerView.landscapeNextButton.enable.calls.reset();
                    playerView.previousButton.enable.calls.reset();
                    playerView.landscapePreviousButton.enable.calls.reset();

                    spyOn(playerView.nextButton, 'disable').and.callThrough();
                    spyOn(playerView.landscapeNextButton, 'disable').and.callThrough();
                    spyOn(playerView.previousButton, 'disable').and.callThrough();
                    spyOn(playerView.landscapePreviousButton, 'disable').and.callThrough();

                    Runner.run(() => playerView.update(data));
                });

                it('should disable the next buttons and enable the previous buttons', function() {
                    expect(playerView.nextButton.enable).not.toHaveBeenCalled();
                    expect(playerView.landscapeNextButton.enable).not.toHaveBeenCalled();
                    expect(playerView.previousButton.disable).not.toHaveBeenCalled();
                    expect(playerView.landscapePreviousButton.disable).not.toHaveBeenCalled();

                    expect(playerView.nextButton.disable).toHaveBeenCalled();
                    expect(playerView.landscapeNextButton.disable).toHaveBeenCalled();
                    expect(playerView.previousButton.enable).toHaveBeenCalled();
                    expect(playerView.landscapePreviousButton.enable).toHaveBeenCalled();
                });
            });

            describe('if the minireel can\'t go back', function() {
                beforeEach(function() {
                    data.canGoBack = false;
                    playerView.nextButton.enable.calls.reset();
                    playerView.landscapeNextButton.enable.calls.reset();
                    playerView.previousButton.enable.calls.reset();
                    playerView.landscapePreviousButton.enable.calls.reset();

                    spyOn(playerView.nextButton, 'disable').and.callThrough();
                    spyOn(playerView.landscapeNextButton, 'disable').and.callThrough();
                    spyOn(playerView.previousButton, 'disable').and.callThrough();
                    spyOn(playerView.landscapePreviousButton, 'disable').and.callThrough();

                    Runner.run(() => playerView.update(data));
                });

                it('should disable the next buttons and enable the previous buttons', function() {
                    expect(playerView.nextButton.disable).not.toHaveBeenCalled();
                    expect(playerView.landscapeNextButton.disable).not.toHaveBeenCalled();
                    expect(playerView.previousButton.enable).not.toHaveBeenCalled();
                    expect(playerView.landscapePreviousButton.enable).not.toHaveBeenCalled();

                    expect(playerView.nextButton.enable).toHaveBeenCalled();
                    expect(playerView.landscapeNextButton.enable).toHaveBeenCalled();
                    expect(playerView.previousButton.disable).toHaveBeenCalled();
                    expect(playerView.landscapePreviousButton.disable).toHaveBeenCalled();
                });
            });
        });
    });

    describe('hooks:', function() {
        describe('didCreateElement()', function() {
            beforeEach(function() {
                spyOn(playerView, 'enableNavigation');
                Runner.run(() => playerView.create());
            });

            it('should enable navigation', function() {
                expect(playerView.enableNavigation).toHaveBeenCalled();
            });
        });
    });
});
