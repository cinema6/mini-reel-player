import FullscreenPlayerController from '../../../src/mixins/FullscreenPlayerController.js';
import PlayerController from '../../../src/controllers/PlayerController.js';
import cinema6 from '../../../src/services/cinema6.js';
import PlayerView from '../../../src/views/PlayerView.js';
import Runner from '../../../lib/Runner.js';
import View from '../../../lib/core/View.js';
class MyPlayerController extends PlayerController {}
MyPlayerController.mixin(FullscreenPlayerController);

describe('FullscreenPlayerController', function() {
    let Ctrl;
    let experience;

    beforeEach(function() {
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
                            spyOn(cinema6, 'fullscreen');
                            spyOn(Ctrl.view, 'update');

                            Ctrl.minireel.deck = [];

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
