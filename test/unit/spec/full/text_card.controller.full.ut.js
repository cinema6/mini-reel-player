import FullTextCardController from '../../../../src/controllers/full/FullTextCardController.js';
import TextCardController from '../../../../src/controllers/TextCardController.js';
import View from '../../../../lib/core/View.js';
import FullTextCardView from '../../../../src/views/full/FullTextCardView.js';
import {EventEmitter} from 'events';

describe('FullTextCardController', function() {
    let FullTextCardCtrl;
    let card;
    let parentView;

    beforeEach(function() {
        card = new EventEmitter();
        parentView = new View();
        spyOn(FullTextCardController.prototype, 'addView').and.callThrough();

        FullTextCardCtrl = new FullTextCardController(card, parentView);
    });

    it('should exist', function() {
        expect(FullTextCardCtrl).toEqual(jasmine.any(TextCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a FullTextCardView', function() {
                expect(FullTextCardCtrl.view).toEqual(jasmine.any(FullTextCardView));
                expect(FullTextCardCtrl.addView).toHaveBeenCalledWith(FullTextCardCtrl.view);
            });
        });
    });

    describe('methods:', function() {
        describe('advance()', function() {
            beforeEach(function() {
                card.complete = jasmine.createSpy('card.complete()');

                FullTextCardCtrl.advance();
            });

            it('should call complete() on the card', function() {
                expect(card.complete).toHaveBeenCalled();
            });
        });
    });
});
