import LightVideoCardController from '../../../../src/controllers/light/LightVideoCardController.js';
import VideoCardController from '../../../../src/controllers/VideoCardController.js';
import {EventEmitter} from 'events';
import LightVideoCardView from '../../../../src/views/light/LightVideoCardView.js';

describe('LightVideoCardController', function() {
    let LightVideoCardCtrl;
    let card;

    beforeEach(function() {
        card = new EventEmitter();
        card.data = { type: 'youtube' };
        card.modules = {};
        card.thumbs = {};
        spyOn(LightVideoCardController.prototype, 'addView').and.callThrough();

        LightVideoCardCtrl = new LightVideoCardController(card);
    });

    it('should exist', function() {
        expect(LightVideoCardCtrl).toEqual(jasmine.any(VideoCardController));
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
