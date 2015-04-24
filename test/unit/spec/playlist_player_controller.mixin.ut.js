import PlayerController from '../../../src/controllers/PlayerController.js';
import PlaylistPlayerController from '../../../src/mixins/PlaylistPlayerController.js';
import PlaylistViewController from '../../../src/controllers/PlaylistViewController.js';
import DisplayAdController from '../../../src/controllers/DisplayAdController.js';
import PrerollCardController from '../../../src/controllers/PrerollCardController.js';
import PrerollCard from '../../../src/models/PrerollCard.js';
import Runner from '../../../lib/Runner.js';
import PlayerView from '../../../src/views/PlayerView.js';
import View from '../../../lib/core/View.js';
import CardView from '../../../src/views/CardView.js';
class MyPlayerController extends PlayerController {}
MyPlayerController.mixin(PlaylistPlayerController);
class DeckView extends View {
    show() {}
    hide() {}
}

describe('PlaylistPlayerController mixin', function() {
    let Ctrl;
    let experience;

    beforeEach(function() {
        experience = { data: {} };

        Ctrl = new MyPlayerController(new View(document.createElement('body')));
        Ctrl.CardControllers.preroll = PrerollCardController;
    });

    it('should exist', function() {
        expect(Ctrl).toEqual(jasmine.any(PlayerController));
    });

    describe('methods:', function() {
        describe('initPlaylist()', function() {
            beforeEach(function() {
                Ctrl.view = new PlayerView();
                spyOn(Ctrl.view, 'update');

                Ctrl.initPlaylist();
            });

            it('should create a PlaylistViewController', function() {
                expect(Ctrl.PlaylistViewCtrl).toEqual(jasmine.any(PlaylistViewController));
            });

            it('should create a DisplayAdController', function() {
                expect(Ctrl.DisplayAdCtrl).toEqual(jasmine.any(DisplayAdController));
            });

            describe('events:', function() {
                describe('DisplayAdCtrl', function() {
                    describe('activate', function() {
                        beforeEach(function() {
                            spyOn(Ctrl.PlaylistViewCtrl, 'contract');

                            Ctrl.DisplayAdCtrl.emit('activate');
                        });

                        it('should contract the Playlist', function() {
                            expect(Ctrl.PlaylistViewCtrl.contract).toHaveBeenCalled();
                        });
                    });

                    describe('deactivate', function() {
                        beforeEach(function() {
                            spyOn(Ctrl.PlaylistViewCtrl, 'expand');

                            Ctrl.DisplayAdCtrl.emit('deactivate');
                        });

                        it('should expand the Playlist', function() {
                            expect(Ctrl.PlaylistViewCtrl.expand).toHaveBeenCalled();
                        });
                    });
                });

                describe('PrerollCardCtrl', function() {
                    beforeEach(function() {
                        Ctrl.view.cards = new DeckView();
                        Ctrl.view.prerollOutlet = new DeckView();
                        Ctrl.minireel.adConfig = {
                            video: {}
                        };
                        Ctrl.minireel.prerollCard = new PrerollCard({ data: {}, collateral: {}, params: {} }, experience, Ctrl.minireel);
                        spyOn(PrerollCardController.prototype, 'renderInto');
                        spyOn(Ctrl.PlaylistViewCtrl, 'renderInto');
                        spyOn(Ctrl.DisplayAdCtrl, 'renderInto');
                        Runner.run(() => Ctrl.minireel.emit('init'));
                    });

                    describe('showingCompanion', function() {
                        beforeEach(function() {
                            spyOn(Ctrl.PlaylistViewCtrl, 'contract');

                            Ctrl.PrerollCardCtrl.emit('showingCompanion');
                        });

                        it('should contract() the playlist', function() {
                            expect(Ctrl.PlaylistViewCtrl.contract).toHaveBeenCalled();
                        });
                    });
                });

                describe('minireel', function() {
                    beforeEach(function() {
                        spyOn(Ctrl.PlaylistViewCtrl.view, 'update');
                    });

                    describe('init', function() {
                        beforeEach(function() {
                            Ctrl.view.playlistOutlet = new View();
                            Ctrl.view.displayAdOutlet = new View();
                            Ctrl.view.cards = new DeckView();
                            Ctrl.view.prerollOutlet = new DeckView();
                            spyOn(Ctrl.PlaylistViewCtrl, 'renderInto');
                            spyOn(Ctrl.DisplayAdCtrl, 'renderInto');
                            spyOn(PrerollCardController.prototype, 'renderInto');
                            Ctrl.minireel.adConfig = {
                                video: {}
                            };
                            Ctrl.minireel.prerollCard = new PrerollCard({ data: {}, collateral: {}, params: {} }, experience, Ctrl.minireel);

                            Runner.run(() => Ctrl.minireel.emit('init'));
                        });

                        it('should render the playlist into its outlet', function() {
                            expect(Ctrl.PlaylistViewCtrl.renderInto).toHaveBeenCalledWith(Ctrl.view.playlistOutlet);
                        });

                        it('should render the display ad into its outlet', function() {
                            expect(Ctrl.DisplayAdCtrl.renderInto).toHaveBeenCalledWith(Ctrl.view.displayAdOutlet);
                        });
                    });

                    describe('becameUnskippable', function() {
                        beforeEach(function() {
                            spyOn(Ctrl.PlaylistViewCtrl, 'disable');

                            Runner.run(() => Ctrl.minireel.emit('becameUnskippable'));
                        });

                        it('should disable the playlist', function() {
                            expect(Ctrl.PlaylistViewCtrl.disable).toHaveBeenCalled();
                        });
                    });

                    describe('becameSkippable', function() {
                        beforeEach(function() {
                            spyOn(Ctrl.PlaylistViewCtrl, 'enable');

                            Runner.run(() => Ctrl.minireel.emit('becameSkippable'));
                        });

                        it('should enable the playlist', function() {
                            expect(Ctrl.PlaylistViewCtrl.enable).toHaveBeenCalled();
                        });
                    });

                    describe('move', function() {
                        beforeEach(function() {
                            Ctrl.view.expand = jasmine.createSpy('view.expand()');
                            Ctrl.view.contract = jasmine.createSpy('view.contract()');
                            Ctrl.view.cards = new DeckView();
                            Ctrl.view.prerollOutlet = new DeckView();
                            spyOn(Ctrl.PlaylistViewCtrl, 'show');
                            spyOn(Ctrl.PlaylistViewCtrl, 'hide');
                            spyOn(Ctrl.DisplayAdCtrl, 'activate');
                            spyOn(Ctrl.DisplayAdCtrl, 'deactivate');
                        });

                        describe('if the currentCard has the displayAd module', function() {
                            beforeEach(function() {
                                Ctrl.minireel.currentCard = { modules: { displayAd: {} } };
                                Runner.run(() => Ctrl.minireel.emit('move'));
                            });

                            it('should set the DisplayAdCtrl\'s model to the displayAd module', function() {
                                expect(Ctrl.DisplayAdCtrl.model).toBe(Ctrl.minireel.currentCard.modules.displayAd);
                            });

                            it('should activate the DisplayAdCtrl', function() {
                                expect(Ctrl.DisplayAdCtrl.activate).toHaveBeenCalled();
                                expect(Ctrl.DisplayAdCtrl.deactivate).not.toHaveBeenCalled();
                            });
                        });

                        describe('if the currentCard does not have the displayAd module', function() {
                            beforeEach(function() {
                                Ctrl.minireel.currentCard = { modules: {} };
                                Runner.run(() => Ctrl.minireel.emit('move'));
                            });

                            it('should deactivate the DisplayAdCtrl', function() {
                                expect(Ctrl.DisplayAdCtrl.activate).not.toHaveBeenCalled();
                                expect(Ctrl.DisplayAdCtrl.deactivate).toHaveBeenCalled();
                            });
                        });

                        describe('if the currentCard is a recap card', function() {
                            beforeEach(function() {
                                Ctrl.minireel.currentCard = { type: 'recap', modules: {} };
                                Runner.run(() => Ctrl.minireel.emit('move'));
                            });

                            it('should expand its view', function() {
                                expect(Ctrl.view.expand).toHaveBeenCalled();
                                expect(Ctrl.view.contract).not.toHaveBeenCalled();
                            });

                            it('should hide the playlist', function() {
                                expect(Ctrl.PlaylistViewCtrl.hide).toHaveBeenCalled();
                                expect(Ctrl.PlaylistViewCtrl.show).not.toHaveBeenCalled();
                            });
                        });

                        describe('if the currentCard is not a recap card', function() {
                            beforeEach(function() {
                                Ctrl.minireel.currentCard = { type: 'video', modules: {} };
                                Runner.run(() => Ctrl.minireel.emit('move'));
                            });

                            it('should contract its view', function() {
                                expect(Ctrl.view.expand).not.toHaveBeenCalled();
                                expect(Ctrl.view.contract).toHaveBeenCalled();
                            });

                            it('should show the playlist', function() {
                                expect(Ctrl.PlaylistViewCtrl.show).toHaveBeenCalled();
                                expect(Ctrl.PlaylistViewCtrl.hide).not.toHaveBeenCalled();
                            });
                        });
                    });

                    describe('.prerollCard', function() {
                        beforeEach(function() {
                            Ctrl.view.cards = new DeckView();
                            Ctrl.view.prerollOutlet = new DeckView();
                            Ctrl.minireel.adConfig = {
                                video: {}
                            };
                            Ctrl.minireel.prerollCard = new PrerollCard({ data: {}, collateral: {}, params: {} }, experience, Ctrl.minireel);
                            spyOn(PrerollCardController.prototype, 'renderInto');
                            spyOn(Ctrl.PlaylistViewCtrl, 'renderInto');
                            spyOn(Ctrl.DisplayAdCtrl, 'renderInto');
                            Runner.run(() => Ctrl.minireel.emit('init'));
                            Ctrl.PrerollCardCtrl.view = new CardView();
                        });

                        describe('deactivate', function() {
                            beforeEach(function() {
                                spyOn(Ctrl.PlaylistViewCtrl, 'expand');

                                Runner.run(() => Ctrl.minireel.prerollCard.emit('deactivate'));
                            });

                            it('should expand the playlist', function() {
                                expect(Ctrl.PlaylistViewCtrl.expand).toHaveBeenCalled();
                            });
                        });
                    });
                });
            });
        });
    });
});
