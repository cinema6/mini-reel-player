import InlineBallotResultsVideoCardController from '../../../src/mixins/InlineBallotResultsVideoCardController.js';
import VideoCardController from '../../../src/controllers/VideoCardController.js';
import VideoCardView from '../../../src/views/VideoCardView.js';
import { EventEmitter } from 'events';
import BallotController from '../../../src/controllers/BallotController.js';
import InlineBallotResultsController from '../../../src/controllers/InlineBallotResultsController.js';
import View from '../../../lib/core/View.js';

describe('InlineBallotResultsVideoCardController mixin', function() {
    class MyVideoCardController extends VideoCardController {}
    let render = MyVideoCardController.prototype.render = jasmine.createSpy('MyVideoCardController.prototype.render()');
    MyVideoCardController.mixin(InlineBallotResultsVideoCardController);
    let Ctrl;
    let card;

    beforeEach(function() {
        card = new EventEmitter();
        card.data = { type: 'youtube' };
        card.modules = {};
        card.thumbs = {};
        card.getSrc = jasmine.createSpy('card.getSrc()');

        Ctrl = new MyVideoCardController(card);
        Ctrl.view = new VideoCardView();
    });

    it('should exist', function() {
        expect(Ctrl).toEqual(jasmine.any(VideoCardController));
    });

    describe('methods:', function() {
        describe('initBallotResults()', function() {
            describe('if the controller has no BallotCtrl', function() {
                beforeEach(function() {
                    delete Ctrl.BallotCtrl;

                    Ctrl.initBallotResults();
                });

                it('should not give the controller a BallotResultsCtrl', function() {
                    expect('BallotResultsCtrl' in Ctrl).toBe(false);
                });
            });

            describe('if the controller has a BallotCtrl', function() {
                let ballot;

                beforeEach(function() {
                    ballot = new EventEmitter();
                    Ctrl.BallotCtrl = new BallotController(ballot);

                    Ctrl.initBallotResults();
                });

                it('should give the controller a BallotResultsCtrl', function() {
                    expect(Ctrl.BallotResultsCtrl).toEqual(jasmine.any(InlineBallotResultsController));
                });

                describe('events:', function() {
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
                    Ctrl.view.ballotResultsOutlet = new View();
                    Ctrl.BallotCtrl = new BallotController(new EventEmitter());
                    Ctrl.initBallotResults();
                    spyOn(Ctrl.BallotResultsCtrl, 'renderInto');

                    Ctrl.render();
                });

                it('should call this.super()', function() {
                    expect(render).toHaveBeenCalled();
                });

                it('should render the BallotResultsCtrl', function() {
                    expect(Ctrl.BallotResultsCtrl.renderInto).toHaveBeenCalledWith(Ctrl.view.ballotResultsOutlet);
                });
            });
        });
    });
});
