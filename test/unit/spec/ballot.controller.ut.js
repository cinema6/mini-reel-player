import BallotController from '../../../src/controllers/BallotController.js';
import ModuleController from '../../../src/controllers/ModuleController.js';
import { EventEmitter } from 'events';
import BallotView from '../../../src/views/BallotView.js';
import ButtonView from '../../../src/views/ButtonView.js';

describe('BallotController', function() {
    let BallotCtrl;
    let ballot;

    beforeEach(function() {
        ballot = new EventEmitter();
        spyOn(BallotController.prototype, 'addView').and.callThrough();

        BallotCtrl = new BallotController(ballot);
    });

    it('should exist', function() {
        expect(BallotCtrl).toEqual(jasmine.any(ModuleController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a BallotView', function() {
                expect(BallotCtrl.view).toEqual(jasmine.any(BallotView));
                expect(BallotCtrl.addView).toHaveBeenCalledWith(BallotCtrl.view);
            });
        });
    });

    describe('methods:', function() {
        describe('updateView()', function() {
            beforeEach(function() {
                spyOn(BallotCtrl.view, 'update');
                ballot.prompt = 'How do you feel?';
                ballot.choices = ['Great', 'Awful'];

                BallotCtrl.updateView();
            });

            it('should update its view', function() {
                expect(BallotCtrl.view.update).toHaveBeenCalledWith({
                    prompt: ballot.prompt,
                    choices: ballot.choices
                });
            });
        });

        describe('activate()', function() {
            beforeEach(function() {
                spyOn(ModuleController.prototype, 'activate');
                spyOn(BallotCtrl, 'updateView');

                BallotCtrl.activate();
            });

            it('should update its view', function() {
                expect(BallotCtrl.updateView).toHaveBeenCalled();
            });

            it('should call super()', function() {
                expect(ModuleController.prototype.activate).toHaveBeenCalled();
            });
        });

        describe('vote(button)', function() {
            let button;
            let voted;

            beforeEach(function() {
                ballot.cast = jasmine.createSpy('ballot.cast()');
                button = new ButtonView();
                button.attributes['data-vote'] = '1';
                voted = jasmine.createSpy('voted()');
                BallotCtrl.on('voted', voted);
                spyOn(BallotCtrl, 'deactivate');

                BallotCtrl.vote(button);
            });

            it('should cast the ballot with the button\'s vote as an int', function() {
                expect(ballot.cast).toHaveBeenCalledWith(1);
            });

            it('should emit "voted"', function() {
                expect(voted).toHaveBeenCalled();
            });

            it('should deactivate itself', function() {
                expect(BallotCtrl.deactivate).toHaveBeenCalled();
            });
        });
    });
});
