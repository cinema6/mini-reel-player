import SwipePlayerController from '../../../../src/controllers/swipe/SwipePlayerController.js';
import Controller from '../../../../lib/core/Controller.js';
import SwipePlayerView from '../../../../src/views/swipe/SwipePlayerView.js';
import SwipeVideoCardController from '../../../../src/controllers/swipe/SwipeVideoCardController.js';
import SwipeTextCardController from '../../../../src/controllers/swipe/SwipeTextCardController.js';
import SwipePrerollCardController from '../../../../src/controllers/swipe/SwipePrerollCardController.js';
import cinema6 from '../../../../src/services/cinema6.js';
import MiniReel from '../../../../src/models/MiniReel.js';
import DeckView from '../../../../src/views/DeckView.js';
import CardPannerView from '../../../../src/views/swipe/CardPannerView.js';
import Runner from '../../../../lib/Runner.js';
import View from '../../../../lib/core/View.js';
import InfoPanelController from '../../../../src/controllers/swipe/InfoPanelController.js';
import SkipProgressTimerView from '../../../../src/views/swipe/SkipProgressTimerView.js';

describe('SwipePlayerController', function() {
    let SwipePlayerCtrl;
    let session;
    let parentView;

    class MockCardController {
        constructor(card, meta, parentView) {
            this.card = card;
            this.meta = meta;
            this.parentView = parentView;

            this.render = jasmine.createSpy('CardCtrl.render()');
        }
    }

    class MockTextCardController extends MockCardController {}
    class MockVideoCardController extends MockCardController {
        constructor() {
            super(...arguments);

            this.toggleFlip = jasmine.createSpy('Ctrl.toggleFlip()');
        }
    }
    class MockPrerollCardController extends MockCardController {
        constructor() {
            super(...arguments);

            this.renderInto = jasmine.createSpy('Ctrl.renderInto()');
        }
    }

    class MockCard {
        constructor(type) {
            this.type = type;
            this.data = {};
            this.hasSkipControl = false;
        }
    }

    beforeEach(function() {
        session = {};
        parentView = new View();
        parentView.tag = 'body';

        spyOn(SwipePlayerController.prototype, 'addView').and.callThrough();
        spyOn(cinema6, 'init').and.returnValue(session);

        SwipePlayerCtrl = new SwipePlayerController(parentView);
    });

    it('should exist', function() {
        expect(SwipePlayerCtrl).toEqual(jasmine.any(Controller));
    });

    describe('properties', function() {
        describe('showInfo', function() {
            it('should be false', function() {
                expect(SwipePlayerCtrl.showInfo).toBe(false);
            });
        });

        describe('session', function() {
            it('should be a cinema6 session', function() {
                expect(SwipePlayerCtrl.session).toBe(session);
            });
        });

        describe('model', function() {
            it('should be a MiniReel', function() {
                expect(SwipePlayerCtrl.model).toEqual(jasmine.any(MiniReel));
            });

            describe('events:', function() {
                let minireel;

                beforeEach(function() {
                    minireel = SwipePlayerCtrl.model;
                });

                describe('init', function() {
                    beforeEach(function() {
                        spyOn(SwipePlayerCtrl, 'render');
                        spyOn(InfoPanelController.prototype, 'renderInto');

                        minireel.deck = ['text', 'video', 'video', 'video']
                            .map(type => new MockCard(type));
                        minireel.prerollCard = new MockCard('preroll');
                        minireel.campaign = {};

                        SwipePlayerCtrl.CardControllers.video = MockVideoCardController;
                        SwipePlayerCtrl.CardControllers.text = MockTextCardController;
                        SwipePlayerCtrl.CardControllers.preroll = MockPrerollCardController;

                        Runner.run(() => SwipePlayerCtrl.view.cards = new CardPannerView());
                        Runner.run(() => SwipePlayerCtrl.view.prerollOutlet = new DeckView());
                        SwipePlayerCtrl.view.infoOutlet = new View();

                        minireel.emit('init');
                    });

                    it('should render its view', function() {
                        expect(SwipePlayerCtrl.render).toHaveBeenCalled();
                    });

                    it('should instantiate a CardController for each card', function() {
                        expect(SwipePlayerCtrl.CardCtrls.length).toBe(4);
                        SwipePlayerCtrl.CardCtrls.forEach((Ctrl, index) => {
                            expect(Ctrl.card).toBe(minireel.deck[index]);
                            expect(Ctrl.meta).toEqual({
                                number: index + 1,
                                total: SwipePlayerCtrl.CardCtrls.length
                            });
                            expect(Ctrl.parentView).toBe(SwipePlayerCtrl.view.cards);

                            expect(Ctrl).toEqual(jasmine.any(SwipePlayerCtrl.CardControllers[Ctrl.card.type]));
                        });
                    });

                    it('should instantiate a PrerollCardCtrl', function() {
                        expect(SwipePlayerCtrl.PrerollCardCtrl).toEqual(jasmine.any(MockPrerollCardController));
                        expect(SwipePlayerCtrl.PrerollCardCtrl.card).toBe(minireel.prerollCard);
                    });

                    it('should instantiate a InfoPanelController', function() {
                        expect(SwipePlayerCtrl.InfoPanelCtrl).toEqual(jasmine.any(InfoPanelController));
                        expect(SwipePlayerCtrl.InfoPanelCtrl.model).toBe(minireel);
                    });

                    describe('InfoPanelCtrl events:', function() {
                        describe('activate', function() {
                            beforeEach(function() {
                                SwipePlayerCtrl.showInfo = false;

                                SwipePlayerCtrl.InfoPanelCtrl.emit('activate');
                            });

                            it('should set showInfo to true', function() {
                                expect(SwipePlayerCtrl.showInfo).toBe(true);
                            });
                        });

                        describe('deactivate', function() {
                            beforeEach(function() {
                                SwipePlayerCtrl.showInfo = true;

                                SwipePlayerCtrl.InfoPanelCtrl.emit('deactivate');
                            });

                            it('should set showInfo to false', function() {
                                expect(SwipePlayerCtrl.showInfo).toBe(false);
                            });
                        });
                    });

                    it('should render the first two cards', function() {
                        SwipePlayerCtrl.CardCtrls.forEach((Ctrl, index) => {
                            if (index < 2) {
                                expect(Ctrl.render).toHaveBeenCalled();
                            } else {
                                expect(Ctrl.render).not.toHaveBeenCalled();
                            }
                        });
                    });

                    it('should render the preroll card', function() {
                        expect(SwipePlayerCtrl.PrerollCardCtrl.renderInto).toHaveBeenCalledWith(SwipePlayerCtrl.view.prerollOutlet);
                    });

                    it('should render the InfoPanelCtrl', function() {
                        expect(SwipePlayerCtrl.InfoPanelCtrl.renderInto).toHaveBeenCalledWith(SwipePlayerCtrl.view.infoOutlet);
                    });

                    describe('when the minireel is launched', function() {
                        beforeEach(function() {
                            SwipePlayerCtrl.CardCtrls.forEach(Ctrl => Ctrl.render.calls.reset());
                            spyOn(SwipePlayerCtrl.view.cards, 'refresh');
                            spyOn(cinema6, 'fullscreen');

                            minireel.emit('launch');
                        });

                        it('should fullscreen the player', function() {
                            expect(cinema6.fullscreen).toHaveBeenCalledWith(true);
                        });

                        it('should render the rest of the cards', function() {
                            SwipePlayerCtrl.CardCtrls.forEach((Ctrl, index) => {
                                if (index > 1) {
                                    expect(Ctrl.render).toHaveBeenCalled();
                                } else {
                                    expect(Ctrl.render).not.toHaveBeenCalled();
                                }
                            });
                        });

                        it('should refresh the cards', function() {
                            expect(SwipePlayerCtrl.view.cards.refresh).toHaveBeenCalled();
                        });
                    });
                });

                describe('close', function() {
                    beforeEach(function() {
                        spyOn(cinema6, 'fullscreen');

                        minireel.emit('close');
                    });

                    it('should close the player', function() {
                        expect(cinema6.fullscreen).toHaveBeenCalledWith(false);
                    });
                });

                describe('move', function() {
                    beforeEach(function() {
                        spyOn(SwipePlayerCtrl, 'updateView');

                        minireel.emit('move');
                    });

                    it('should call updateView()', function() {
                        expect(SwipePlayerCtrl.updateView).toHaveBeenCalled();
                    });
                });

                describe('becameUnskippable', function() {
                    beforeEach(function() {
                        spyOn(SwipePlayerCtrl, 'updateView');

                        minireel.emit('becameUnskippable');
                    });

                    it('should call updateView()', function() {
                        expect(SwipePlayerCtrl.updateView).toHaveBeenCalled();
                    });
                });

                describe('skippableProgress', function() {
                    beforeEach(function() {
                        SwipePlayerCtrl.view.skipTimer = new SkipProgressTimerView();
                        spyOn(SwipePlayerCtrl.view.skipTimer, 'update');

                        minireel.emit('skippableProgress', 3);
                    });

                    it('should update the skipTimer', function() {
                        expect(SwipePlayerCtrl.view.skipTimer.update).toHaveBeenCalledWith(3);
                    });
                });

                describe('becameSkippable', function() {
                    beforeEach(function() {
                        spyOn(SwipePlayerCtrl, 'updateView');

                        minireel.emit('becameSkippable');
                    });

                    it('should call updateView()', function() {
                        expect(SwipePlayerCtrl.updateView).toHaveBeenCalled();
                    });
                });
            });
        });

        describe('view', function() {
            it('should be a SwipePlayerView', function() {
                expect(SwipePlayerCtrl.view).toEqual(jasmine.any(SwipePlayerView));
                expect(SwipePlayerCtrl.addView).toHaveBeenCalledWith(SwipePlayerCtrl.view);
            });
        });

        describe('CardCtrls', function() {
            it('should be an Array', function() {
                expect(SwipePlayerCtrl.CardCtrls).toEqual([]);
            });
        });

        describe('PrerollCardCtrl', function() {
            it('should be null', function() {
                expect(SwipePlayerCtrl.PrerollCardCtrl).toBeNull();
            });
        });

        describe('InfoPanelCtrl', function() {
            it('should be null', function() {
                expect(SwipePlayerCtrl.InfoPanelCtrl).toBeNull();
            });
        });

        describe('CardControllers', function() {
            describe('.video', function() {
                it('should be SwipeVideoCardController', function() {
                    expect(SwipePlayerCtrl.CardControllers.video).toBe(SwipeVideoCardController);
                });
            });

            describe('.text', function() {
                it('should be SwipeTextCardController', function() {
                    expect(SwipePlayerCtrl.CardControllers.text).toBe(SwipeTextCardController);
                });
            });

            describe('.preroll', function() {
                it('should be SwipePrerollCardController', function() {
                    expect(SwipePlayerCtrl.CardControllers.preroll).toBe(SwipePrerollCardController);
                });
            });
        });
    });

    describe('methods:', function() {
        describe('render()', function() {
            let minireel;
            let view;

            beforeEach(function() {
                minireel = SwipePlayerCtrl.model;
                view = SwipePlayerCtrl.view;

                minireel.title = 'My Awesome MiniReel';
                minireel.sponsor = 'Buy n Large';
                minireel.logo = 'buy-n-large__logo.jpg';
                minireel.links = { Website: 'buynlarge.com' };
                spyOn(view, 'update').and.callFake(function() {
                    view.cards = new CardPannerView();
                });
                spyOn(view, 'appendTo');

                SwipePlayerCtrl.render();
            });

            it('should update the view with some info about the minireel', function() {
                expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                    title: minireel.title,
                    sponsor: minireel.sponsor,
                    logo: minireel.logo,
                    website: minireel.links.Website
                }));
            });

            it('should append its view to the parentView', function() {
                expect(view.appendTo).toHaveBeenCalledWith(parentView);
            });

            describe('if the minireel has no sponsor', function() {
                beforeEach(function() {
                    view.update.calls.reset();
                    minireel.logo = 'foo.jpg';
                    minireel.sponsor = null;

                    SwipePlayerCtrl.render();
                });

                it('should call update() with isSponsored: true', function() {
                    expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        isSponsored: true
                    }));
                });
            });

            describe('if the minireel has no logo', function() {
                beforeEach(function() {
                    view.update.calls.reset();
                    minireel.logo = null;
                    minireel.sponsor = 'Buy n Large';

                    SwipePlayerCtrl.render();
                });

                it('should call update() with isSponsored: true', function() {
                    expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        isSponsored: true
                    }));
                });
            });

            describe('if the minireel has no logo or sponsor', function() {
                beforeEach(function() {
                    view.update.calls.reset();
                    minireel.logo = null;
                    minireel.sponsor = null;

                    SwipePlayerCtrl.render();
                });

                it('should call update() with isSponsored: false', function() {
                    expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        isSponsored: false
                    }));
                });
            });

            describe('if the minireel is standalone', function() {
                beforeEach(function() {
                    minireel.standalone = true;
                    view.update.calls.reset();

                    SwipePlayerCtrl.render();
                });

                it('should set the standalone boolean to true', function() {
                    expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        standalone: true
                    }));
                });
            });

            describe('if the minireel is not standalone', function() {
                beforeEach(function() {
                    minireel.standalone = false;
                    view.update.calls.reset();

                    SwipePlayerCtrl.render();
                });

                it('should set the standalone boolean to false', function() {
                    expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        standalone: false
                    }));
                });
            });

            describe('when the cards emit "swipe"', function() {
                beforeEach(function() {
                    view.cards.currentIndex = 3;
                    spyOn(minireel, 'moveToIndex');

                    view.cards.emit('swipe');
                });

                it('should move the minireel to the cards\' index', function() {
                    expect(minireel.moveToIndex).toHaveBeenCalledWith(3);
                });
            });

            describe('when the cards emit "animationEnd"', function() {
                beforeEach(function() {
                    spyOn(SwipePlayerCtrl, 'updateView');

                    view.cards.emit('animationEnd');
                });

                it('should call updateView()', function() {
                    expect(SwipePlayerCtrl.updateView).toHaveBeenCalled();
                });
            });
        });

        describe('updateView()', function() {
            let minireel;
            let view;

            beforeEach(function() {
                SwipePlayerCtrl.CardControllers.video = MockVideoCardController;
                SwipePlayerCtrl.CardControllers.text = MockTextCardController;
                SwipePlayerCtrl.CardControllers.preroll = MockPrerollCardController;

                view = SwipePlayerCtrl.view;

                minireel = SwipePlayerCtrl.model;
                minireel.links = {};
                minireel.socialLinks = [];
                minireel.prerollCard = {
                    data: {
                        type: 'vast'
                    },
                    getSrc: function() {},
                    on: function() {}
                };
                minireel.deck = ['text', 'video', 'video', 'video', 'video']
                    .map(type => new MockCard(type));
                minireel.length = minireel.deck.length;
                minireel.currentIndex = 2;

                Runner.run(() => minireel.emit('init'));

                spyOn(view.skipTimer, 'reset');

                spyOn(SwipePlayerCtrl.view.cards, 'scrollTo');
                spyOn(SwipePlayerCtrl.view.cards, 'lock');
                spyOn(SwipePlayerCtrl.InfoPanelCtrl, 'activate');
                spyOn(SwipePlayerCtrl.view, 'update');

                SwipePlayerCtrl.updateView();
            });

            it('should scrollTo() the index of the MiniReel', function() {
                expect(SwipePlayerCtrl.view.cards.scrollTo).toHaveBeenCalledWith(minireel.currentIndex);
            });

            describe('if on the first card', function() {
                beforeEach(function() {
                    view.update.calls.reset();

                    minireel.currentIndex = 0;
                });

                describe('if the minireel is not standalone', function() {
                    beforeEach(function() {
                        minireel.standalone = false;

                        SwipePlayerCtrl.updateView();
                    });

                    it('should update() with disablePrevious: false', function() {
                        expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                            disablePrevious: false
                        }));
                    });
                });

                describe('if the minireel is standalone', function() {
                    beforeEach(function() {
                        minireel.standalone = true;

                        SwipePlayerCtrl.updateView();
                    });

                    it('should update() with disablePrevious: true', function() {
                        expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                            disablePrevious: true
                        }));
                    });
                });
            });

            describe('if in the middle of the minireel', function() {
                beforeEach(function() {
                    view.update.calls.reset();
                    minireel.currentIndex = 2;

                    SwipePlayerCtrl.updateView();
                });

                it('should update() with disablePrevious: false and disableNext: false', function() {
                    expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        disablePrevious: false,
                        disableNext: false
                    }));
                });
            });

            describe('if on the last card', function() {
                beforeEach(function() {
                    view.update.calls.reset();
                    minireel.currentIndex = minireel.deck.length - 1;

                    SwipePlayerCtrl.updateView();
                });

                it('should update() with disableNext: true', function() {
                    expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        disableNext: true
                    }));
                });
            });

            describe('if the minireel is skippable', function() {
                beforeEach(function() {
                    view.update.calls.reset();
                    view.skipTimer.reset.calls.reset();
                    minireel.skippable = true;

                    SwipePlayerCtrl.updateView();
                });

                it('should update() the view with locked: false', function() {
                    expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        locked: false
                    }));
                });

                it('should call cards.lock(false)', function() {
                    expect(view.cards.lock).toHaveBeenCalledWith(false);
                });

                it('should reset() the skipTimer', function() {
                    expect(view.skipTimer.reset).toHaveBeenCalled();
                });
            });

            describe('if the minireel is not skippable', function() {
                beforeEach(function() {
                    view.update.calls.reset();
                    view.skipTimer.reset.calls.reset();
                    minireel.skippable = false;
                });

                describe('if the currentCard is the preroll card', function() {
                    beforeEach(function() {
                        minireel.currentCard = minireel.prerollCard;
                        minireel.currentIndex = null;

                        SwipePlayerCtrl.updateView();
                    });

                    it('should update() the view with locked: false', function() {
                        expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                            locked: false
                        }));
                    });

                    it('should call cards.lock(false)', function() {
                        expect(view.cards.lock).toHaveBeenCalledWith(false);
                    });

                    it('should reset() the skipTimer', function() {
                        expect(view.skipTimer.reset).toHaveBeenCalled();
                    });
                });

                describe('if the currentCard is not the preroll card', function() {
                    beforeEach(function() {
                        minireel.currentIndex = 2;
                        minireel.currentCard = minireel.deck[minireel.currentIndex];

                        SwipePlayerCtrl.updateView();
                    });

                    it('should update() the view with locked: true', function() {
                        expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                            locked: true
                        }));
                    });

                    it('should call cards.lock(true)', function() {
                        expect(view.cards.lock).toHaveBeenCalledWith(true);
                    });

                    it('should not reset() the skipTimer', function() {
                        expect(view.skipTimer.reset).not.toHaveBeenCalled();
                    });

                    describe('if the cards are animating', function() {
                        beforeEach(function() {
                            view.update.calls.reset();
                            view.cards.animating = true;

                            SwipePlayerCtrl.updateView();
                        });

                        it('should update() the view with locked: false', function() {
                            expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                                locked: false
                            }));
                        });
                    });

                    describe('if the cards are not animating', function() {
                        beforeEach(function() {
                            view.update.calls.reset();
                            view.cards.animating = false;

                            SwipePlayerCtrl.updateView();
                        });

                        it('should update() the view with locked: true', function() {
                            expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                                locked: true
                            }));
                        });
                    });
                });
            });

            describe('if the Controller for the currentCard is flippable', function() {
                beforeEach(function() {
                    SwipePlayerCtrl.CardCtrls[minireel.currentIndex].flippable = true;
                    view.update.calls.reset();

                    SwipePlayerCtrl.updateView();
                });

                it('should update() its view with flippable: true', function() {
                    expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        flippable: true
                    }));
                });
            });

            describe('if the Controller for the currentCard is not flippable', function() {
                beforeEach(function() {
                    SwipePlayerCtrl.CardCtrls[minireel.currentIndex].flippable = false;
                    view.update.calls.reset();

                    SwipePlayerCtrl.updateView();
                });

                it('should update() its view with flippable: false', function() {
                    expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        flippable: false
                    }));
                });
            });

            describe('if the prerollCard is being shown', function() {
                beforeEach(function() {
                    SwipePlayerCtrl.view.cards.scrollTo.calls.reset();

                    minireel.currentCard = minireel.prerollCard;
                    minireel.currentIndex = null;

                    SwipePlayerCtrl.updateView();
                });

                it('should not scroll the deck', function() {
                    expect(SwipePlayerCtrl.view.cards.scrollTo).not.toHaveBeenCalled();
                });
            });

            describe('if showInfo is false', function() {
                beforeEach(function() {
                    SwipePlayerCtrl.InfoPanelCtrl.activate.calls.reset();
                    SwipePlayerCtrl.showInfo = false;

                    SwipePlayerCtrl.updateView();
                });

                it('should deactivate the InfoPanelCtrl', function() {
                    expect(SwipePlayerCtrl.InfoPanelCtrl.activate).toHaveBeenCalledWith(false);
                });
            });

            describe('if showInfo is true', function() {
                beforeEach(function() {
                    SwipePlayerCtrl.InfoPanelCtrl.activate.calls.reset();
                    SwipePlayerCtrl.showInfo = true;

                    SwipePlayerCtrl.updateView();
                });

                it('should activate the InfoPanelCtrl', function() {
                    expect(SwipePlayerCtrl.InfoPanelCtrl.activate).toHaveBeenCalledWith(true);
                });
            });

            describe('showInfoPanel()', function() {
                beforeEach(function() {
                    SwipePlayerCtrl.showInfo = false;
                    spyOn(SwipePlayerCtrl, 'updateView');

                    SwipePlayerCtrl.showInfoPanel();
                });

                it('should set showInfo to true', function() {
                    expect(SwipePlayerCtrl.showInfo).toBe(true);
                });

                it('should update the view', function() {
                    expect(SwipePlayerCtrl.updateView).toHaveBeenCalled();
                });
            });
        });

        describe('next()', function() {
            beforeEach(function() {
                spyOn(SwipePlayerCtrl.model, 'next');

                SwipePlayerCtrl.next();
            });

            it('should call next() on the MiniReel', function() {
                expect(SwipePlayerCtrl.model.next).toHaveBeenCalled();
            });
        });

        describe('previous()', function() {
            beforeEach(function() {
                spyOn(SwipePlayerCtrl.model, 'previous');

                SwipePlayerCtrl.previous();
            });

            it('should call previous() on the MiniReel', function() {
                expect(SwipePlayerCtrl.model.previous).toHaveBeenCalled();
            });
        });

        describe('close()', function() {
            beforeEach(function() {
                spyOn(SwipePlayerCtrl.model, 'close');

                SwipePlayerCtrl.close();
            });

            it('should call close() on the minireel', function() {
                expect(SwipePlayerCtrl.model.close).toHaveBeenCalled();
            });
        });

        describe('toggleFlip()', function() {
            let minireel;

            beforeEach(function() {
                SwipePlayerCtrl.CardControllers.video = MockVideoCardController;
                SwipePlayerCtrl.CardControllers.text = MockTextCardController;
                SwipePlayerCtrl.CardControllers.preroll = MockPrerollCardController;

                minireel = SwipePlayerCtrl.model;
                minireel.links = {};
                minireel.socialLinks = [];
                minireel.prerollCard = {
                    data: {
                        type: 'vast'
                    },
                    getSrc: function() {},
                    on: function() {}
                };
                minireel.deck = ['text', 'video', 'video', 'video', 'video']
                    .map(type => new MockCard(type));
                minireel.currentIndex = 2;
                minireel.currentCard = minireel.deck[minireel.currentIndex];

                Runner.run(() => minireel.emit('init'));

                Runner.run(() => SwipePlayerCtrl.toggleFlip());
            });

            it('should call toggleFlip() on the current card controller', function() {
                expect(SwipePlayerCtrl.CardCtrls[minireel.currentIndex].toggleFlip).toHaveBeenCalled();
            });
        });
    });
});
