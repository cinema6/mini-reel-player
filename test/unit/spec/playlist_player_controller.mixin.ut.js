import PlayerController from '../../../src/controllers/PlayerController.js';
import PlaylistPlayerController from '../../../src/mixins/PlaylistPlayerController.js';
import PlaylistViewController from '../../../src/controllers/PlaylistViewController.js';
import Runner from '../../../lib/Runner.js';
import PlayerView from '../../../src/views/PlayerView.js';
import View from '../../../lib/core/View.js';
import dispatcher from '../../../src/services/dispatcher.js';
class MyPlayerController extends PlayerController {}
MyPlayerController.mixin(PlaylistPlayerController);
class DeckView extends View {
    show() {}
    hide() {}
}

describe('PlaylistPlayerController mixin', function() {
    let Ctrl;
    let experience;
    let profile;

    beforeEach(function() {
        spyOn(dispatcher, 'addClient');

        experience = { data: {} };
        profile = { flash: false };

        Ctrl = new MyPlayerController(new View(document.createElement('body')));
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

            describe('events:', function() {
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
                            Ctrl.minireel.adConfig = {
                                video: {}
                            };
                            Ctrl.minireel.campaign = {};

                            Runner.run(() => Ctrl.minireel.emit('init'));
                        });

                        it('should render the playlist into its outlet', function() {
                            expect(Ctrl.PlaylistViewCtrl.renderInto).toHaveBeenCalledWith(Ctrl.view.playlistOutlet);
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
                });
            });
        });
    });
});
