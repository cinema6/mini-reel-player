import FullNPImageCardController from '../../../../src/controllers/full-np/FullNPImageCardController.js';
import ImageCardController from '../../../../src/controllers/ImageCardController.js';
import View from '../../../../lib/core/View.js';
import FullNPVideoCardView from '../../../../src/views/full-np/FullNPVideoCardView.js';
import {EventEmitter} from 'events';

describe('FullNPImageCardController', function() {
    let FullNPImageCardCtrl;
    let card;
    let parentView;

    beforeEach(function() {
        card = new EventEmitter();
        parentView = new View();
        spyOn(FullNPImageCardController.prototype, 'addView').and.callThrough();

        FullNPImageCardCtrl = new FullNPImageCardController(card, parentView);
    });

    it('should exist', function() {
        expect(FullNPImageCardCtrl).toEqual(jasmine.any(ImageCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a FullNPVideoCardView', function() {
                expect(FullNPImageCardCtrl.view).toEqual(jasmine.any(FullNPVideoCardView));
                expect(FullNPImageCardCtrl.addView).toHaveBeenCalledWith(FullNPImageCardCtrl.view);
            });
        });
    });
});
