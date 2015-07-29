import FullInstagramImageCardController from '../../../../src/controllers/full/FullInstagramImageCardController.js';
import InstagramCardController from '../../../../src/controllers/InstagramCardController.js';
import View from '../../../../lib/core/View.js';
import FullInstagramImageCardView from '../../../../src/views/full/FullInstagramImageCardView.js';
import {EventEmitter} from 'events';

describe('FullInstagramImageCardController', function() {
    let FullInstagramImageCardCtrl;
    let card;
    let parentView;

    beforeEach(function() {
        card = new EventEmitter();
        parentView = new View();
        spyOn(FullInstagramImageCardController.prototype, 'addView').and.callThrough();

        FullInstagramImageCardCtrl = new FullInstagramImageCardController(card, parentView);
    });

    it('should exist', function() {
        expect(FullInstagramImageCardCtrl).toEqual(jasmine.any(InstagramCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a FullInstagramImageCardView', function() {
                expect(FullInstagramImageCardCtrl.view).toEqual(jasmine.any(FullInstagramImageCardView));
                expect(FullInstagramImageCardCtrl.addView).toHaveBeenCalledWith(FullInstagramImageCardCtrl.view);
            });
        });
    });
});
