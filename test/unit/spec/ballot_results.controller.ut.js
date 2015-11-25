import BallotResultsController from '../../../src/controllers/BallotResultsController.js';
import ModuleController from '../../../src/controllers/ModuleController.js';
import { EventEmitter } from 'events';
import TemplateView from '../../../lib/core/TemplateView.js';

describe('BallotResultsController', function() {
    let BallotResultsCtrl;
    let ballot;

    beforeEach(function() {
        ballot = new EventEmitter();

        BallotResultsCtrl = new BallotResultsController(ballot);
    });

    it('should exist', function() {
        expect(BallotResultsCtrl).toEqual(jasmine.any(ModuleController));
    });

    describe('events:', function() {
        describe('model:', function() {
            describe('hasResults', function() {
                beforeEach(function() {
                    spyOn(BallotResultsCtrl, 'updateView');

                    ballot.emit('hasResults');
                });

                it('should update its view', function() {
                    expect(BallotResultsCtrl.updateView).toHaveBeenCalled();
                });
            });
        });
    });

    describe('methods:', function() {
        describe('updateView()', function() {
            beforeEach(function() {
                BallotResultsCtrl.view = new TemplateView();
                ballot.choices = ['Too funny!', 'Too far!'];
                spyOn(BallotResultsCtrl.view, 'update');
            });

            describe('before the results have been fetched', function() {
                beforeEach(function() {
                    ballot.results = [null, null];

                    BallotResultsCtrl.updateView();
                });

                it('should split the results evenly', function() {
                    expect(BallotResultsCtrl.view.update).toHaveBeenCalledWith({
                        results: [
                            { choice: 'Too funny!', result: '50%' },
                            { choice: 'Too far!', result: '50%' }
                        ]
                    });
                });
            });

            describe('after the results have been fetched', function() {
                beforeEach(function() {
                    ballot.results = [1/3, 2/3];

                    BallotResultsCtrl.updateView();
                });

                it('should format the results for display', function() {
                    expect(BallotResultsCtrl.view.update).toHaveBeenCalledWith({
                        results: [
                            { choice: 'Too funny!', result: '33%' },
                            { choice: 'Too far!', result: '67%' }
                        ]
                    });
                });
            });
        });

        describe('activate()', function() {
            beforeEach(function() {
                spyOn(ModuleController.prototype, 'activate');
                spyOn(BallotResultsCtrl, 'updateView');

                BallotResultsCtrl.activate();
            });

            it('should update its view', function() {
                expect(BallotResultsCtrl.updateView).toHaveBeenCalled();
            });

            it('should call super()', function() {
                expect(ModuleController.prototype.activate).toHaveBeenCalled();
            });
        });
    });
});
