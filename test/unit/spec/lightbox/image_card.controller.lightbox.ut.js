import LightboxImageCardController from '../../../../src/controllers/lightbox/LightboxImageCardController.js';
import ImageCardController from '../../../../src/controllers/ImageCardController.js';
import View from '../../../../lib/core/View.js';
import LightboxVideoCardView from '../../../../src/views/lightbox/LightboxVideoCardView.js';
import {EventEmitter} from 'events';

describe('LightboxImageCardController', function() {
    let LightboxImageCardCtrl;
    let card;
    let parentView;

    beforeEach(function() {
        card = new EventEmitter();
        parentView = new View();
        spyOn(LightboxImageCardController.prototype, 'addView').and.callThrough();

        LightboxImageCardCtrl = new LightboxImageCardController(card, parentView);
    });

    it('should exist', function() {
        expect(LightboxImageCardCtrl).toEqual(jasmine.any(ImageCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a LightboxVideoCardView', function() {
                expect(LightboxImageCardCtrl.view).toEqual(jasmine.any(LightboxVideoCardView));
                expect(LightboxImageCardCtrl.addView).toHaveBeenCalledWith(LightboxImageCardCtrl.view);
            });
        });
    });
});
