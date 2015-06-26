import SoloImageCardController from '../../../../src/controllers/solo/SoloImageCardController.js';
import ImageCardController from '../../../../src/controllers/ImageCardController.js';
import View from '../../../../lib/core/View.js';
import SoloVideoCardView from '../../../../src/views/solo/SoloVideoCardView.js';
import {EventEmitter} from 'events';

describe('SoloImageCardController', function() {
    let SoloImageCardCtrl;
    let card;
    let parentView;

    beforeEach(function() {
        card = new EventEmitter();
        parentView = new View();
        spyOn(SoloImageCardController.prototype, 'addView').and.callThrough();

        SoloImageCardCtrl = new SoloImageCardController(card, parentView);
    });

    it('should exist', function() {
        expect(SoloImageCardCtrl).toEqual(jasmine.any(ImageCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a SoloVideoCardView', function() {
                expect(SoloImageCardCtrl.view).toEqual(jasmine.any(SoloVideoCardView));
                expect(SoloImageCardCtrl.addView).toHaveBeenCalledWith(SoloImageCardCtrl.view);
            });
        });
    });

    describe('methods:', function() {
        describe('advance()', function() {
            beforeEach(function() {
                card.complete = jasmine.createSpy('card.complete()');

                SoloImageCardCtrl.advance();
            });

            it('should call complete() on the card', function() {
                expect(card.complete).toHaveBeenCalled();
            });
        });
    });
});
