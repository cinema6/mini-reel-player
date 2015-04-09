import DisplayAdVideoCardController from '../../../src/mixins/DisplayAdVideoCardController.js';
import VideoCardController from '../../../src/controllers/VideoCardController.js';
import {EventEmitter} from 'events';
import VideoCardView from '../../../src/views/VideoCardView.js';
import Runner from '../../../lib/Runner.js';
import CorePlayer from '../../../src/players/CorePlayer.js';
import playerFactory from '../../../src/services/player_factory.js';

class MockPlayer extends CorePlayer {
    play() {}
    load() {}
    pause() {}
    unload() {}
}

describe('DisplayAdVideoCardController', function() {
    let Ctrl;
    let card;

    class MyVideoCardController extends VideoCardController {}
    let render = MyVideoCardController.prototype.render = jasmine.createSpy('render()');
    MyVideoCardController.mixin(DisplayAdVideoCardController);

    beforeEach(function() {
        card = new EventEmitter();
        card.data = { type: 'youtube' };
        card.modules = {};
        card.thumbs = {};

        spyOn(playerFactory, 'playerForCard').and.returnValue(new MockPlayer());

        Ctrl = new MyVideoCardController(card);
        Ctrl.view = new VideoCardView();
    });

    it('should exist', function() {
        expect(Ctrl).toEqual(jasmine.any(VideoCardController));
    });

    describe('methods:', function() {
        describe('initDisplayAd()', function() {
            describe('if there is a displayAd', function() {
                beforeEach(function() {
                    card.modules.displayAd = {};

                    Ctrl = new MyVideoCardController(card);
                    Ctrl.view = new VideoCardView();
                    Ctrl.initDisplayAd();
                });

                describe('events:', function() {
                    describe('model', function() {
                        describe('activate', function() {
                            beforeEach(function() {
                                spyOn(Ctrl.moduleControllers.displayAd, 'activate');

                                Runner.run(() => card.emit('activate'));
                            });

                            it('should activate the DisplayAdCtrl', function() {
                                expect(Ctrl.moduleControllers.displayAd.activate).toHaveBeenCalled();
                            });
                        });

                        describe('deactivate', function() {
                            beforeEach(function() {
                                spyOn(Ctrl.moduleControllers.displayAd, 'deactivate');

                                Runner.run(() => card.emit('deactivate'));
                            });

                            it('should deactivate the DisplayAdCtrl', function() {
                                expect(Ctrl.moduleControllers.displayAd.deactivate).toHaveBeenCalled();
                            });
                        });
                    });
                });
            });

            describe('if there is no displayAd', function() {
                beforeEach(function() {
                    delete card.modules.displayAd;

                    Ctrl = new MyVideoCardController(card);
                    Ctrl.view = new VideoCardView();
                    Ctrl.initDisplayAd();
                });

                describe('events:', function() {
                    describe('model', function() {
                        describe('activate', function() {
                            it('should do nothing', function() {
                                expect(function() {
                                    Runner.run(() => card.emit('activate'));
                                }).not.toThrow();
                            });
                        });

                        describe('deactivate', function() {
                            it('should do nothing', function() {
                                expect(function() {
                                    Runner.run(() => card.emit('deactivate'));
                                }).not.toThrow();
                            });
                        });
                    });
                });
            });
        });

        describe('render()', function() {
            beforeEach(function() {
                spyOn(Ctrl.view, 'update');
            });

            describe('if there is no displayAd module', function() {
                beforeEach(function() {
                    delete card.modules.displayAd;

                    Ctrl.render();
                });

                it('should update the view with hasDisplayAd set to false', function() {
                    expect(Ctrl.view.update).toHaveBeenCalledWith({ hasDisplayAd: false });
                });

                it('should call this.super()', function() {
                    expect(render).toHaveBeenCalled();
                });
            });

            describe('if there is a displayAd module', function() {
                beforeEach(function() {
                    card.modules.displayAd = {};

                    Ctrl.render();
                });

                it('should update the view with hasDisplayAd set to true', function() {
                    expect(Ctrl.view.update).toHaveBeenCalledWith({ hasDisplayAd: true });
                });

                it('should call this.super()', function() {
                    expect(render).toHaveBeenCalled();
                });
            });
        });
    });
});
