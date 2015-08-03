import LightInstagramImageCardController from '../../../../src/controllers/light/LightInstagramImageCardController.js';
import InstagramCardController from '../../../../src/controllers/InstagramCardController.js';
import View from '../../../../lib/core/View.js';
import LightInstagramImageCardView from '../../../../src/views/light/LightInstagramImageCardView.js';
import {EventEmitter} from 'events';

describe('LightInstagramImageCardController', function() {
    let LightInstagramImageCardCtrl;
    let card;
    let parentView;

    beforeEach(function() {
        card = new EventEmitter();
        parentView = new View();
        spyOn(LightInstagramImageCardController.prototype, 'addView').and.callThrough();

        LightInstagramImageCardCtrl = new LightInstagramImageCardController(card, parentView);
    });

    it('should exist', function() {
        expect(LightInstagramImageCardCtrl).toEqual(jasmine.any(InstagramCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a LightInstagramImageCardView', function() {
                expect(LightInstagramImageCardCtrl.view).toEqual(jasmine.any(LightInstagramImageCardView));
                expect(LightInstagramImageCardCtrl.addView).toHaveBeenCalledWith(LightInstagramImageCardCtrl.view);
            });
        });
    });
});
