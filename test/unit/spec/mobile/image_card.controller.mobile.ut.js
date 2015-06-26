import MobileImageCardController from '../../../../src/controllers/mobile/MobileImageCardController.js';
import ImageCardController from '../../../../src/controllers/ImageCardController.js';
import View from '../../../../lib/core/View.js';
import MobileVideoCardView from '../../../../src/views/mobile/MobileVideoCardView.js';
import {EventEmitter} from 'events';

describe('MobileImageCardController', function() {
    let MobileImageCardCtrl;
    let card;
    let parentView;

    beforeEach(function() {
        card = new EventEmitter();
        parentView = new View();
        spyOn(MobileImageCardController.prototype, 'addView').and.callThrough();

        MobileImageCardCtrl = new MobileImageCardController(card, parentView);
    });

    it('should exist', function() {
        expect(MobileImageCardCtrl).toEqual(jasmine.any(ImageCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a MobileVideoCardView', function() {
                expect(MobileImageCardCtrl.view).toEqual(jasmine.any(MobileVideoCardView));
                expect(MobileImageCardCtrl.addView).toHaveBeenCalledWith(MobileImageCardCtrl.view);
            });
        });
    });

    describe('methods:', function() {
        describe('advance()', function() {
            beforeEach(function() {
                card.complete = jasmine.createSpy('card.complete()');

                MobileImageCardCtrl.advance();
            });

            it('should call complete() on the card', function() {
                expect(card.complete).toHaveBeenCalled();
            });
        });
    });
});
