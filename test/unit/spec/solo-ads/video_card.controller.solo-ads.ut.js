import SoloAdsVideoCardController from '../../../../src/controllers/solo-ads/SoloAdsVideoCardController.js';
import VideoCardController from '../../../../src/controllers/VideoCardController.js';
import DisplayAdVideoCardController from '../../../../src/mixins/DisplayAdVideoCardController.js';
import SoloAdsVideoCardView from '../../../../src/views/solo-ads/SoloAdsVideoCardView.js';
import { EventEmitter } from 'events';

describe('SoloAdsVideoCardController', function() {
    let SoloAdsVideoCardCtrl;
    let card;

    beforeEach(function() {
        card = new EventEmitter();
        card.data = { type: 'youtube' };
        card.thumbs = {};
        card.modules = {};
        card.getSrc = jasmine.createSpy('card.getSrc()');

        spyOn(SoloAdsVideoCardController.prototype, 'initDisplayAd').and.callThrough();

        SoloAdsVideoCardCtrl = new SoloAdsVideoCardController(card);
    });

    it('should exist', function() {
        expect(SoloAdsVideoCardCtrl).toEqual(jasmine.any(VideoCardController));
    });

    it('should mixin the DisplayAdVideoCardController', function() {
        expect(SoloAdsVideoCardController.mixins).toContain(DisplayAdVideoCardController);
        expect(SoloAdsVideoCardCtrl.initDisplayAd).toHaveBeenCalled();
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a SoloAdsVideoCardView', function() {
                expect(SoloAdsVideoCardCtrl.view).toEqual(jasmine.any(SoloAdsVideoCardView));
            });
        });
    });
});
