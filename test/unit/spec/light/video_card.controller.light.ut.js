import LightVideoCardController from '../../../../src/controllers/light/LightVideoCardController.js';
import VideoCardController from '../../../../src/controllers/VideoCardController.js';
import {EventEmitter} from 'events';
import LightVideoCardView from '../../../../src/views/light/LightVideoCardView.js';
import ModalBallotResultsVideoCardController from '../../../../src/mixins/ModalBallotResultsVideoCardController.js';

describe('LightVideoCardController', function() {
    let LightVideoCardCtrl;
    let card;

    beforeEach(function() {
        card = new EventEmitter();
        card.data = { type: 'youtube' };
        card.modules = {};
        card.thumbs = {};
        spyOn(LightVideoCardController.prototype, 'addView').and.callThrough();
        spyOn(LightVideoCardController.prototype, 'initBallotResults').and.callThrough();

        LightVideoCardCtrl = new LightVideoCardController(card);
    });

    it('should exist', function() {
        expect(LightVideoCardCtrl).toEqual(jasmine.any(VideoCardController));
    });

    it('should mixin the ModalBallotResultsVideoCardController', function() {
        expect(LightVideoCardController.mixins).toContain(ModalBallotResultsVideoCardController);
        expect(LightVideoCardCtrl.initBallotResults).toHaveBeenCalled();
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a LightVideoCardView', function() {
                expect(LightVideoCardCtrl.view).toEqual(jasmine.any(LightVideoCardView));
                expect(LightVideoCardCtrl.addView).toHaveBeenCalledWith(LightVideoCardCtrl.view);
            });
        });
    });
});
