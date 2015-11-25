import FullRecapCardController from '../../../../src/controllers/full/FullRecapCardController.js';
import RecapCardController from '../../../../src/controllers/RecapCardController.js';
import FullRecapCardView from '../../../../src/views/full/FullRecapCardView.js';
import View from '../../../../lib/core/View.js';
import {EventEmitter} from 'events';

describe('FullRecapCardController', function() {
    let FullRecapCardCtrl;
    let parentView;
    let card;

    beforeEach(function() {
        parentView = new View();
        card = new EventEmitter();
        spyOn(FullRecapCardController.prototype, 'addListeners');

        FullRecapCardCtrl = new FullRecapCardController(card, parentView);
    });

    it('should exist', function() {
        expect(FullRecapCardCtrl).toEqual(jasmine.any(RecapCardController));
    });

    it('should add its listeners', function() {
        expect(FullRecapCardCtrl.addListeners).toHaveBeenCalled();
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a FullRecapCardView', function() {
                expect(FullRecapCardCtrl.view).toEqual(jasmine.any(FullRecapCardView));
            });
        });
    });
});
