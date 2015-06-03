import SwipeTextCardController from '../../../../src/controllers/swipe/SwipeTextCardController.js';
import TextCardController from '../../../../src/controllers/TextCardController.js';
import { EventEmitter } from 'events';
import SwipeTextCardView from '../../../../src/views/swipe/SwipeTextCardView.js';
import View from '../../../../lib/core/View.js';
import Runner from '../../../../lib/Runner.js';

describe('SwipeTextCardController', function() {
    let SwipeTextCardCtrl;
    let card;
    let minireel;
    let parentView;

    beforeEach(function() {
        card = new EventEmitter();
        minireel = new EventEmitter();
        parentView = new View();

        spyOn(SwipeTextCardController.prototype, 'addView').and.callThrough();

        SwipeTextCardCtrl = new SwipeTextCardController(card, minireel, parentView);
    });

    it('should exist', function() {
        expect(SwipeTextCardCtrl).toEqual(jasmine.any(TextCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a SwipeTextCardView', function() {
                expect(SwipeTextCardCtrl.view).toEqual(jasmine.any(SwipeTextCardView));
                expect(SwipeTextCardCtrl.addView).toHaveBeenCalledWith(SwipeTextCardCtrl.view);
            });
        });

        describe('flippable', function() {
            it('should be false', function() {
                expect(SwipeTextCardCtrl.flippable).toBe(false);
            });
        });
    });

    describe('methods:', function() {
        describe('render()', function() {
            beforeEach(function() {
                spyOn(SwipeTextCardCtrl.view, 'appendTo');

                Runner.run(() => SwipeTextCardCtrl.render());
            });

            it('should append its view to the deck', function() {
                expect(SwipeTextCardCtrl.view.appendTo).toHaveBeenCalledWith(parentView);
            });
        });
    });
});
