describe('PlayerController', function() {
    import cinema6 from '../../../src/services/cinema6.js';
    import PlayerController from '../../../src/controllers/PlayerController.js';
    import Controller from '../../../lib/core/Controller.js';
    import ApplicationView from '../../../src/views/ApplicationView.js';
    import PlayerView from '../../../src/views/PlayerView.js';
    import MiniReel from '../../../src/models/MiniReel.js';
    import TextCard from '../../../src/models/TextCard.js';
    import VideoCard from '../../../src/models/VideoCard.js';
    import RecapCard from '../../../src/models/RecapCard.js';
    import CardController from '../../../src/controllers/CardController.js';
    import TextCardController from '../../../src/controllers/TextCardController.js';
    import VideoCardController from '../../../src/controllers/VideoCardController.js';
    import RecapCardController from '../../../src/controllers/RecapCardController.js';
    import TableOfContentsViewController from '../../../src/controllers/TableOfContentsViewController.js';
    import View from '../../../lib/core/View.js';
    import Card from '../../../src/models/Card.js';
    import Runner from '../../../lib/Runner.js';
    let PlayerCtrl;

    let applicationView;
    let session;
    let experience;

    beforeEach(function() {
        cinema6.constructor();

        experience = {
            data: {
                collateral: {}
            }
        };

        const init = cinema6.init;
        spyOn(cinema6, 'init').and.callFake(function() {
            return (session = init.apply(cinema6, arguments));
        });

        applicationView = new ApplicationView(document.createElement('body'));

        Runner.run(() => PlayerCtrl = new PlayerController(applicationView));
    });

    it('should be a controller', function() {
        expect(PlayerCtrl).toEqual(jasmine.any(Controller));
    });

    it('should initialize a cinema6 session', function() {
        expect(cinema6.init).toHaveBeenCalled();
    });

    describe('properties:', function() {
        describe('session', function() {
            it('should be the cinema6 session', function() {
                expect(PlayerCtrl.session).toBe(session);
            });
        });

        describe('view', function() {
            it('should be a PlayerView', function() {
                expect(PlayerCtrl.view).toEqual(jasmine.any(PlayerView));
            });

            describe('events:', function() {
                describe('next', function() {
                    beforeEach(function() {
                        spyOn(PlayerCtrl.minireel, 'next');
                        PlayerCtrl.view.emit('next');
                    });

                    it('should go to the next card in the MiniReel', function() {
                        expect(PlayerCtrl.minireel.next).toHaveBeenCalled();
                    });
                });

                describe('previous', function() {
                    beforeEach(function() {
                        spyOn(PlayerCtrl.minireel, 'previous');
                        PlayerCtrl.view.emit('previous');
                    });

                    it('should go to the previous card in the MiniReel', function() {
                        expect(PlayerCtrl.minireel.previous).toHaveBeenCalled();
                    });
                });

                describe('close', function() {
                    beforeEach(function() {
                        spyOn(PlayerCtrl.minireel, 'close');
                        PlayerCtrl.view.emit('close');
                    });

                    it('should close the minireel', function() {
                        expect(PlayerCtrl.minireel.close).toHaveBeenCalled();
                    });
                });

                describe('toggleToc', function() {
                    beforeEach(function() {
                        PlayerCtrl.minireel.deck = [new TextCard({ data: {} }, experience)];
                        Runner.run(() => PlayerCtrl.minireel.emit('init'));
                        spyOn(PlayerCtrl.TableOfContentsViewCtrl, 'toggle');

                        PlayerCtrl.view.emit('toggleToc');
                    });

                    it('should toggle the ToC', function() {
                        expect(PlayerCtrl.TableOfContentsViewCtrl.toggle).toHaveBeenCalled();
                    });
                });
            });
        });

        describe('TableOfContentsViewCtrl', function() {
            it('should be a TableOfContentsViewController', function() {
                expect(PlayerCtrl.TableOfContentsViewCtrl).toEqual(jasmine.any(TableOfContentsViewController));
            });

            describe('events:', function() {
                describe('show', function() {
                    beforeEach(function() {
                        spyOn(PlayerCtrl.view, 'hideNavigation');
                        PlayerCtrl.TableOfContentsViewCtrl.emit('show');
                    });

                    it('should hide the navigation', function() {
                        expect(PlayerCtrl.view.hideNavigation).toHaveBeenCalled();
                    });
                });

                describe('hide', function() {
                    beforeEach(function() {
                        spyOn(PlayerCtrl.view, 'showNavigation');
                        PlayerCtrl.TableOfContentsViewCtrl.emit('hide');
                    });

                    it('should show the navigation', function() {
                        expect(PlayerCtrl.view.showNavigation).toHaveBeenCalled();
                    });
                });
            });
        });

        describe('cardCtrls', function() {
            it('should be an empty array', function() {
                expect(PlayerCtrl.cardCtrls).toEqual([]);
            });
        });

        describe('minireel', function() {
            it('should be a MiniReel', function() {
                expect(PlayerCtrl.minireel).toEqual(jasmine.any(MiniReel));
            });

            describe('events:', function() {
                describe('init', function() {
                    beforeEach(function() {
                        spyOn(PlayerCtrl.view, 'appendTo');
                        spyOn(PlayerCtrl, 'updateView');

                        PlayerCtrl.minireel.deck = [
                            new TextCard({ data: {} }, experience),
                            new VideoCard({ type: 'youtube', collateral: {}, data: {}, params: {} }, experience),
                            new VideoCard({ type: 'youtube', collateral: {}, data: {}, params: {} }, experience),
                            new VideoCard({ type: 'youtube', collateral: {}, data: {}, params: {} }, experience),
                            new RecapCard({}, experience, PlayerCtrl.minireel)
                        ];
                        spyOn(CardController.prototype, 'render');
                        spyOn(VideoCardController.prototype, 'render').and.callThrough();
                        spyOn(RecapCardController.prototype, 'render').and.callThrough();
                        PlayerCtrl.view.cards = new View();
                        PlayerCtrl.view.toc = new View();
                        spyOn(TableOfContentsViewController.prototype, 'renderInto');

                        Runner.run(() => PlayerCtrl.minireel.emit('init'));
                    });

                    it('should update its view', function() {
                        expect(PlayerCtrl.updateView).toHaveBeenCalled();
                    });

                    it('should render the TableOfContentsViewCtrl into the view.toc', function() {
                        expect(PlayerCtrl.TableOfContentsViewCtrl.renderInto).toHaveBeenCalledWith(PlayerCtrl.view.toc);
                    });

                    it('should create a CardController based on the type of card', function() {
                        expect(PlayerCtrl.cardCtrls).toEqual([
                            jasmine.any(TextCardController),
                            jasmine.any(VideoCardController),
                            jasmine.any(VideoCardController),
                            jasmine.any(VideoCardController),
                            jasmine.any(RecapCardController)
                        ]);
                        PlayerCtrl.cardCtrls.forEach((Ctrl, index) => {
                            expect(Ctrl.model).toBe(PlayerCtrl.minireel.deck[index]);
                        });
                    });

                    it('should only render the first card', function() {
                        expect(CardController.prototype.render.calls.count()).toBe(1);
                        expect(PlayerCtrl.cardCtrls[0].render.calls.mostRecent().object).toBe(PlayerCtrl.cardCtrls[0]);
                    });

                    it('should append its view to the provided view', function() {
                        expect(PlayerCtrl.view.appendTo).toHaveBeenCalledWith(applicationView);
                    });
                });

                describe('move', function() {
                    beforeEach(function() {
                        spyOn(PlayerCtrl, 'updateView');
                        PlayerCtrl.minireel.emit('move');
                    });

                    it('should call updateView()', function() {
                        expect(PlayerCtrl.updateView).toHaveBeenCalled();
                    });
                });

                describe('launch', function() {
                    beforeEach(function() {
                        spyOn(cinema6, 'fullscreen');

                        PlayerCtrl.minireel.deck = [
                            new TextCard({ data: {} }, experience),
                            new VideoCard({ type: 'youtube', collateral: {}, data: {}, params: {} }, experience),
                            new VideoCard({ type: 'youtube', collateral: {}, data: {}, params: {} }, experience),
                            new VideoCard({ type: 'youtube', collateral: {}, data: {}, params: {} }, experience),
                            new RecapCard({}, experience, PlayerCtrl.minireel)
                        ];

                        Runner.run(() => PlayerCtrl.minireel.emit('init'));

                        PlayerCtrl.cardCtrls.forEach(Ctrl => spyOn(Ctrl, 'render'));
                        Runner.run(() => PlayerCtrl.minireel.emit('launch'));
                    });

                    it('should enter fullscreen mode', function() {
                        expect(cinema6.fullscreen).toHaveBeenCalledWith(true);
                    });

                    it('should render the remaining card ctrls', function() {
                        expect(PlayerCtrl.cardCtrls[0].render).not.toHaveBeenCalled();
                        PlayerCtrl.cardCtrls.slice(1).forEach(Ctrl => expect(Ctrl.render).toHaveBeenCalled());
                    });
                });

                describe('close', function() {
                    beforeEach(function() {
                        spyOn(cinema6, 'fullscreen');
                        PlayerCtrl.minireel.emit('close');
                    });

                    it('should leave fullscreen mode', function() {
                        expect(cinema6.fullscreen).toHaveBeenCalledWith(false);
                    });
                });
            });
        });
    });

    describe('methods', function() {
        describe('updateView()', function() {
            beforeEach(function() {
                spyOn(PlayerCtrl.view, 'update');

                PlayerCtrl.minireel.title = 'My Awesome MiniReel';
                PlayerCtrl.minireel.deck = [
                    new Card({
                        thumbs: {
                            small: 'first-thumb.jpg'
                        }
                    }),
                    new Card({
                        thumbs: {
                            small: 'second-thumb.jpg'
                        }
                    }),
                    new Card({
                        thumbs: {
                            small: 'third-thumb.jpg'
                        }
                    }),
                    new Card({
                        thumbs: {
                            small: 'fourth-thumb.jpg'
                        }
                    }),
                    new Card({
                        thumbs: {
                            small: 'fifth-thumb.jpg'
                        }
                    })
                ];
                PlayerCtrl.minireel.length = 5;
                PlayerCtrl.minireel.currentIndex = 3;

                PlayerCtrl.updateView();
            });

            it('should update its view', function() {
                expect(PlayerCtrl.view.update).toHaveBeenCalledWith({
                    title: PlayerCtrl.minireel.title,
                    totalCards: PlayerCtrl.minireel.length,
                    currentCardNumber: (PlayerCtrl.minireel.currentIndex + 1).toString(),
                    canGoForward: jasmine.any(Boolean),
                    canGoBack: jasmine.any(Boolean),
                    thumbs: {
                        next: 'fifth-thumb.jpg',
                        previous: 'third-thumb.jpg'
                    }
                });
            });

            describe('if called before the first slide', function() {
                beforeEach(function() {
                    PlayerCtrl.minireel.currentIndex = -1;
                    PlayerCtrl.view.update.calls.reset();

                    PlayerCtrl.updateView();
                });

                it('should make the previous thumb null', function() {
                    expect(PlayerCtrl.view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        thumbs: {
                            next: 'first-thumb.jpg',
                            previous: null
                        }
                    }));
                });

                it('should tell the view it can\'t go back', function() {
                    expect(PlayerCtrl.view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        canGoForward: true,
                        canGoBack: false
                    }));
                });
            });

            describe('if called on the last slide', function() {
                beforeEach(function() {
                    PlayerCtrl.minireel.currentIndex = 4;
                    PlayerCtrl.view.update.calls.reset();

                    PlayerCtrl.updateView();
                });

                it('should make the next thumb null', function() {
                    expect(PlayerCtrl.view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        thumbs: {
                            next: null,
                            previous: 'fourth-thumb.jpg'
                        }
                    }));
                });

                it('should tell the view it can\'t go forward', function() {
                    expect(PlayerCtrl.view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        canGoForward: false,
                        canGoBack: true
                    }));
                });
            });
        });
    });
});
