import LightTextCardController from '../../../../src/controllers/light/LightTextCardController.js';
import TextCardController from '../../../../src/controllers/TextCardController.js';
import {EventEmitter} from 'events';
import LightTextCardView from '../../../../src/views/light/LightTextCardView.js';

describe('LightTextCardController', function() {
    let LightTextCardCtrl;
    let card;

    beforeEach(function() {
        card = new EventEmitter();
        spyOn(LightTextCardController.prototype, 'addView').and.callThrough();

        LightTextCardCtrl = new LightTextCardController(card);
    });

    it('should exist', function() {
        expect(LightTextCardCtrl).toEqual(jasmine.any(TextCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a LightTextCardView', function() {
                expect(LightTextCardCtrl.view).toEqual(jasmine.any(LightTextCardView));
                expect(LightTextCardCtrl.addView).toHaveBeenCalledWith(LightTextCardCtrl.view);
            });
        });
    });

    describe('methods:', function() {
        describe('advance()', function() {
            beforeEach(function() {
                card.complete = jasmine.createSpy('card.complete()');

                LightTextCardCtrl.advance();
            });

            it('should call complete() on its card', function() {
                expect(card.complete).toHaveBeenCalled();
            });
        });
    });
});
