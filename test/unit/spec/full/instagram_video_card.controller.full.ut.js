import FullInstagramVideoCardController from '../../../../src/controllers/full/FullInstagramVideoCardController.js';
import InstagramCardController from '../../../../src/controllers/InstagramCardController.js';
import View from '../../../../lib/core/View.js';
import FullInstagramVideoCardView from '../../../../src/views/full/FullInstagramVideoCardView.js';
import {EventEmitter} from 'events';

describe('FullInstagramVideoCardController', function() {
    let FullInstagramVideoCardCtrl;
    let card;
    let parentView;

    beforeEach(function() {
        card = new EventEmitter();
        parentView = new View();
        spyOn(FullInstagramVideoCardController.prototype, 'addView').and.callThrough();

        FullInstagramVideoCardCtrl = new FullInstagramVideoCardController(card, parentView);
    });

    it('should exist', function() {
        expect(FullInstagramVideoCardCtrl).toEqual(jasmine.any(InstagramCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a FullInstagramVideoCardView', function() {
                expect(FullInstagramVideoCardCtrl.view).toEqual(jasmine.any(FullInstagramVideoCardView));
                expect(FullInstagramVideoCardCtrl.addView).toHaveBeenCalledWith(FullInstagramVideoCardCtrl.view);
            });
        });
    });
});
