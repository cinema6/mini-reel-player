import SoloAdsImageCardController from '../../../../src/controllers/solo-ads/SoloAdsImageCardController.js';
import ImageCardController from '../../../../src/controllers/ImageCardController.js';
import View from '../../../../lib/core/View.js';
import SoloAdsVideoCardView from '../../../../src/views/solo-ads/SoloAdsVideoCardView.js';
import {EventEmitter} from 'events';

describe('SoloAdsImageCardController', function() {
    let SoloAdsImageCardCtrl;
    let card;
    let parentView;

    beforeEach(function() {
        card = new EventEmitter();
        parentView = new View();
        spyOn(SoloAdsImageCardController.prototype, 'addView').and.callThrough();

        SoloAdsImageCardCtrl = new SoloAdsImageCardController(card, parentView);
    });

    it('should exist', function() {
        expect(SoloAdsImageCardCtrl).toEqual(jasmine.any(ImageCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a SoloAdsVideoCardView', function() {
                expect(SoloAdsImageCardCtrl.view).toEqual(jasmine.any(SoloAdsVideoCardView));
                expect(SoloAdsImageCardCtrl.addView).toHaveBeenCalledWith(SoloAdsImageCardCtrl.view);
            });
        });
    });

    describe('methods:', function() {
        describe('advance()', function() {
            beforeEach(function() {
                card.complete = jasmine.createSpy('card.complete()');

                SoloAdsImageCardCtrl.advance();
            });

            it('should call complete() on the card', function() {
                expect(card.complete).toHaveBeenCalled();
            });
        });
    });
});
