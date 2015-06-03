import FullImageCardController from '../../../../src/controllers/full/FullImageCardController.js';
import ImageCardController from '../../../../src/controllers/ImageCardController.js';
import View from '../../../../lib/core/View.js';
import FullImageCardView from '../../../../src/views/full/FullImageCardView.js';
import {EventEmitter} from 'events';

describe('FullImageCardController', function() {
    let FullImageCardCtrl;
    let card;
    let parentView;

    beforeEach(function() {
        card = new EventEmitter();
        parentView = new View();
        spyOn(FullImageCardController.prototype, 'addView').and.callThrough();

        FullImageCardCtrl = new FullImageCardController(card, parentView);
    });

    it('should exist', function() {
        expect(FullImageCardCtrl).toEqual(jasmine.any(ImageCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a FullImageCardView', function() {
                expect(FullImageCardCtrl.view).toEqual(jasmine.any(FullImageCardView));
                expect(FullImageCardCtrl.addView).toHaveBeenCalledWith(FullImageCardCtrl.view);
            });
        });
    });

    describe('methods:', function() {
        describe('advance()', function() {
            beforeEach(function() {
                card.complete = jasmine.createSpy('card.complete()');

                FullImageCardCtrl.advance();
            });

            it('should call complete() on the card', function() {
                expect(card.complete).toHaveBeenCalled();
            });
        });
    });
});
