import LightboxVideoCardController from '../../../../src/controllers/lightbox/LightboxVideoCardController.js';
import VideoCardController from '../../../../src/controllers/VideoCardController.js';
import LightboxVideoCardView from '../../../../src/views/lightbox/LightboxVideoCardView.js';
import {EventEmitter} from 'events';
import DisplayAdVideoCardController from '../../../../src/mixins/DisplayAdVideoCardController.js';
import ModalBallotResultsVideoCardController from '../../../../src/mixins/ModalBallotResultsVideoCardController.js';

describe('LightboxVideoCardController', function() {
    let LightboxVideoCardCtrl;
    let card;

    beforeEach(function() {
        card = new EventEmitter();
        card.data = { type: 'youtube' };
        card.modules = {};
        card.thumbs = {};
        spyOn(LightboxVideoCardController.prototype, 'addView').and.callThrough();
        spyOn(LightboxVideoCardController.prototype, 'initDisplayAd').and.callThrough();
        spyOn(LightboxVideoCardController.prototype, 'initBallotResults').and.callThrough();

        LightboxVideoCardCtrl = new LightboxVideoCardController(card);
    });

    it('should exist', function() {
        expect(LightboxVideoCardCtrl).toEqual(jasmine.any(VideoCardController));
    });

    it('should mixin the DisplayAdVideoCardController', function() {
        expect(LightboxVideoCardController.mixins).toContain(DisplayAdVideoCardController);
        expect(LightboxVideoCardCtrl.initDisplayAd).toHaveBeenCalled();
    });

    it('should mixin the ModalBallotResultsVideoCardController', function() {
        expect(LightboxVideoCardController.mixins).toContain(ModalBallotResultsVideoCardController);
        expect(LightboxVideoCardCtrl.initBallotResults).toHaveBeenCalled();
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a LightboxVideoCardView', function() {
                expect(LightboxVideoCardCtrl.view).toEqual(jasmine.any(LightboxVideoCardView));
                expect(LightboxVideoCardCtrl.addView).toHaveBeenCalledWith(LightboxVideoCardCtrl.view);
            });
        });
    });
});
