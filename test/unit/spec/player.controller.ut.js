describe('PlayerController', function() {
    import cinema6 from '../../../src/services/cinema6.js';
    import PlayerController from '../../../src/controllers/PlayerController.js';
    import Controller from '../../../lib/core/Controller.js';
    import ApplicationView from '../../../src/views/ApplicationView.js';
    import MiniReel from '../../../src/models/MiniReel.js';
    import TextCard from '../../../src/models/TextCard.js';
    import VideoCard from '../../../src/models/VideoCard.js';
    import RecapCard from '../../../src/models/RecapCard.js';
    import View from '../../../lib/core/View.js';
    import Card from '../../../src/models/Card.js';
    import Runner from '../../../lib/Runner.js';
    import TemplateView from '../../../lib/core/TemplateView.js';
    let PlayerCtrl;

    let applicationView;
    let session;
    let experience;

    class CardController {
        constructor(model, parentView) {
            this.model = model;
            this.parentView = parentView;
        }

        render() {}
    }

    class VideoCardController extends CardController {}
    class TextCardController extends CardController {}
    class RecapCardController extends CardController {}

    class PlayerView extends TemplateView {
        constructor() {
            super(...arguments);

            this.tag = 'div';

            this.cards = new View();
            this.cards.tag = 'div';
        }

        disableNavigation() {}
        enableNavigation() {}
        updateSkipTimer() {}
    }

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
        PlayerCtrl.view = new PlayerView();
        PlayerCtrl.CardControllers = {
            text: TextCardController,
            video: VideoCardController,
            recap: RecapCardController
        };
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

        describe('cardCtrls', function() {
            it('should be an empty array', function() {
                expect(PlayerCtrl.cardCtrls).toEqual([]);
            });
        });

        describe('CardControllers', function() {
            beforeEach(function() {
                PlayerCtrl = new PlayerController(applicationView);
            });

            it('should be an object', function() {
                expect(PlayerCtrl.CardControllers).toEqual({});
            });
        });

        describe('minireel', function() {
            it('should be a MiniReel', function() {
                expect(PlayerCtrl.minireel).toEqual(jasmine.any(MiniReel));
            });
        });
    });

    describe('events:', function() {
        describe('minireel', function() {
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

                    Runner.run(() => PlayerCtrl.minireel.emit('init'));
                });

                it('should update its view', function() {
                    expect(PlayerCtrl.updateView).toHaveBeenCalled();
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
                        expect(Ctrl.parentView).toBe(PlayerCtrl.view.cards);
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
                    spyOn(PlayerCtrl, 'updateView');

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

                it('should render the remaining card ctrls', function() {
                    expect(PlayerCtrl.cardCtrls[0].render).not.toHaveBeenCalled();
                    PlayerCtrl.cardCtrls.slice(1).forEach(Ctrl => expect(Ctrl.render).toHaveBeenCalled());
                });
            });

            describe('becameUnskippable', function() {
                beforeEach(function() {
                    spyOn(PlayerCtrl.view, 'disableNavigation');

                    PlayerCtrl.minireel.emit('becameUnskippable');
                });

                it('should disable the navigation', function() {
                    expect(PlayerCtrl.view.disableNavigation).toHaveBeenCalled();
                });
            });

            describe('becameSkippable', function() {
                beforeEach(function() {
                    spyOn(PlayerCtrl.view, 'enableNavigation');

                    PlayerCtrl.minireel.emit('becameSkippable');
                });

                it('should enable the navigation', function() {
                    expect(PlayerCtrl.view.enableNavigation).toHaveBeenCalled();
                });
            });

            describe('skippableProgress', function() {
                beforeEach(function() {
                    spyOn(PlayerCtrl.view, 'updateSkipTimer');

                    PlayerCtrl.minireel.emit('skippableProgress', 11);
                });

                it('should update the skip timer', function() {
                    expect(PlayerCtrl.view.updateSkipTimer).toHaveBeenCalledWith(11);
                });
            });
        });
    });

    describe('methods', function() {
        describe('next()', function() {
            beforeEach(function() {
                spyOn(PlayerCtrl.minireel, 'next');

                PlayerCtrl.next();
            });

            it('should call next() on the minireel', function() {
                expect(PlayerCtrl.minireel.next).toHaveBeenCalled();
            });
        });

        describe('previous()', function() {
            beforeEach(function() {
                spyOn(PlayerCtrl.minireel, 'previous');

                PlayerCtrl.previous();
            });

            it('should call previous() on the minireel', function() {
                expect(PlayerCtrl.minireel.previous).toHaveBeenCalled();
            });
        });

        describe('close()', function() {
            beforeEach(function() {
                spyOn(PlayerCtrl.minireel, 'close');

                PlayerCtrl.close();
            });

            it('should call close() on the minireel', function() {
                expect(PlayerCtrl.minireel.close).toHaveBeenCalled();
            });
        });

        describe('updateView()', function() {
            beforeEach(function() {
                spyOn(PlayerCtrl.view, 'update');

                PlayerCtrl.minireel.standalone = false;
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

                PlayerCtrl.minireel.sponsor = 'Netflix';
                PlayerCtrl.minireel.logo = 'http://www.images.com/netflix-logo.jpg';
                PlayerCtrl.minireel.socialLinks = [
                    { type: 'youtube', label: 'YouTube', href: 'yt.com' },
                    { type: 'facebook', label: 'Facebook', href: 'fb.com' }
                ];
                PlayerCtrl.minireel.links = {
                    Website: 'http://www.netflix.com'
                };

                PlayerCtrl.minireel.currentIndex = 3;

                PlayerCtrl.updateView();
            });

            it('should update its view', function() {
                expect(PlayerCtrl.view.update).toHaveBeenCalledWith({
                    title: PlayerCtrl.minireel.title,
                    sponsor: PlayerCtrl.minireel.sponsor,
                    logo: PlayerCtrl.minireel.logo,
                    links: PlayerCtrl.minireel.socialLinks,
                    website: PlayerCtrl.minireel.links.Website,
                    isSponsored: jasmine.any(Boolean),
                    hasLinks: jasmine.any(Boolean),
                    totalCards: PlayerCtrl.minireel.length,
                    currentCardNumber: (PlayerCtrl.minireel.currentIndex + 1).toString(),
                    canGoForward: jasmine.any(Boolean),
                    canGoBack: jasmine.any(Boolean)
                });
            });

            describe('isSponsored', function() {
                let minireel;
                let view;

                beforeEach(function() {
                    minireel = PlayerCtrl.minireel;
                    view = PlayerCtrl.view;

                    view.update.calls.reset();
                });

                describe('if there is a sponsor', function() {
                    beforeEach(function() {
                        minireel.sponsor = 'Target';
                        minireel.logo = null;
                        minireel.socialLinks = [];

                        PlayerCtrl.updateView();
                    });

                    it('should be true', function() {
                        expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                            isSponsored: true
                        }));
                    });
                });

                describe('if there is a logo', function() {
                    beforeEach(function() {
                        minireel.sponsor = null;
                        minireel.logo = 'my-logo.jpg';
                        minireel.socialLinks = [];

                        PlayerCtrl.updateView();
                    });

                    it('should be true', function() {
                        expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                            isSponsored: true
                        }));
                    });
                });

                describe('if there are links', function() {
                    beforeEach(function() {
                        minireel.sponsor = null;
                        minireel.logo = null;
                        minireel.socialLinks = [{}];

                        PlayerCtrl.updateView();
                    });

                    it('should be true', function() {
                        expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                            isSponsored: true
                        }));
                    });
                });

                describe('if there are no links, logo or sponsor', function() {
                    beforeEach(function() {
                        minireel.sponsor = null;
                        minireel.logo = null;
                        minireel.socialLinks = [];

                        PlayerCtrl.updateView();
                    });

                    it('should be false', function() {
                        expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                            isSponsored: false
                        }));
                    });
                });
            });

            describe('hasLinks', function() {
                let minireel;
                let view;

                beforeEach(function() {
                    minireel = PlayerCtrl.minireel;
                    view = PlayerCtrl.view;

                    view.update.calls.reset();
                });

                describe('if there are social links', function() {
                    beforeEach(function() {
                        minireel.socialLinks = [{}];
                        delete minireel.links.Website;

                        PlayerCtrl.updateView();
                    });

                    it('should be true', function() {
                        expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                            hasLinks: true
                        }));
                    });
                });

                describe('if there is a website', function() {
                    beforeEach(function() {
                        minireel.socialLinks = [];
                        minireel.links.Website = 'cinema6.com';

                        PlayerCtrl.updateView();
                    });

                    it('should be true', function() {
                        expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                            hasLinks: true
                        }));
                    });
                });

                describe('if there is no website and no links', function() {
                    beforeEach(function() {
                        minireel.socialLinks = [];
                        delete minireel.links.Website;

                        PlayerCtrl.updateView();
                    });

                    it('should be false', function() {
                        expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                            hasLinks: false
                        }));
                    });
                });
            });

            describe('if the middle of the minireel', function() {
                beforeEach(function() {
                    PlayerCtrl.view.update.calls.reset();
                    PlayerCtrl.minireel.currentIndex = 2;
                    PlayerCtrl.minireel.standalone = true;

                    PlayerCtrl.updateView();
                });

                it('should allow the user to go forward or back', function() {
                    expect(PlayerCtrl.view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        canGoForward: true,
                        canGoBack: true
                    }));
                });
            });

            describe('if called before the first slide', function() {
                beforeEach(function() {
                    PlayerCtrl.minireel.currentIndex = -1;
                    PlayerCtrl.view.update.calls.reset();

                    PlayerCtrl.updateView();
                });

                it('should tell the view it can\'t go back', function() {
                    expect(PlayerCtrl.view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        canGoForward: true,
                        canGoBack: false
                    }));
                });
            });

            describe('if called on the first slide', function() {
                beforeEach(function() {
                    PlayerCtrl.view.update.calls.reset();

                    PlayerCtrl.minireel.currentIndex = 0;
                });

                describe('if the player is not standalone', function() {
                    beforeEach(function() {
                        PlayerCtrl.minireel.standalone = false;

                        PlayerCtrl.updateView();
                    });

                    it('should allow the user to go back', function() {
                        expect(PlayerCtrl.view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                            canGoBack: true
                        }));
                    });
                });

                describe('if the player is standalone', function() {
                    beforeEach(function() {
                        PlayerCtrl.minireel.standalone = true;

                        PlayerCtrl.updateView();
                    });

                    it('should not allow the user to go back', function() {
                        expect(PlayerCtrl.view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                            canGoBack: false
                        }));
                    });
                });
            });

            describe('if called on the last slide', function() {
                beforeEach(function() {
                    PlayerCtrl.minireel.currentIndex = 4;
                    PlayerCtrl.view.update.calls.reset();

                    PlayerCtrl.updateView();
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
