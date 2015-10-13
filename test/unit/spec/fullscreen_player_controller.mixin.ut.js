import FullscreenPlayerController from '../../../src/mixins/FullscreenPlayerController.js';
import PlayerController from '../../../src/controllers/PlayerController.js';
import PrerollCardController from '../../../src/controllers/PrerollCardController.js';
import cinema6 from '../../../src/services/cinema6.js';
import PlayerView from '../../../src/views/PlayerView.js';
import Runner from '../../../lib/Runner.js';
import View from '../../../lib/core/View.js';
import PrerollCard from '../../../src/models/PrerollCard.js';
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
        Ctrl.CardControllers.preroll = PrerollCardController;
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
                            spyOn(cinema6, 'fullscreen');
                            spyOn(Ctrl.view, 'update');
                            spyOn(PrerollCardController.prototype, 'renderInto');

                            Ctrl.minireel.adConfig = {
                                video: {}
                            };
                            Ctrl.minireel.prerollCard = new PrerollCard({ data: {}, collateral: {}, params: {} }, experience, { flash: false }, Ctrl.minireel);
                            Ctrl.minireel.deck = [];
                            Ctrl.minireel.campaign = {};

                            Runner.run(() => Ctrl.minireel.emit('init'));

                            Ctrl.cardCtrls.forEach(Ctrl => spyOn(Ctrl, 'render'));
                            Runner.run(() => Ctrl.minireel.emit('launch'));
                        });

                        it('should enter fullscreen mode', function() {
                            expect(cinema6.fullscreen).toHaveBeenCalledWith(true);
                        });
                    });

                    describe('close', function() {
                        beforeEach(function() {
                            spyOn(cinema6, 'fullscreen');
                            Ctrl.minireel.emit('close');
                        });

                        it('should leave fullscreen mode', function() {
                            expect(cinema6.fullscreen).toHaveBeenCalledWith(false);
                        });
                    });
                });
            });
        });
    });
});
