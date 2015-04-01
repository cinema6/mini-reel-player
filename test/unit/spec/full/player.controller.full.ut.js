import FullPlayerController from '../../../../src/controllers/full/FullPlayerController.js';
import PlayerController from '../../../../src/controllers/PlayerController.js';
import FullPlayerView from '../../../../src/views/full/FullPlayerView.js';
import View from '../../../../lib/core/View.js';
import FullTextCardController from '../../../../src/controllers/full/FullTextCardController.js';
import FullVideoCardController from '../../../../src/controllers/full/FullVideoCardController.js';
import FullRecapCardController from '../../../../src/controllers/full/FullRecapCardController.js';
import PlaylistViewController from '../../../../src/controllers/PlaylistViewController.js';
import DisplayAdController from '../../../../src/controllers/DisplayAdController.js';
import Runner from '../../../../lib/Runner.js';
import {
    map
} from '../../../../lib/utils.js';

function makeString(length) {
    return map(new Array(length), () => 'c').join('');
}

describe('FullPlayerController', function() {
    let FullPlayerCtrl;
    let rootView;

    beforeEach(function() {
        rootView = new View();
        spyOn(FullPlayerController.prototype, 'addListeners').and.callThrough();
        spyOn(PlayerController.prototype, 'addListeners');

        FullPlayerCtrl = new FullPlayerController(rootView);
    });

    it('should exist', function() {
        expect(FullPlayerCtrl).toEqual(jasmine.any(PlayerController));
    });

    it('should add its listeners', function() {
        expect(FullPlayerCtrl.addListeners).toHaveBeenCalled();
    });

    it('should add its parent\'s listeners', function() {
        expect(PlayerController.prototype.addListeners).toHaveBeenCalled();
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a FullPlayerView', function() {
                expect(FullPlayerCtrl.view).toEqual(jasmine.any(FullPlayerView));
            });
        });

        describe('PlaylistViewCtrl', function() {
            it('should be a PlaylistViewController', function() {
                expect(FullPlayerCtrl.PlaylistViewCtrl).toEqual(jasmine.any(PlaylistViewController));
            });
        });

        describe('DisplayAdCtrl', function() {
            it('should be a DisplayAdController', function() {
                expect(FullPlayerCtrl.DisplayAdCtrl).toEqual(jasmine.any(DisplayAdController));
            });
        });

        describe('CardControllers', function() {
            it('should have a Controller for each card type', function() {
                expect(FullPlayerCtrl.CardControllers.text).toBe(FullTextCardController);
                expect(FullPlayerCtrl.CardControllers.video).toBe(FullVideoCardController);
                expect(FullPlayerCtrl.CardControllers.recap).toBe(FullRecapCardController);
            });
        });
    });

    describe('events:', function() {
        describe('DisplayAdCtrl', function() {
            describe('activate', function() {
                beforeEach(function() {
                    spyOn(FullPlayerCtrl.PlaylistViewCtrl, 'contract');

                    FullPlayerCtrl.DisplayAdCtrl.emit('activate');
                });

                it('should contract the Playlist', function() {
                    expect(FullPlayerCtrl.PlaylistViewCtrl.contract).toHaveBeenCalled();
                });
            });

            describe('deactivate', function() {
                beforeEach(function() {
                    spyOn(FullPlayerCtrl.PlaylistViewCtrl, 'expand');

                    FullPlayerCtrl.DisplayAdCtrl.emit('deactivate');
                });

                it('should expand the Playlist', function() {
                    expect(FullPlayerCtrl.PlaylistViewCtrl.expand).toHaveBeenCalled();
                });
            });
        });

        describe('minireel', function() {
            beforeEach(function() {
                spyOn(FullPlayerCtrl.PlaylistViewCtrl.view, 'update');
            });

            describe('init', function() {
                beforeEach(function() {
                    Runner.run(() => FullPlayerCtrl.view.create());
                    spyOn(FullPlayerCtrl.PlaylistViewCtrl, 'renderInto');
                    spyOn(FullPlayerCtrl.DisplayAdCtrl, 'renderInto');

                    FullPlayerCtrl.minireel.emit('init');
                });

                it('should render the playlist into its outlet', function() {
                    expect(FullPlayerCtrl.PlaylistViewCtrl.renderInto).toHaveBeenCalledWith(FullPlayerCtrl.view.playlistOutlet);
                });

                it('should render the display ad into its outlet', function() {
                    expect(FullPlayerCtrl.DisplayAdCtrl.renderInto).toHaveBeenCalledWith(FullPlayerCtrl.view.displayAdOutlet);
                });
            });

            describe('becameUnskippable', function() {
                beforeEach(function() {
                    spyOn(FullPlayerCtrl.PlaylistViewCtrl, 'disable');

                    FullPlayerCtrl.minireel.emit('becameUnskippable');
                });

                it('should disable the playlist', function() {
                    expect(FullPlayerCtrl.PlaylistViewCtrl.disable).toHaveBeenCalled();
                });
            });

            describe('becameSkippable', function() {
                beforeEach(function() {
                    spyOn(FullPlayerCtrl.PlaylistViewCtrl, 'enable');

                    FullPlayerCtrl.minireel.emit('becameSkippable');
                });

                it('should enable the playlist', function() {
                    expect(FullPlayerCtrl.PlaylistViewCtrl.enable).toHaveBeenCalled();
                });
            });

            describe('move', function() {
                beforeEach(function() {
                    spyOn(FullPlayerCtrl.view, 'setButtonSize');
                    spyOn(FullPlayerCtrl.view, 'showNavigation');
                    spyOn(FullPlayerCtrl.view, 'hideNavigation');
                    spyOn(FullPlayerCtrl.view, 'expand');
                    spyOn(FullPlayerCtrl.view, 'contract');
                    spyOn(FullPlayerCtrl.PlaylistViewCtrl, 'show');
                    spyOn(FullPlayerCtrl.PlaylistViewCtrl, 'hide');
                    spyOn(FullPlayerCtrl.DisplayAdCtrl, 'activate');
                    spyOn(FullPlayerCtrl.DisplayAdCtrl, 'deactivate');
                });

                describe('if the currentCard has the displayAd module', function() {
                    beforeEach(function() {
                        FullPlayerCtrl.minireel.currentCard = { modules: { displayAd: {} } };
                        FullPlayerCtrl.minireel.emit('move');
                    });

                    it('should set the DisplayAdCtrl\'s model to the displayAd module', function() {
                        expect(FullPlayerCtrl.DisplayAdCtrl.model).toBe(FullPlayerCtrl.minireel.currentCard.modules.displayAd);
                    });

                    it('should activate the DisplayAdCtrl', function() {
                        expect(FullPlayerCtrl.DisplayAdCtrl.activate).toHaveBeenCalled();
                        expect(FullPlayerCtrl.DisplayAdCtrl.deactivate).not.toHaveBeenCalled();
                    });
                });

                describe('if the currentCard does not have the displayAd module', function() {
                    beforeEach(function() {
                        FullPlayerCtrl.minireel.currentCard = { modules: {} };
                        FullPlayerCtrl.minireel.emit('move');
                    });

                    it('should deactivate the DisplayAdCtrl', function() {
                        expect(FullPlayerCtrl.DisplayAdCtrl.activate).not.toHaveBeenCalled();
                        expect(FullPlayerCtrl.DisplayAdCtrl.deactivate).toHaveBeenCalled();
                    });
                });

                describe('if the current card is a TextCard', function() {
                    beforeEach(function() {
                        FullPlayerCtrl.minireel.currentCard = { type: 'text', modules: {} };
                        FullPlayerCtrl.minireel.emit('move');
                    });

                    it('should hide the navigation', function() {
                        expect(FullPlayerCtrl.view.hideNavigation).toHaveBeenCalled();
                        expect(FullPlayerCtrl.view.showNavigation).not.toHaveBeenCalled();
                    });
                });

                describe('if the currentCard is a recap card', function() {
                    beforeEach(function() {
                        FullPlayerCtrl.minireel.currentCard = { type: 'recap', modules: {} };
                        FullPlayerCtrl.minireel.emit('move');
                    });

                    it('should expand its view', function() {
                        expect(FullPlayerCtrl.view.expand).toHaveBeenCalled();
                        expect(FullPlayerCtrl.view.contract).not.toHaveBeenCalled();
                    });

                    it('should hide the playlist', function() {
                        expect(FullPlayerCtrl.PlaylistViewCtrl.hide).toHaveBeenCalled();
                        expect(FullPlayerCtrl.PlaylistViewCtrl.show).not.toHaveBeenCalled();
                    });
                });

                describe('if the currentCard is not a recap card', function() {
                    beforeEach(function() {
                        FullPlayerCtrl.minireel.currentCard = { type: 'video', modules: {} };
                        FullPlayerCtrl.minireel.emit('move');
                    });

                    it('should contract its view', function() {
                        expect(FullPlayerCtrl.view.expand).not.toHaveBeenCalled();
                        expect(FullPlayerCtrl.view.contract).toHaveBeenCalled();
                    });

                    it('should show the playlist', function() {
                        expect(FullPlayerCtrl.PlaylistViewCtrl.show).toHaveBeenCalled();
                        expect(FullPlayerCtrl.PlaylistViewCtrl.hide).not.toHaveBeenCalled();
                    });
                });

                describe('if the current card is not a TextCard', function() {
                    beforeEach(function() {
                        FullPlayerCtrl.minireel.currentCard = { type: 'video', modules: {} };
                        FullPlayerCtrl.minireel.emit('move');
                    });

                    it('should show the navigation', function() {
                        expect(FullPlayerCtrl.view.hideNavigation).not.toHaveBeenCalled();
                        expect(FullPlayerCtrl.view.showNavigation).toHaveBeenCalled();
                    });
                });

                describe('if the currentCard\'s title and note are <= 100 chars', function() {
                    beforeEach(function() {
                        [[25, 10], [30, 55], [50, 50]].forEach(([titleLength, noteLength]) => {
                            FullPlayerCtrl.minireel.currentCard = { title: makeString(titleLength), note: makeString(noteLength), modules: {} };
                            FullPlayerCtrl.minireel.emit('move');
                        });
                    });

                    it('should set the button size to small', function() {
                        expect(FullPlayerCtrl.view.setButtonSize.calls.count()).toBe(3);
                        FullPlayerCtrl.view.setButtonSize.calls.all().forEach(call => expect(call.args).toEqual(['small']));
                    });
                });

                describe('if the currentCard\'s title and note are between 101 and 200 chars', function() {
                    beforeEach(function() {
                        [[100, 1], [110, 20], [100, 100]].forEach(([titleLength, noteLength]) => {
                            FullPlayerCtrl.minireel.currentCard = { title: makeString(titleLength), note: makeString(noteLength), modules: {} };
                            FullPlayerCtrl.minireel.emit('move');
                        });
                    });

                    it('should set the button size to med', function() {
                        expect(FullPlayerCtrl.view.setButtonSize.calls.count()).toBe(3);
                        FullPlayerCtrl.view.setButtonSize.calls.all().forEach(call => expect(call.args).toEqual(['med']));
                    });
                });

                describe('if the currentCard\'s title and note are above 200 chars', function() {
                    beforeEach(function() {
                        [[1, 200], [100, 200], [50, 700]].forEach(([titleLength, noteLength]) => {
                            FullPlayerCtrl.minireel.currentCard = { title: makeString(titleLength), note: makeString(noteLength), modules: {} };
                            FullPlayerCtrl.minireel.emit('move');
                        });
                    });

                    it('should set the button size to med', function() {
                        expect(FullPlayerCtrl.view.setButtonSize.calls.count()).toBe(3);
                        FullPlayerCtrl.view.setButtonSize.calls.all().forEach(call => expect(call.args).toEqual(['large']));
                    });
                });

                describe('if the minireel is closed', function() {
                    beforeEach(function() {
                        FullPlayerCtrl.minireel.currentCard = null;
                        FullPlayerCtrl.minireel.emit('move');
                    });

                    it('should not set the button size', function() {
                        expect(FullPlayerCtrl.view.setButtonSize).not.toHaveBeenCalled();
                    });
                });

                describe('if the currentCard has no title or note', function() {
                    beforeEach(function() {
                        FullPlayerCtrl.minireel.currentCard = { title: null, note: null, modules: {} };
                        FullPlayerCtrl.minireel.emit('move');
                    });

                    it('should set the button size to small', function() {
                        expect(FullPlayerCtrl.view.setButtonSize).toHaveBeenCalledWith('small');
                    });
                });
            });
        });
    });

    describe('methods:', function() {
        describe('updateView()', function() {
            beforeEach(function() {
                spyOn(PlayerController.prototype, 'updateView');
                spyOn(FullPlayerCtrl.view, 'update');
                FullPlayerCtrl.minireel.splash = '/my-splash.jpg';

                FullPlayerCtrl.updateView();
            });

            it('should update its view with the splash image', function() {
                expect(FullPlayerCtrl.view.update).toHaveBeenCalledWith({
                    splash: FullPlayerCtrl.minireel.splash
                });
            });

            it('should call super()', function() {
                expect(PlayerController.prototype.updateView).toHaveBeenCalled();
            });
        });
    });
});
