import FullImageCardController from '../../../../src/controllers/full/FullImageCardController.js';
import ImageCardController from '../../../../src/controllers/ImageCardController.js';
import View from '../../../../lib/core/View.js';
import FullVideoCardView from '../../../../src/views/full/FullVideoCardView.js';
import {EventEmitter} from 'events';

describe('FullImageCardController', function() {
    let FullImageCardCtrl;
    let card;
    let parentView;

    beforeEach(function() {
        card = new EventEmitter();
        parentView = new View();
        spyOn(FullImageCardController.prototype, 'addView').and.callThrough();

        FullImageCardCtrl = new FullImageCardController(card, parentView);
    });

    it('should exist', function() {
        expect(FullImageCardCtrl).toEqual(jasmine.any(ImageCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a FullVideoCardView', function() {
                expect(FullImageCardCtrl.view).toEqual(jasmine.any(FullVideoCardView));
                expect(FullImageCardCtrl.addView).toHaveBeenCalledWith(FullImageCardCtrl.view);
            });
        });
    });
});
