import FullNPTextCardController from '../../../../src/controllers/full-np/FullNPTextCardController.js';
import TextCardController from '../../../../src/controllers/TextCardController.js';
import View from '../../../../lib/core/View.js';
import FullNPTextCardView from '../../../../src/views/full-np/FullNPTextCardView.js';
import {EventEmitter} from 'events';

describe('FullNPTextCardController', function() {
    let FullNPTextCardCtrl;
    let card;
    let parentView;

    beforeEach(function() {
        card = new EventEmitter();
        parentView = new View();
        spyOn(FullNPTextCardController.prototype, 'addView').and.callThrough();

        FullNPTextCardCtrl = new FullNPTextCardController(card, parentView);
    });

    it('should exist', function() {
        expect(FullNPTextCardCtrl).toEqual(jasmine.any(TextCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a FullNPTextCardView', function() {
                expect(FullNPTextCardCtrl.view).toEqual(jasmine.any(FullNPTextCardView));
                expect(FullNPTextCardCtrl.addView).toHaveBeenCalledWith(FullNPTextCardCtrl.view);
            });
        });
    });

    describe('methods:', function() {
        describe('advance()', function() {
            beforeEach(function() {
                card.complete = jasmine.createSpy('card.complete()');

                FullNPTextCardCtrl.advance();
            });

            it('should call complete() on the card', function() {
                expect(card.complete).toHaveBeenCalled();
            });
        });
    });
});
