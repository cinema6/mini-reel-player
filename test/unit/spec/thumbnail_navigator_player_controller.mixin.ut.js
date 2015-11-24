import ThumbnailNavigatorPlayerController from '../../../src/mixins/ThumbnailNavigatorPlayerController.js';
import PlayerController from '../../../src/controllers/PlayerController.js';
import ThumbnailNavigatorViewController from '../../../src/controllers/ThumbnailNavigatorViewController.js';
import PlayerView from '../../../src/views/PlayerView.js';
import View from '../../../lib/core/View.js';
import Runner from '../../../lib/Runner.js';
import LinksListView from '../../../src/views/LinksListView.js';
import PrerollCardController from '../../../src/controllers/PrerollCardController.js';
import PrerollCard from '../../../src/models/PrerollCard.js';
import dispatcher from '../../../src/services/dispatcher.js';
class DeckView extends View {
    show() {}
    hide() {}
}

describe('ThumbnailNavigatorPlayerController', function() {
    let Ctrl;
    let view;
    let experience;
    let profile;

    class MyPlayerController extends PlayerController {}
    MyPlayerController.mixin(ThumbnailNavigatorPlayerController);

    beforeEach(function() {
        spyOn(dispatcher, 'addClient');
        experience = { data: { collateral: {} } };
        profile = { flash: false };
        view = new PlayerView();

        Ctrl = new MyPlayerController(new View(document.createElement('body')));
        Ctrl.CardControllers.preroll = PrerollCardController;
        Ctrl.view = view;
    });

    it('should exist', function() {
        expect(Ctrl).toEqual(jasmine.any(PlayerController));
    });

    describe('methods:', function() {
        describe('initThumbnailNavigator()', function() {
            beforeEach(function() {
                Ctrl.initThumbnailNavigator();
            });

            it('should set ThumbnailNavigatorViewCtrl to a ThumbnailNavigatorViewController', function() {
                expect(Ctrl.ThumbnailNavigatorViewCtrl).toEqual(jasmine.any(ThumbnailNavigatorViewController));
                expect(Ctrl.ThumbnailNavigatorViewCtrl.model).toBe(Ctrl.minireel);
            });

            describe('events:', function() {
                describe('minireel', function() {
                    describe('init', function() {
                        beforeEach(function() {
                            Ctrl.view.cards = new DeckView();
                            Ctrl.view.prerollOutlet = new DeckView();
                            view.pagerOutlet = new View();
                            view.links = new LinksListView();
                            spyOn(Ctrl.ThumbnailNavigatorViewCtrl, 'renderInto');
                            spyOn(PrerollCardController.prototype, 'renderInto');
                            Ctrl.minireel.adConfig = {
                                video: {}
                            };
                            Ctrl.minireel.prerollCard = new PrerollCard({ data: {}, collateral: {}, params: {} }, experience, profile, Ctrl.minireel);
                            Ctrl.minireel.length = 5;
                            Ctrl.minireel.campaign = {};

                            Runner.run(() => Ctrl.minireel.emit('init'));
                        });

                        it('should render the navigator', function() {
                            expect(Ctrl.ThumbnailNavigatorViewCtrl.renderInto).toHaveBeenCalledWith(view.pagerOutlet);
                        });

                        describe('if the MiniReel only has one card', function() {
                            beforeEach(function() {
                                Ctrl.initThumbnailNavigator();
                                spyOn(Ctrl.ThumbnailNavigatorViewCtrl, 'renderInto');

                                Ctrl.minireel.length = 1;
                                Runner.run(() => Ctrl.minireel.emit('init'));
                            });

                            it('should not render the navigator', function() {
                                expect(Ctrl.ThumbnailNavigatorViewCtrl.renderInto).not.toHaveBeenCalled();
                            });
                        });
                    });

                    describe('move', function() {
                        beforeEach(function() {
                            Ctrl.view.cards = new DeckView();
                            Ctrl.view.prerollOutlet = new DeckView();
                            view.links = new LinksListView();
                        });

                        ['recap', 'text', 'article', 'instagramImage', 'instagramVideo'].forEach(type => {
                            describe(`if the currentCard is a ${type} card`, function() {
                                beforeEach(function() {
                                    Ctrl.minireel.currentCard = { type };

                                    spyOn(Ctrl.ThumbnailNavigatorViewCtrl, 'expand');
                                    spyOn(Ctrl.ThumbnailNavigatorViewCtrl, 'contract');

                                    Runner.run(() => Ctrl.minireel.emit('move'));
                                });

                                it('should expand the navigator', function() {
                                    expect(Ctrl.ThumbnailNavigatorViewCtrl.expand).toHaveBeenCalled();
                                    expect(Ctrl.ThumbnailNavigatorViewCtrl.contract).not.toHaveBeenCalled();
                                });
                            });
                        });

                        ['video'].forEach(type => {
                            describe(`if the currentCard is a ${type} card`, function() {
                                beforeEach(function() {
                                    Ctrl.minireel.currentCard = { type };

                                    spyOn(Ctrl.ThumbnailNavigatorViewCtrl, 'expand');
                                    spyOn(Ctrl.ThumbnailNavigatorViewCtrl, 'contract');

                                    Runner.run(() => Ctrl.minireel.emit('move'));
                                });

                                it('should contract the navigator', function() {
                                    expect(Ctrl.ThumbnailNavigatorViewCtrl.expand).not.toHaveBeenCalled();
                                    expect(Ctrl.ThumbnailNavigatorViewCtrl.contract).toHaveBeenCalled();
                                });
                            });
                        });

                        ['recap'].forEach(type => {
                            describe(`if the currentCard is a ${type} card`, function() {
                                beforeEach(function() {
                                    Ctrl.minireel.currentCard = { type };

                                    spyOn(Ctrl.ThumbnailNavigatorViewCtrl, 'showThumbs');
                                    spyOn(Ctrl.ThumbnailNavigatorViewCtrl, 'hideThumbs');

                                    Runner.run(() => Ctrl.minireel.emit('move'));
                                });

                                it('should hide the thumbs', function() {
                                    expect(Ctrl.ThumbnailNavigatorViewCtrl.hideThumbs).toHaveBeenCalled();
                                    expect(Ctrl.ThumbnailNavigatorViewCtrl.showThumbs).not.toHaveBeenCalled();
                                });
                            });
                        });

                        ['video', 'text'].forEach(type => {
                            describe(`if the currentCard is a ${type} card`, function() {
                                beforeEach(function() {
                                    Ctrl.minireel.currentCard = { type };

                                    spyOn(Ctrl.ThumbnailNavigatorViewCtrl, 'showThumbs');
                                    spyOn(Ctrl.ThumbnailNavigatorViewCtrl, 'hideThumbs');

                                    Runner.run(() => Ctrl.minireel.emit('move'));
                                });

                                it('should show the thumbs', function() {
                                    expect(Ctrl.ThumbnailNavigatorViewCtrl.hideThumbs).not.toHaveBeenCalled();
                                    expect(Ctrl.ThumbnailNavigatorViewCtrl.showThumbs).toHaveBeenCalled();
                                });
                            });
                        });

                        describe('if the currentCard is null', function() {
                            beforeEach(function() {
                                Ctrl.minireel.currentCard = null;
                            });

                            it('should do nothing', function() {
                                expect(function() {
                                    Runner.run(() => Ctrl.minireel.emit('move'));
                                }).not.toThrow();
                            });
                        });
                    });
                });
            });
        });
    });
});
