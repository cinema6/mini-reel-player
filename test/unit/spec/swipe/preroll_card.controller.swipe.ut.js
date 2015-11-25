import SwipePrerollCardController from '../../../../src/controllers/swipe/SwipePrerollCardController.js';
import PrerollCardController from '../../../../src/controllers/PrerollCardController.js';
import { EventEmitter } from 'events';
import SwipePrerollCardView from '../../../../src/views/swipe/SwipePrerollCardView.js';
import SkipButtonView from '../../../../src/views/swipe/SkipButtonView.js';

describe('SwipePrerollCardController', function() {
    let SwipePrerollCardCtrl;
    let card;

    beforeEach(function() {
        card = new EventEmitter();
        card.data = { type: 'vast' };
        card.getSrc = function() {};
        card.complete = function() {};

        spyOn(SwipePrerollCardController.prototype, 'addView').and.callThrough();

        SwipePrerollCardCtrl = new SwipePrerollCardController(card);
    });

    it('should exist', function() {
        expect(SwipePrerollCardCtrl).toEqual(jasmine.any(PrerollCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a SwipePrerollCardView', function() {
                expect(SwipePrerollCardCtrl.view).toEqual(jasmine.any(SwipePrerollCardView));
                expect(SwipePrerollCardCtrl.addView).toHaveBeenCalledWith(SwipePrerollCardCtrl.view);
            });
        });

        describe('model', function() {
            describe('events:', function() {
                let skipButton;

                beforeEach(function() {
                    skipButton = SwipePrerollCardCtrl.view.skipButton = new SkipButtonView();
                });

                describe('becameUnskippable', function() {
                    beforeEach(function() {
                        spyOn(skipButton, 'disable');

                        card.emit('becameUnskippable');
                    });

                    it('should disable the skip button', function() {
                        expect(skipButton.disable).toHaveBeenCalled();
                    });
                });

                describe('skippableProgress', function() {
                    beforeEach(function() {
                        spyOn(skipButton, 'update');

                        card.emit('skippableProgress', 6);
                    });

                    it('should update the skip button', function() {
                        expect(skipButton.update).toHaveBeenCalledWith(6);
                    });
                });

                describe('becameSkippable', function() {
                    beforeEach(function() {
                        spyOn(skipButton, 'enable');

                        card.emit('becameSkippable');
                    });

                    it('should enable the skip button', function() {
                        expect(skipButton.enable).toHaveBeenCalled();
                    });
                });
            });
        });
    });

    describe('methods:', function() {
        describe('skip()', function() {
            beforeEach(function() {
                spyOn(card, 'complete');

                SwipePrerollCardCtrl.skip();
            });

            it('should call complete() on the card', function() {
                expect(card.complete).toHaveBeenCalled();
            });
        });
    });
});
