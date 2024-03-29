import FullscreenPlayerController from '../../../src/mixins/FullscreenPlayerController.js';
import PlayerController from '../../../src/controllers/PlayerController.js';
import PlayerView from '../../../src/views/PlayerView.js';
import Runner from '../../../lib/Runner.js';
import View from '../../../lib/core/View.js';
import dispatcher from '../../../src/services/dispatcher.js';
class MyPlayerController extends PlayerController {}
MyPlayerController.mixin(FullscreenPlayerController);
class DeckView extends View {
    show() {}
    hide() {}
}

describe('FullscreenPlayerController', function() {
    let Ctrl;
    let experience;

    beforeEach(function() {
        spyOn(dispatcher, 'addClient');
        experience = { data: { collateral: {} } };

        Ctrl = new MyPlayerController(new View(document.createElement('body')));
        Ctrl.view = new PlayerView();
    });

    it('should exist', function() {
        expect(Ctrl).toEqual(jasmine.any(PlayerController));
    });

    describe('methods:', function() {
        describe('initFullscreen()', function() {
            beforeEach(function() {
                Ctrl.initFullscreen();
            });

            describe('events:', function() {
                describe('minireel', function() {
                    describe('launch', function() {
                        beforeEach(function() {
                            Ctrl.view.cards = new DeckView();
                            Ctrl.view.prerollOutlet = new DeckView();
                            spyOn(Ctrl.minireel.embed, 'ping');
                            spyOn(Ctrl.view, 'update');

                            Ctrl.minireel.adConfig = {
                                video: {}
                            };
                            Ctrl.minireel.deck = [];
                            Ctrl.minireel.campaign = {};

                            Runner.run(() => Ctrl.minireel.emit('init'));

                            Ctrl.cardCtrls.forEach(Ctrl => spyOn(Ctrl, 'render'));
                            Runner.run(() => Ctrl.minireel.emit('launch'));
                        });

                        it('should enter fullscreen mode', function() {
                            expect(Ctrl.minireel.embed.ping).toHaveBeenCalledWith('fullscreen', true);
                        });
                    });

                    describe('close', function() {
                        beforeEach(function() {
                            spyOn(Ctrl.minireel.embed, 'ping');
                            Ctrl.minireel.emit('close');
                        });

                        it('should leave fullscreen mode', function() {
                            expect(Ctrl.minireel.embed.ping).toHaveBeenCalledWith('fullscreen', false);
                        });
                    });
                });
            });
        });
    });
});
