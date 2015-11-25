import FullNPRecapCardController from '../../../../src/controllers/full-np/FullNPRecapCardController.js';
import RecapCardController from '../../../../src/controllers/RecapCardController.js';
import FullNPRecapCardView from '../../../../src/views/full-np/FullNPRecapCardView.js';
import View from '../../../../lib/core/View.js';
import {EventEmitter} from 'events';

describe('FullNPRecapCardController', function() {
    let FullNPRecapCardCtrl;
    let parentView;
    let card;

    beforeEach(function() {
        parentView = new View();
        card = new EventEmitter();
        spyOn(FullNPRecapCardController.prototype, 'addListeners');

        FullNPRecapCardCtrl = new FullNPRecapCardController(card, parentView);
    });

    it('should exist', function() {
        expect(FullNPRecapCardCtrl).toEqual(jasmine.any(RecapCardController));
    });

    it('should add its listeners', function() {
        expect(FullNPRecapCardCtrl.addListeners).toHaveBeenCalled();
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a FullNPRecapCardView', function() {
                expect(FullNPRecapCardCtrl.view).toEqual(jasmine.any(FullNPRecapCardView));
            });
        });
    });
});
