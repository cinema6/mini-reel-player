import SwipeBallotController from '../../../../src/controllers/swipe/SwipeBallotController.js';
import BallotController from '../../../../src/controllers/BallotController.js';
import BallotResultsController from '../../../../src/controllers/BallotResultsController.js';
import SwipeBallotView from '../../../../src/views/swipe/SwipeBallotView.js';
import { EventEmitter } from 'events';
import ButtonView from '../../../../src/views/ButtonView.js';
import View from '../../../../lib/core/View.js';

fdescribe('SwipeBallotController', function() {
    let SwipeBallotCtrl;
    let ballot;
    let card;

    beforeEach(function() {
        ballot = new EventEmitter();
        ballot.choice = null;

        card = new EventEmitter();
        card.thumbs = {
            large: 'my-large-thumb.jpg'
        };

        spyOn(SwipeBallotController.prototype, 'addView').and.callThrough();

        SwipeBallotCtrl = new SwipeBallotController(ballot, card);
    });

    it('should exist', function() {
        expect(SwipeBallotCtrl).toEqual(jasmine.any(BallotController));
    });

    describe('properties:', function() {
        describe('card', function() {
            it('should be the provided card', function() {
                expect(SwipeBallotCtrl.card).toBe(card);
            });
        });

        describe('view', function() {
            it('should be a SwipeBallotView', function() {
                expect(SwipeBallotCtrl.view).toEqual(jasmine.any(SwipeBallotView));
                expect(SwipeBallotCtrl.addView).toHaveBeenCalledWith(SwipeBallotCtrl.view);
            });
        });

        describe('resultsShown', function() {
            it('should be false', function() {
                expect(SwipeBallotCtrl.resultsShown).toBe(false);
            });
        });

        describe('model', function() {
            describe('events:', function() {
                describe('hasResults', function() {
                    beforeEach(function() {
                        spyOn(SwipeBallotCtrl, 'updateView');

                        ballot.emit('hasResults');
                    });

                    it('should update its view', function() {
                        expect(SwipeBallotCtrl.updateView).toHaveBeenCalled();
                    });
                });
            });
        });
    });

    describe('methods:', function() {
        describe('updateView()', function() {
            let view;

            beforeEach(function() {
                view = SwipeBallotCtrl.view;

                spyOn(view, 'update');
                spyOn(BallotController.prototype, 'updateView');
                spyOn(BallotResultsController.prototype, 'updateView');

                SwipeBallotCtrl.updateView();
            });

            it('should update its view with some information', function() {
                expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                    background: card.thumbs.large
                }));
            });

            it('should invoke the BallotResultsController updateView()', function() {
                expect(BallotResultsController.prototype.updateView).toHaveBeenCalled();
                expect(BallotResultsController.prototype.updateView.calls.mostRecent().object).toBe(SwipeBallotCtrl);
            });

            it('should call super()', function() {
                expect(BallotController.prototype.updateView).toHaveBeenCalled();
            });

            describe('if resultsShown is true', function() {
                beforeEach(function() {
                    SwipeBallotCtrl.resultsShown = true;
                    view.update.calls.reset();

                    SwipeBallotCtrl.updateView();
                });

                it('should update the view with resultsShown: true', function() {
                    expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        resultsShown: true
                    }));
                });
            });

            describe('if resultsShown is false', function() {
                beforeEach(function() {
                    SwipeBallotCtrl.resultsShown = false;
                    view.update.calls.reset();

                    SwipeBallotCtrl.updateView();
                });

                it('should update the view with resultsShown: false', function() {
                    expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        resultsShown: false
                    }));
                });
            });
        });

        describe('activate()', function() {
            beforeEach(function() {
                spyOn(BallotController.prototype, 'activate');
            });

            describe('if the user has not voted', function() {
                beforeEach(function() {
                    SwipeBallotCtrl.resultsShown = true;
                    ballot.choice = null;

                    SwipeBallotCtrl.activate();
                });

                it('should set resultsShown to false', function() {
                    expect(SwipeBallotCtrl.resultsShown).toBe(false);
                });

                it('should call super()', function() {
                    expect(BallotController.prototype.activate).toHaveBeenCalled();
                });
            });

            describe('if the user has voted', function() {
                beforeEach(function() {
                    SwipeBallotCtrl.resultsShown = false;
                    ballot.choice = 0;

                    SwipeBallotCtrl.activate();
                });

                it('should set resultsShown to true', function() {
                    expect(SwipeBallotCtrl.resultsShown).toBe(true);
                });

                it('should call super()', function() {
                    expect(BallotController.prototype.activate).toHaveBeenCalled();
                });
            });
        });

        describe('vote()', function() {
            let button;

            beforeEach(function() {
                spyOn(BallotController.prototype, 'vote');
                spyOn(SwipeBallotCtrl, 'updateView');
                SwipeBallotCtrl.resultsShown = false;

                button = new ButtonView();

                SwipeBallotCtrl.vote(button);
            });

            it('should set resultsShown to true', function() {
                expect(SwipeBallotCtrl.resultsShown).toBe(true);
            });

            it('should call updateView()', function() {
                expect(SwipeBallotCtrl.updateView).toHaveBeenCalled();
            });

            it('should call super()', function() {
                expect(BallotController.prototype.vote).toHaveBeenCalledWith(button);
            });
        });

        describe('renderInto(view)', function() {
            let view;

            beforeEach(function() {
                spyOn(BallotController.prototype, 'renderInto');
                spyOn(SwipeBallotCtrl, 'updateView');

                view = new View();

                SwipeBallotCtrl.renderInto(view);
            });

            it('should call updateView()', function() {
                expect(SwipeBallotCtrl.updateView).toHaveBeenCalled();
            });

            it('should call super()', function() {
                expect(BallotController.prototype.renderInto).toHaveBeenCalledWith(view);
            });
        });
    });
});
