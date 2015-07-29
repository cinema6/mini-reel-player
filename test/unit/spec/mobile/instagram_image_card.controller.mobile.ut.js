import MobileInstagramImageCardController from '../../../../src/controllers/mobile/MobileInstagramImageCardController.js';
import InstagramCardController from '../../../../src/controllers/InstagramCardController.js';
import View from '../../../../lib/core/View.js';
import MobileInstagramImageCardView from '../../../../src/views/mobile/MobileInstagramImageCardView.js';
import {EventEmitter} from 'events';

describe('MobileInstagramImageCardController', function() {
    let MobileInstagramImageCardCtrl;
    let card;
    let parentView;

    beforeEach(function() {
        card = new EventEmitter();
        parentView = new View();
        spyOn(MobileInstagramImageCardController.prototype, 'addView').and.callThrough();

        MobileInstagramImageCardCtrl = new MobileInstagramImageCardController(card, parentView);
    });

    it('should exist', function() {
        expect(MobileInstagramImageCardCtrl).toEqual(jasmine.any(InstagramCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a MobileInstagramImageCardView', function() {
                expect(MobileInstagramImageCardCtrl.view).toEqual(jasmine.any(MobileInstagramImageCardView));
                expect(MobileInstagramImageCardCtrl.addView).toHaveBeenCalledWith(MobileInstagramImageCardCtrl.view);
            });
        });
    });
});
