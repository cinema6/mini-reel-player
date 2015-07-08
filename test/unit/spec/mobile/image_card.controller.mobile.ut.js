import MobileImageCardController from '../../../../src/controllers/mobile/MobileImageCardController.js';
import ImageCardController from '../../../../src/controllers/ImageCardController.js';
import View from '../../../../lib/core/View.js';
import MobileImageCardView from '../../../../src/views/mobile/MobileImageCardView.js';
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
            it('should be a MobileImageCardView', function() {
                expect(MobileImageCardCtrl.view).toEqual(jasmine.any(MobileImageCardView));
                expect(MobileImageCardCtrl.addView).toHaveBeenCalledWith(MobileImageCardCtrl.view);
            });
        });
    });
});
