import PlayerController from '../../../src/controllers/PlayerController.js';
import ResizingPlayerController from '../../../src/mixins/ResizingPlayerController.js';
import Runner from '../../../lib/Runner.js';
import dispatcher from '../../../src/services/dispatcher.js';
import PlayerView from '../../../src/views/PlayerView.js';
import {
    map
} from '../../../lib/utils.js';
class MyPlayerController extends PlayerController {}
MyPlayerController.mixin(ResizingPlayerController);

function makeString(length) {
    return map(new Array(length), () => 'c').join('');
}

describe('ResizingPlayerController mixin', function() {
    let Ctrl;

    beforeEach(function() {
        spyOn(dispatcher, 'addClient');

        Ctrl = new MyPlayerController();
    });

    it('should exist', function() {
        expect(Ctrl).toEqual(jasmine.any(PlayerController));
    });

    describe('methods:', function() {
        describe('initResizing()', function() {
            beforeEach(function() {
                Ctrl.initResizing();
            });

            describe('events:', function() {
                describe('minireel', function() {
                    beforeEach(function() {
                        Ctrl.view = new PlayerView();
                    });

                    describe('move', function() {
                        beforeEach(function() {
                            Ctrl.view.setButtonSize = jasmine.createSpy('view.setButtonSize()');
                            spyOn(Ctrl.view, 'showNavigation');
                            spyOn(Ctrl.view, 'hideNavigation');
                            spyOn(PlayerController.prototype, 'updateView');
                        });

                        describe('if the currentCard\'s title and note are <= 100 chars', function() {
                            beforeEach(function() {
                                [[25, 10], [30, 55], [50, 50]].forEach(([titleLength, noteLength]) => {
                                    Ctrl.minireel.currentCard = { title: makeString(titleLength), note: makeString(noteLength), modules: {} };
                                    Runner.run(() => Ctrl.minireel.emit('move'));
                                });
                            });

                            it('should set the button size to small', function() {
                                expect(Ctrl.view.setButtonSize.calls.count()).toBe(3);
                                Ctrl.view.setButtonSize.calls.all().forEach(call => expect(call.args).toEqual(['small']));
                            });
                        });

                        describe('if the currentCard\'s title and note are between 101 and 200 chars', function() {
                            beforeEach(function() {
                                [[100, 1], [110, 20], [100, 100]].forEach(([titleLength, noteLength]) => {
                                    Ctrl.minireel.currentCard = { title: makeString(titleLength), note: makeString(noteLength), modules: {} };
                                    Runner.run(() => Ctrl.minireel.emit('move'));
                                });
                            });

                            it('should set the button size to med', function() {
                                expect(Ctrl.view.setButtonSize.calls.count()).toBe(3);
                                Ctrl.view.setButtonSize.calls.all().forEach(call => expect(call.args).toEqual(['med']));
                            });
                        });

                        describe('if the currentCard\'s title and note are above 200 chars', function() {
                            beforeEach(function() {
                                [[1, 200], [100, 200], [50, 700]].forEach(([titleLength, noteLength]) => {
                                    Ctrl.minireel.currentCard = { title: makeString(titleLength), note: makeString(noteLength), modules: {} };
                                    Runner.run(() => Ctrl.minireel.emit('move'));
                                });
                            });

                            it('should set the button size to med', function() {
                                expect(Ctrl.view.setButtonSize.calls.count()).toBe(3);
                                Ctrl.view.setButtonSize.calls.all().forEach(call => expect(call.args).toEqual(['large']));
                            });
                        });

                        describe('if the minireel is closed', function() {
                            beforeEach(function() {
                                Ctrl.minireel.currentCard = null;
                                Runner.run(() => Ctrl.minireel.emit('move'));
                            });

                            it('should not set the button size', function() {
                                expect(Ctrl.view.setButtonSize).not.toHaveBeenCalled();
                            });
                        });

                        describe('if the currentCard has no title or note', function() {
                            beforeEach(function() {
                                Ctrl.minireel.currentCard = { title: null, note: null, modules: {} };
                                Runner.run(() => Ctrl.minireel.emit('move'));
                            });

                            it('should set the button size to small', function() {
                                expect(Ctrl.view.setButtonSize).toHaveBeenCalledWith('small');
                            });
                        });
                    });
                });
            });
        });
    });
});
