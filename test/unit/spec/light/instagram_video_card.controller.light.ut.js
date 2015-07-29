import LightInstagramVideoCardController from '../../../../src/controllers/light/LightInstagramVideoCardController.js';
import InstagramCardController from '../../../../src/controllers/InstagramCardController.js';
import View from '../../../../lib/core/View.js';
import LightInstagramVideoCardView from '../../../../src/views/light/LightInstagramVideoCardView.js';
import {EventEmitter} from 'events';

describe('LightInstagramVideoCardController', function() {
    let LightInstagramVideoCardCtrl;
    let card;
    let parentView;

    beforeEach(function() {
        card = new EventEmitter();
        parentView = new View();
        spyOn(LightInstagramVideoCardController.prototype, 'addView').and.callThrough();

        LightInstagramVideoCardCtrl = new LightInstagramVideoCardController(card, parentView);
    });

    it('should exist', function() {
        expect(LightInstagramVideoCardCtrl).toEqual(jasmine.any(InstagramCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a LightInstagramVideoCardView', function() {
                expect(LightInstagramVideoCardCtrl.view).toEqual(jasmine.any(LightInstagramVideoCardView));
                expect(LightInstagramVideoCardCtrl.addView).toHaveBeenCalledWith(LightInstagramVideoCardCtrl.view);
            });
        });
    });
});
