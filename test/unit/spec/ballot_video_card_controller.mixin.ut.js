import BallotVideoCardController from '../../../src/mixins/BallotVideoCardController.js';
import VideoCardController from '../../../src/controllers/VideoCardController.js';
import { EventEmitter } from 'events';
import BallotController from '../../../src/controllers/BallotController.js';
import VideoCardView from '../../../src/views/VideoCardView.js';
import View from '../../../lib/core/View.js';
import PlayerOutletView from '../../../src/views/PlayerOutletView.js';
import Runner from '../../../lib/Runner.js';

describe('BallotVideoCardController mixin', function() {
    class MyVideoCardController extends VideoCardController {}
    let render = MyVideoCardController.prototype.render = jasmine.createSpy('VideoCardController.prototype.render()');
    let canAutoadvance = MyVideoCardController.prototype.canAutoadvance = jasmine.createSpy('VideoCardController.prototype.canAutoadvance()');
    MyVideoCardController.mixin(BallotVideoCardController);

    let Ctrl;
    let card;

    beforeEach(function() {
        card = new EventEmitter();
        card.data = { type: 'youtube' };
        card.modules = {};
        card.thumbs = {};
        card.getSrc = jasmine.createSpy('card.getSrc()');

        canAutoadvance.and.returnValue(true);

        Ctrl = new MyVideoCardController(card);
        Ctrl.view = new VideoCardView();
    });

    it('should exist', function() {
        expect(Ctrl).toEqual(jasmine.any(VideoCardController));
    });

    describe('methods:', function() {
        describe('initBallot()', function() {
            describe('if there is no ballot module', function() {
                beforeEach(function() {
                    delete card.modules.ballot;

                    Ctrl.initBallot();
                });

                it('should not give the controller a BallotCtrl', function() {
                    expect('BallotCtrl' in Ctrl).toBe(false);
                });
            });

            describe('if there is a ballot module', function() {
                let ballot;

                beforeEach(function() {
                    ballot = card.modules.ballot = new EventEmitter();

                    Ctrl.initBallot();
                });

                it('should give the controller a BallotCtrl', function() {
                    expect(Ctrl.BallotCtrl).toEqual(jasmine.any(BallotController));
                    expect(Ctrl.BallotCtrl.model).toBe(ballot);
                });

                describe('events:', function() {
                    describe('BallotCtrl:', function() {
                        beforeEach(function() {
                            Ctrl.view.playerOutlet = new PlayerOutletView();
                        });

                        describe('activate', function() {
                            beforeEach(function() {
                                spyOn(Ctrl.view.playerOutlet, 'hide');

                                Ctrl.BallotCtrl.emit('activate');
                            });

                            it('should hide the playerOutlet', function() {
                                expect(Ctrl.view.playerOutlet.hide).toHaveBeenCalled();
                            });
                        });

                        describe('deactivate', function() {
                            beforeEach(function() {
                                spyOn(Ctrl.view.playerOutlet, 'show');

                                Ctrl.BallotCtrl.emit('deactivate');
                            });

                            it('should show the playerOutlet', function() {
                                expect(Ctrl.view.playerOutlet.show).toHaveBeenCalled();
                            });
                        });

                        describe('vote', function() {
                            beforeEach(function() {
                                spyOn(Ctrl.BallotCtrl, 'deactivate');

                                Ctrl.BallotCtrl.emit('vote');
                            });

                            it('should deactivate() the BallotCtrl', function() {
                                expect(Ctrl.BallotCtrl.deactivate).toHaveBeenCalled();
                            });
                        });
                    });

                    describe('player:', function() {
                        describe('play', function() {
                            beforeEach(function() {
                                spyOn(Ctrl.BallotCtrl, 'deactivate');

                                Ctrl.player.emit('play');
                            });

                            it('should deactivate the BallotCtrl', function() {
                                expect(Ctrl.BallotCtrl.deactivate).toHaveBeenCalled();
                            });
                        });

                        describe('pause', function() {
                            beforeEach(function() {
                                spyOn(Ctrl.BallotCtrl, 'activate');
                            });

                            describe('if a vote has not been cast', function() {
                                beforeEach(function() {
                                    ballot.choice = null;

                                    Ctrl.player.emit('pause');
                                });

                                it('should activate the BallotCtrl', function() {
                                    expect(Ctrl.BallotCtrl.activate).toHaveBeenCalled();
                                });
                            });

                            describe('if a vote has been cast', function() {
                                beforeEach(function() {
                                    ballot.choice = 0;

                                    Ctrl.player.emit('pause');
                                });

                                it('should do nothing', function() {
                                    expect(Ctrl.BallotCtrl.activate).not.toHaveBeenCalled();
                                });
                            });
                        });
                    });

                    describe('model:', function() {
                        describe('deactivate', function() {
                            beforeEach(function() {
                                spyOn(Ctrl.BallotCtrl, 'deactivate');

                                Runner.run(() => card.emit('deactivate'));
                            });

                            it('should deactivate the BallotCtrl', function() {
                                expect(Ctrl.BallotCtrl.deactivate).toHaveBeenCalled();
                            });
                        });
                    });
                });
            });
        });

        describe('render()', function() {
            beforeEach(function() {
                Ctrl.view.ballotOutlet = new View();
            });

            describe('if there is no ballot', function() {
                beforeEach(function() {
                    delete card.modules.ballot;
                    Ctrl.initBallot();

                    Ctrl.render();
                });

                it('should call this.super()', function() {
                    expect(render).toHaveBeenCalled();
                });
            });

            describe('if there is a ballot', function() {
                beforeEach(function() {
                    card.modules.ballot = new EventEmitter();
                    Ctrl.initBallot();
                    spyOn(Ctrl.BallotCtrl, 'renderInto');

                    Ctrl.render();
                });

                it('should call this.super()', function() {
                    expect(render).toHaveBeenCalled();
                });

                it('should render the BallotCtrl', function() {
                    expect(Ctrl.BallotCtrl.renderInto).toHaveBeenCalledWith(Ctrl.view.ballotOutlet);
                });
            });
        });

        describe('canAutoadvance()', function() {
            describe('if there is no ballot', function() {
                beforeEach(function() {
                    delete card.modules.ballot;
                });

                it('should return true', function() {
                    expect(Ctrl.canAutoadvance()).toBe(true);
                });

                describe('if the parent can\'t autoadvance', function() {
                    beforeEach(function() {
                        canAutoadvance.and.returnValue(false);
                    });

                    it('should return false', function() {
                        expect(Ctrl.canAutoadvance()).toBe(false);
                    });
                });
            });

            describe('if there is a ballot', function() {
                beforeEach(function() {
                    card.modules.ballot = new EventEmitter();
                });

                describe('if the user has voted', function() {
                    beforeEach(function() {
                        card.modules.ballot.choice = 0;
                    });

                    it('should be true', function() {
                        expect(Ctrl.canAutoadvance()).toBe(true);
                    });

                    describe('if the parent can\'t autoadvance', function() {
                        beforeEach(function() {
                            canAutoadvance.and.returnValue(false);
                        });

                        it('should return false', function() {
                            expect(Ctrl.canAutoadvance()).toBe(false);
                        });
                    });
                });

                describe('if the user has not voted', function() {
                    beforeEach(function() {
                        card.modules.ballot.choice = null;
                    });

                    it('should be false', function() {
                        expect(Ctrl.canAutoadvance()).toBe(false);
                    });
                });
            });
        });
    });
});
