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
import DeckView from '../../../src/views/DeckView.js';
import environment from '../../../src/environment.js';
import { EventEmitter } from 'events';
import Mixable from '../../../lib/core/Mixable.js';
import dispatcher from '../../../src/services/dispatcher.js';

describe('PlayerController', function() {
    let PlayerCtrl;

    let applicationView;
    let experience;
    let profile;

    class CardController extends Mixable {
        constructor(model, parentView) {
            super(...arguments);
            this.model = model;
            this.parentView = parentView;
        }

        render() {}
    }
    CardController.mixin(EventEmitter);

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
        environment.constructor();

        spyOn(dispatcher, 'addClient');

        experience = {
            data: {
                collateral: {}
            }
        };

        profile = { flash: false };

        applicationView = new ApplicationView(document.createElement('body'));

        Runner.run(() => PlayerCtrl = new PlayerController(applicationView));
        PlayerCtrl.view = new PlayerView();
        PlayerCtrl.CardControllers = {
            text: TextCardController,
            video: VideoCardController,
            recap: RecapCardController
        };
    });

    afterAll(function() {
        environment.constructor();
    });

    it('should be a controller', function() {
        expect(PlayerCtrl).toEqual(jasmine.any(Controller));
    });

    describe('properties:', function() {
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
        describe('controller', function() {
            beforeEach(function() {
                spyOn(PlayerCtrl.view, 'appendTo');
                spyOn(PlayerCtrl, 'updateView');
                environment.mode = 'some-mode';
                PlayerCtrl.view.prerollOutlet = new View();

                PlayerCtrl.minireel.branding = 'my-branding';
                PlayerCtrl.minireel.deck = [
                    new TextCard({ data: {} }, experience),
                    new VideoCard({ type: 'youtube', collateral: {}, data: {}, params: {} }, experience),
                    new VideoCard({ type: 'youtube', collateral: {}, data: {}, params: {} }, experience),
                    new VideoCard({ type: 'youtube', collateral: {}, data: {}, params: {} }, experience),
                    new RecapCard({}, experience, profile, PlayerCtrl.minireel)
                ];
                PlayerCtrl.minireel.adConfig = {
                    video: {

                    }
                };
                PlayerCtrl.minireel.campaign = {};
                spyOn(CardController.prototype, 'render');

                Runner.run(() => PlayerCtrl.minireel.emit('init'));
            });

            describe('openedModal', function() {
                it('should call openedModal()', function() {
                    spyOn(PlayerCtrl, 'openedModal');
                    PlayerCtrl.cardCtrls[0].emit('openedModal');
                    expect(PlayerCtrl.openedModal).toHaveBeenCalled();
                });
            });

            describe('closedModal', function() {
                it('should call closedModal()', function() {
                    spyOn(PlayerCtrl, 'closedModal');
                    PlayerCtrl.cardCtrls[0].emit('closedModal');
                    expect(PlayerCtrl.closedModal).toHaveBeenCalled();
                });
            });
        });

        describe('minireel', function() {
            describe('init', function() {
                beforeEach(function() {
                    spyOn(PlayerCtrl.view, 'appendTo');
                    spyOn(PlayerCtrl, 'updateView');
                    environment.mode = 'some-mode';
                    PlayerCtrl.view.prerollOutlet = new View();

                    PlayerCtrl.minireel.branding = 'my-branding';
                    PlayerCtrl.minireel.deck = [
                        new TextCard({ data: {} }, experience),
                        new VideoCard({ type: 'youtube', collateral: {}, data: {}, params: {} }, experience),
                        new VideoCard({ type: 'youtube', collateral: {}, data: {}, params: {} }, experience),
                        new VideoCard({ type: 'youtube', collateral: {}, data: {}, params: {} }, experience),
                        new RecapCard({}, experience, profile, PlayerCtrl.minireel)
                    ];
                    PlayerCtrl.minireel.adConfig = {
                        video: {

                        }
                    };
                    PlayerCtrl.minireel.campaign = {};
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

            ['move', 'becameCloseable', 'becameUncloseable'].forEach(function(event) {
                describe(event, function() {
                    beforeEach(function() {
                        spyOn(PlayerCtrl, 'updateView');
                        PlayerCtrl.minireel.emit(event);
                    });

                    it('should call updateView()', function() {
                        expect(PlayerCtrl.updateView).toHaveBeenCalled();
                    });
                });
            });

            describe('launch', function() {
                beforeEach(function() {
                    spyOn(PlayerCtrl, 'updateView');

                    PlayerCtrl.minireel.deck = [
                        new TextCard({ data: {} }, experience),
                        new VideoCard({ type: 'youtube', collateral: {}, data: {}, params: {} }, experience),
                        new VideoCard({ type: 'youtube', collateral: {}, data: {}, params: {} }, experience),
                        new VideoCard({ type: 'youtube', collateral: {}, data: {}, params: {} }, experience),
                        new RecapCard({}, experience, profile, PlayerCtrl.minireel)
                    ];
                    PlayerCtrl.minireel.campaign = {};

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

                Runner.run(() => PlayerCtrl.view.cards = new DeckView());
                spyOn(PlayerCtrl.view.cards, 'show');
                spyOn(PlayerCtrl.view.cards, 'hide');

                Runner.run(() => PlayerCtrl.view.prerollOutlet = new DeckView());
                spyOn(PlayerCtrl.view.prerollOutlet, 'show');
                spyOn(PlayerCtrl.view.prerollOutlet, 'hide');

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
                PlayerCtrl.minireel.adConfig = { video: {} };


                PlayerCtrl.minireel.sponsor = 'Netflix';
                PlayerCtrl.minireel.logo = 'http://www.images.com/netflix-logo.jpg';
                PlayerCtrl.minireel.socialLinks = [
                    { type: 'youtube', label: 'YouTube', href: 'yt.com' },
                    { type: 'facebook', label: 'Facebook', href: 'fb.com' }
                ];
                PlayerCtrl.minireel.links = {
                    Website: { uri: 'http://www.netflix.com', tracking: [] }
                };

                PlayerCtrl.minireel.currentIndex = 3;
                PlayerCtrl.minireel.currentCard = { type: 'recap' };

                PlayerCtrl.updateView();

                [PlayerCtrl.view.cards.show, PlayerCtrl.view.cards.hide, PlayerCtrl.view.prerollOutlet.show, PlayerCtrl.view.prerollOutlet.hide]
                    .forEach(spy => spy.calls.reset());
            });

            it('should update its view', function() {
                expect(PlayerCtrl.view.update).toHaveBeenCalledWith({
                    title: PlayerCtrl.minireel.get('title'),
                    sponsor: PlayerCtrl.minireel.get('sponsor'),
                    logo: PlayerCtrl.minireel.get('logo'),
                    links: PlayerCtrl.minireel.get('socialLinks'),
                    website: PlayerCtrl.minireel.get('links.Website.uri'),
                    isSponsored: jasmine.any(Boolean),
                    hasLinks: jasmine.any(Boolean),
                    totalCards: PlayerCtrl.minireel.get('length'),
                    currentCardNumber: (PlayerCtrl.minireel.get('currentIndex') + 1).toString(),
                    canGoForward: jasmine.any(Boolean),
                    canGoBack: jasmine.any(Boolean),
                    cardType: PlayerCtrl.minireel.get('currentCard.type'),
                    isSolo: jasmine.any(Boolean),
                    closeable: jasmine.any(Boolean)
                });
            });

            describe('if the currentCard is not the prerollCard', function() {
                beforeEach(function() {
                    PlayerCtrl.minireel.currentCard = PlayerCtrl.minireel.deck[2];

                    PlayerCtrl.updateView();
                });

                it('should show() the cards and hide the prerollOutlet', function() {
                    expect(PlayerCtrl.view.cards.show).toHaveBeenCalled();
                    expect(PlayerCtrl.view.cards.hide).not.toHaveBeenCalled();

                    expect(PlayerCtrl.view.prerollOutlet.show).not.toHaveBeenCalled();
                    expect(PlayerCtrl.view.prerollOutlet.hide).toHaveBeenCalled();
                });
            });

            describe('if the currentCard is the prerollCard', function() {
                beforeEach(function() {
                    PlayerCtrl.minireel.currentCard = PlayerCtrl.minireel.prerollCard;

                    PlayerCtrl.updateView();
                });

                it('should show() the prerollOutlet and hide the cards', function() {
                    expect(PlayerCtrl.view.cards.show).not.toHaveBeenCalled();
                    expect(PlayerCtrl.view.cards.hide).toHaveBeenCalled();

                    expect(PlayerCtrl.view.prerollOutlet.show).toHaveBeenCalled();
                    expect(PlayerCtrl.view.prerollOutlet.hide).not.toHaveBeenCalled();
                });
            });

            [true, false].forEach(function(boolean) {
                describe(`if closeable is ${boolean}`, function() {
                    beforeEach(function() {
                        PlayerCtrl.view.update.calls.reset();
                        PlayerCtrl.minireel.closeable = boolean;

                        PlayerCtrl.updateView();
                    });

                    it(`should call updateView with closeable = ${boolean}`, function() {
                        expect(PlayerCtrl.view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                            closeable: boolean
                        }));
                    });
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

            describe('isSolo', function() {
                let minireel;
                let view;

                beforeEach(function() {
                    minireel = PlayerCtrl.minireel;
                    view = PlayerCtrl.view;

                    view.update.calls.reset();
                });

                describe('if the minireel has more than one slides', function() {
                    beforeEach(function() {
                        minireel.length = 2;

                        PlayerCtrl.updateView();
                    });

                    it('should be false', function() {
                        expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                            isSolo: false
                        }));
                    });
                });

                describe('if the minireel has only one slide', function() {
                    beforeEach(function() {
                        minireel.length = 1;

                        PlayerCtrl.updateView();
                    });

                    it('should be true', function() {
                        expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                            isSolo: true
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

            describe('if not on a card in the deck', function() {
                beforeEach(function() {
                    PlayerCtrl.view.update.calls.reset();
                    PlayerCtrl.minireel.currentIndex = null;
                    PlayerCtrl.minireel.standalone = true;

                    PlayerCtrl.updateView();
                });

                it('should allow the user to go back', function() {
                    expect(PlayerCtrl.view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        canGoBack: true
                    }));
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
