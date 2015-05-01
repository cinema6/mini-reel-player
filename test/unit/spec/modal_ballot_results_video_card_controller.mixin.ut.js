import ModalBallotResultsVideoCardController from '../../../src/mixins/ModalBallotResultsVideoCardController.js';
import VideoCardController from '../../../src/controllers/VideoCardController.js';
import { EventEmitter } from 'events';
import VideoCardView from '../../../src/views/VideoCardView.js';
import BallotController from '../../../src/controllers/BallotController.js';
import ModalBallotResultsController from '../../../src/controllers/ModalBallotResultsController.js';
import View from '../../../lib/core/View.js';
import PlayerOutletView from '../../../src/views/PlayerOutletView.js';
import Runner from '../../../lib/Runner.js';

describe('ModalBallotResultsVideoCardController mixin', function() {
    class MyVideoCardController extends VideoCardController {}
    let render = MyVideoCardController.prototype.render = jasmine.createSpy('MyVideoCardController.prototype.render()');
    let canAutoadvance = MyVideoCardController.prototype.canAutoadvance = jasmine.createSpy('MyVideoCardController.prototype.canAutoadvance()');
    MyVideoCardController.mixin(ModalBallotResultsVideoCardController);

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
        describe('initBallotResults()', function() {
            describe('if there is no BallotCtrl', function() {
                beforeEach(function() {
                    delete Ctrl.BallotCtrl;

                    Ctrl.initBallotResults();
                });

                it('should not give the controller a BallotResultsCtrl', function() {
                    expect('BallotResultsCtrl' in Ctrl).toBe(false);
                });
            });

            describe('if there is a BallotCtrl', function() {
                let ballot;

                beforeEach(function() {
                    ballot = new EventEmitter();
                    Ctrl.BallotCtrl = new BallotController(ballot);

                    Ctrl.initBallotResults();
                });

                it('should give the controller a BallotResultsCtrl', function() {
                    expect(Ctrl.BallotResultsCtrl).toEqual(jasmine.any(ModalBallotResultsController));
                });

                describe('events:', function() {
                    describe('BallotResultsCtrl:', function() {
                        beforeEach(function() {
                            Ctrl.view.playerOutlet = new PlayerOutletView();
                        });

                        describe('activate', function() {
                            beforeEach(function() {
                                spyOn(Ctrl.view.playerOutlet, 'hide');

                                Ctrl.BallotResultsCtrl.emit('activate');
                            });

                            it('should hide the PlayerOutletView', function() {
                                expect(Ctrl.view.playerOutlet.hide).toHaveBeenCalled();
                            });
                        });

                        describe('deactivate', function() {
                            beforeEach(function() {
                                spyOn(Ctrl.view.playerOutlet, 'show');

                                Ctrl.BallotResultsCtrl.emit('deactivate');
                            });

                            it('should show the PlayerOutletView', function() {
                                expect(Ctrl.view.playerOutlet.show).toHaveBeenCalled();
                            });
                        });
                    });

                    describe('BallotCtrl:', function() {
                        describe('voted', function() {
                            beforeEach(function() {
                                spyOn(Ctrl.BallotResultsCtrl, 'activate');

                                Ctrl.BallotCtrl.emit('voted');
                            });

                            it('should active the BallotResultsCtrl', function() {
                                expect(Ctrl.BallotResultsCtrl.activate).toHaveBeenCalled();
                            });
                        });
                    });

                    describe('player:', function() {
                        describe('play', function() {
                            beforeEach(function() {
                                spyOn(Ctrl.BallotResultsCtrl, 'deactivate');

                                Ctrl.player.emit('play');
                            });

                            it('should deactivate the BallotResultsCtrl', function() {
                                expect(Ctrl.BallotResultsCtrl.deactivate).toHaveBeenCalled();
                            });
                        });

                        describe('pause', function() {
                            beforeEach(function() {
                                spyOn(Ctrl.BallotResultsCtrl, 'activate');
                            });

                            describe('if a choice was not made', function() {
                                beforeEach(function() {
                                    ballot.choice = null;

                                    Ctrl.player.emit('pause');
                                });

                                it('should not activate the BallotResultsCtrl', function() {
                                    expect(Ctrl.BallotResultsCtrl.activate).not.toHaveBeenCalled();
                                });
                            });

                            describe('if a choice was made', function() {
                                beforeEach(function() {
                                    ballot.choice = 0;

                                    Ctrl.player.emit('pause');
                                });

                                it('should activate the BallotResultsCtrl', function() {
                                    expect(Ctrl.BallotResultsCtrl.activate).toHaveBeenCalled();
                                });
                            });
                        });
                    });

                    describe('model:', function() {
                        describe('deactivate', function() {
                            beforeEach(function() {
                                spyOn(Ctrl.BallotResultsCtrl, 'deactivate');

                                Runner.run(() => card.emit('deactivate'));
                            });

                            it('should deactivate the BallotResultsCtrl', function() {
                                expect(Ctrl.BallotResultsCtrl.deactivate).toHaveBeenCalled();
                            });
                        });
                    });
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

                describe('if the super method returns false', function() {
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

                describe('if a vote has been recorded', function() {
                    beforeEach(function() {
                        card.modules.ballot.choice = 0;
                    });

                    it('should return false', function() {
                        expect(Ctrl.canAutoadvance()).toBe(false);
                    });
                });

                describe('if a vote has not been recorded', function() {
                    beforeEach(function() {
                        card.modules.ballot.choice = null;
                    });

                    it('should return true', function() {
                        expect(Ctrl.canAutoadvance()).toBe(true);
                    });

                    describe('if the super method returns false', function() {
                        beforeEach(function() {
                            canAutoadvance.and.returnValue(false);
                        });

                        it('should return false', function() {
                            expect(Ctrl.canAutoadvance()).toBe(false);
                        });
                    });
                });
            });
        });

        describe('render()', function() {
            describe('if there is no BallotCtrl', function() {
                beforeEach(function() {
                    delete Ctrl.BallotCtrl;
                    Ctrl.initBallotResults();

                    Ctrl.render();
                });

                it('should call this.super()', function() {
                    expect(render).toHaveBeenCalled();
                });
            });

            describe('if there is a BallotCtrl', function() {
                beforeEach(function() {
                    Ctrl.BallotCtrl = new BallotController(new EventEmitter());
                    Ctrl.initBallotResults();
                    spyOn(Ctrl.BallotResultsCtrl, 'renderInto');
                    Ctrl.view.ballotResultsOutlet = new View();

                    Ctrl.render();
                });

                it('should call this.super()', function() {
                    expect(render).toHaveBeenCalled();
                });

                it('should render the BallotResultsCtrl into its outlet', function() {
                    expect(Ctrl.BallotResultsCtrl.renderInto).toHaveBeenCalledWith(Ctrl.view.ballotResultsOutlet);
                });
            });
        });
    });
});
