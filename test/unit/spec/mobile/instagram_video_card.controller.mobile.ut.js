import MobileInstagramVideoCardController from '../../../../src/controllers/mobile/MobileInstagramVideoCardController.js';
import InstagramCardController from '../../../../src/controllers/InstagramCardController.js';
import View from '../../../../lib/core/View.js';
import MobileInstagramVideoCardView from '../../../../src/views/mobile/MobileInstagramVideoCardView.js';
import {EventEmitter} from 'events';

describe('MobileInstagramVideoCardController', function() {
    let MobileInstagramVideoCardCtrl;
    let card;
    let parentView;

    beforeEach(function() {
        card = new EventEmitter();
        parentView = new View();
        spyOn(MobileInstagramVideoCardController.prototype, 'addView').and.callThrough();

        MobileInstagramVideoCardCtrl = new MobileInstagramVideoCardController(card, parentView);
    });

    it('should exist', function() {
        expect(MobileInstagramVideoCardCtrl).toEqual(jasmine.any(InstagramCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a MobileInstagramVideoCardView', function() {
                expect(MobileInstagramVideoCardCtrl.view).toEqual(jasmine.any(MobileInstagramVideoCardView));
                expect(MobileInstagramVideoCardCtrl.addView).toHaveBeenCalledWith(MobileInstagramVideoCardCtrl.view);
            });
        });
    });
});
