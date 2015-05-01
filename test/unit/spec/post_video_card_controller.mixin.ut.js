import PostVideoCardController from '../../../src/mixins/PostVideoCardController.js';
import VideoCardController from '../../../src/controllers/VideoCardController.js';
import { EventEmitter } from 'events';
import PostController from '../../../src/controllers/PostController.js';
import VideoCardView from '../../../src/views/VideoCardView.js';
import PlayerOutletView from '../../../src/views/PlayerOutletView.js';
import Runner from '../../../lib/Runner.js';
import View from '../../../lib/core/View.js';

describe('PostVideoCardController', function() {
    class MyVideoCardController extends VideoCardController {}
    let canAutoadvance = MyVideoCardController.prototype.canAutoadvance = jasmine.createSpy('Ctrl.canAutoadvance()').and.returnValue(true);
    let render = MyVideoCardController.prototype.render = jasmine.createSpy('Ctrl.render()');
    MyVideoCardController.mixin(PostVideoCardController);

    let Ctrl;
    let card;

    beforeEach(function() {
        card = new EventEmitter();
        card.modules = {};
        card.data = { type: 'youtube' };
        card.thumbs = {};
        card.getSrc = jasmine.createSpy('card.getSrc()');
        card.complete = jasmine.createSpy('card.complete()');

        Ctrl = new MyVideoCardController(card);
        Ctrl.view = new VideoCardView();
    });

    it('should exist', function() {
        expect(Ctrl).toEqual(jasmine.any(VideoCardController));
    });

    describe('methods:', function() {
        describe('initPost()', function() {
            describe('if there is no post', function() {
                beforeEach(function() {
                    delete card.modules.post;

                    Ctrl.initPost();
                });

                it('should not give the controller a PostController', function() {
                    expect('PostCtrl' in Ctrl).toBe(false);
                });
            });

            describe('if there is a post', function() {
                beforeEach(function() {
                    card.modules.post = {};

                    Ctrl.initPost();
                });

                it('should give the controller a PostController', function() {
                    expect(Ctrl.PostCtrl).toEqual(jasmine.any(PostController));
                });

                describe('events:', function() {
                    describe('PostCtrl:', function() {
                        let player;

                        beforeEach(function() {
                            Ctrl.view.playerOutlet = new PlayerOutletView();
                            player = Ctrl.player;
                        });

                        describe('activate', function() {
                            beforeEach(function() {
                                spyOn(Ctrl.view.playerOutlet, 'hide');

                                Ctrl.PostCtrl.emit('activate');
                            });

                            it('should hide the playerOutlet', function() {
                                expect(Ctrl.view.playerOutlet.hide).toHaveBeenCalled();
                            });
                        });

                        describe('deactivate', function() {
                            beforeEach(function() {
                                spyOn(Ctrl.view.playerOutlet, 'show');

                                Ctrl.PostCtrl.emit('deactivate');
                            });

                            it('should hide the playerOutlet', function() {
                                expect(Ctrl.view.playerOutlet.show).toHaveBeenCalled();
                            });
                        });

                        describe('replay', function() {
                            beforeEach(function() {
                                spyOn(player, 'play');

                                Ctrl.PostCtrl.emit('replay');
                            });

                            it('should play the video', function() {
                                expect(player.play).toHaveBeenCalled();
                            });
                        });
                    });

                    describe('model:', function() {
                        describe('deactivate', function() {
                            beforeEach(function() {
                                spyOn(Ctrl.PostCtrl, 'deactivate');

                                Runner.run(() => card.emit('deactivate'));
                            });

                            it('should deactivate the PostCtrl', function() {
                                expect(Ctrl.PostCtrl.deactivate).toHaveBeenCalled();
                            });
                        });
                    });

                    describe('player:', function() {
                        let player;

                        beforeEach(function() {
                            player = Ctrl.player;
                        });

                        describe('play', function() {
                            beforeEach(function() {
                                spyOn(Ctrl.PostCtrl, 'deactivate');

                                Runner.run(() => player.emit('play'));
                            });

                            it('should deactivate the PostCtrl', function() {
                                expect(Ctrl.PostCtrl.deactivate).toHaveBeenCalled();
                            });
                        });

                        describe('ended', function() {
                            beforeEach(function() {
                                spyOn(Ctrl.PostCtrl, 'activate');
                                spyOn(player, 'reload');

                                Runner.run(() => player.emit('ended'));
                            });

                            it('should activate the PostCtrl', function() {
                                expect(Ctrl.PostCtrl.activate).toHaveBeenCalled();
                            });
                        });
                    });
                });
            });
        });

        describe('canAutoadvance()', function() {
            describe('if the post module is present', function() {
                beforeEach(function() {
                    card.modules.post = {};
                });

                it('should be false', function() {
                    expect(Ctrl.canAutoadvance()).toBe(false);
                });
            });

            describe('if the post module is not present', function() {
                beforeEach(function() {
                    delete card.modules.post;
                });

                it('should be true', function() {
                    expect(Ctrl.canAutoadvance()).toBe(true);
                });

                describe('if this.super() is false', function() {
                    beforeEach(function() {
                        canAutoadvance.and.returnValue(false);
                    });

                    it('should be false', function() {
                        expect(Ctrl.canAutoadvance()).toBe(false);
                    });
                });
            });
        });

        describe('render()', function() {
            beforeEach(function() {
                Ctrl.view.postOutlet = new View();
            });

            describe('if the post module is present', function() {
                beforeEach(function() {
                    card.modules.post = {};
                    Ctrl.initPost();
                    spyOn(Ctrl.PostCtrl, 'renderInto');

                    Ctrl.render();
                });

                it('should call this.super()', function() {
                    expect(render).toHaveBeenCalled();
                });

                it('should render the PostCtrl into the postOutlet', function() {
                    expect(Ctrl.PostCtrl.renderInto).toHaveBeenCalledWith(Ctrl.view.postOutlet);
                });
            });

            describe('if the post module is not present', function() {
                beforeEach(function() {
                    delete card.modules.post;
                    Ctrl.initPost();

                    Ctrl.render();
                });

                it('should call this.super()', function() {
                    expect(render).toHaveBeenCalled();
                });
            });
        });
    });
});
