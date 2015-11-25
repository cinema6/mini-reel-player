import SwipePostController from '../../../../src/controllers/swipe/SwipePostController.js';
import ModuleController from '../../../../src/controllers/ModuleController.js';
import { EventEmitter } from 'events';
import SwipeBallotView from '../../../../src/views/swipe/SwipeBallotView.js';
import ButtonView from '../../../../src/views/ButtonView.js';
import View from '../../../../lib/core/View.js';

describe('SwipePostController', function() {
    let SwipePostCtrl;
    let post;
    let ballot;

    beforeEach(function() {
        ballot = new EventEmitter();
        ballot.choices = ['Yes', 'No'];
        ballot.prompt = 'Is it good?';
        ballot.cast = jasmine.createSpy('ballot.cast()');

        post = new EventEmitter();
        post.ballot = ballot;

        spyOn(SwipePostController.prototype, 'addView').and.callThrough();

        SwipePostCtrl = new SwipePostController(post);
    });

    it('should exist', function() {
        expect(SwipePostCtrl).toEqual(jasmine.any(ModuleController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a SwipeBallotView', function() {
                expect(SwipePostCtrl.view).toEqual(jasmine.any(SwipeBallotView));
                expect(SwipePostCtrl.addView).toHaveBeenCalledWith(SwipePostCtrl.view);
            });
        });
    });

    describe('methods:', function() {
        describe('vote(button)', function() {
            let button;
            let vote;

            beforeEach(function() {
                vote = jasmine.createSpy('vote()');
                SwipePostCtrl.on('vote', vote);

                button = new ButtonView();
                button.attributes['data-vote'] = '2';

                SwipePostCtrl.vote(button);
            });

            it('should cast the vote', function() {
                expect(ballot.cast).toHaveBeenCalledWith(2);
            });

            it('should emit "vote"', function() {
                expect(vote).toHaveBeenCalled();
            });
        });

        describe('updateView()', function() {
            let view;

            beforeEach(function() {
                view = SwipePostCtrl.view;
                spyOn(view, 'update');

                SwipePostCtrl.updateView();
            });

            it('should update() its view', function() {
                expect(view.update).toHaveBeenCalledWith({
                    resultsShown: false,
                    prompt: ballot.prompt,
                    choices: ballot.choices
                });
            });
        });

        describe('renderInto(view)', function() {
            let view;

            beforeEach(function() {
                view = new View();
                spyOn(ModuleController.prototype, 'renderInto');
                spyOn(SwipePostCtrl, 'updateView');

                SwipePostCtrl.renderInto(view);
            });

            it('should call updateView()', function() {
                expect(SwipePostCtrl.updateView).toHaveBeenCalled();
            });

            it('should call super()', function() {
                expect(ModuleController.prototype.renderInto).toHaveBeenCalledWith(view);
            });
        });
    });
});
