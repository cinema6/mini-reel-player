import MobileInstagramCardController from '../../../../src/controllers/mobile/MobileInstagramCardController.js';
import InstagramCardController from '../../../../src/controllers/InstagramCardController.js';
import View from '../../../../lib/core/View.js';
import MobileInstagramCardView from '../../../../src/views/mobile/MobileInstagramCardView.js';
import {EventEmitter} from 'events';

describe('MobileInstagramCardController', function() {
    let MobileInstagramCardCtrl;
    let card;
    let parentView;

    beforeEach(function() {
        card = new EventEmitter();
        parentView = new View();
        spyOn(MobileInstagramCardController.prototype, 'addView').and.callThrough();

        MobileInstagramCardCtrl = new MobileInstagramCardController(card, parentView);
    });

    it('should exist', function() {
        expect(MobileInstagramCardCtrl).toEqual(jasmine.any(InstagramCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a MobileInstagramCardView', function() {
                expect(MobileInstagramCardCtrl.view).toEqual(jasmine.any(MobileInstagramCardView));
                expect(MobileInstagramCardCtrl.addView).toHaveBeenCalledWith(MobileInstagramCardCtrl.view);
            });
        });
    });
});
