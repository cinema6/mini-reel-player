import LightImageCardController from '../../../../src/controllers/light/LightImageCardController.js';
import ImageCardController from '../../../../src/controllers/ImageCardController.js';
import View from '../../../../lib/core/View.js';
import LightVideoCardView from '../../../../src/views/light/LightVideoCardView.js';
import {EventEmitter} from 'events';

describe('LightImageCardController', function() {
    let LightImageCardCtrl;
    let card;
    let parentView;

    beforeEach(function() {
        card = new EventEmitter();
        parentView = new View();
        spyOn(LightImageCardController.prototype, 'addView').and.callThrough();

        LightImageCardCtrl = new LightImageCardController(card, parentView);
    });

    it('should exist', function() {
        expect(LightImageCardCtrl).toEqual(jasmine.any(ImageCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a LightVideoCardView', function() {
                expect(LightImageCardCtrl.view).toEqual(jasmine.any(LightVideoCardView));
                expect(LightImageCardCtrl.addView).toHaveBeenCalledWith(LightImageCardCtrl.view);
            });
        });
    });
});
