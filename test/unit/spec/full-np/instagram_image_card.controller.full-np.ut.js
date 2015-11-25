import FullNPInstagramImageCardController from '../../../../src/controllers/full-np/FullNPInstagramImageCardController.js';
import InstagramCardController from '../../../../src/controllers/InstagramCardController.js';
import View from '../../../../lib/core/View.js';
import FullNPInstagramImageCardView from '../../../../src/views/full-np/FullNPInstagramImageCardView.js';
import {EventEmitter} from 'events';

describe('FullNPInstagramImageCardController', function() {
    let FullNPInstagramImageCardCtrl;
    let card;
    let parentView;

    beforeEach(function() {
        card = new EventEmitter();
        parentView = new View();
        spyOn(FullNPInstagramImageCardController.prototype, 'addView').and.callThrough();

        FullNPInstagramImageCardCtrl = new FullNPInstagramImageCardController(card, parentView);
    });

    it('should exist', function() {
        expect(FullNPInstagramImageCardCtrl).toEqual(jasmine.any(InstagramCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a FullNPInstagramImageCardView', function() {
                expect(FullNPInstagramImageCardCtrl.view).toEqual(jasmine.any(FullNPInstagramImageCardView));
                expect(FullNPInstagramImageCardCtrl.addView).toHaveBeenCalledWith(FullNPInstagramImageCardCtrl.view);
            });
        });
    });
});
