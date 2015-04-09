import LightboxTextCardController from '../../../../src/controllers/lightbox/LightboxTextCardController.js';
import TextCardController from '../../../../src/controllers/TextCardController.js';
import {EventEmitter} from 'events';
import LightboxTextCardView from '../../../../src/views/lightbox/LightboxTextCardView.js';

describe('LightboxTextCardController', function() {
    let LightboxTextCardCtrl;
    let card;

    beforeEach(function() {
        card = new EventEmitter();
        spyOn(LightboxTextCardController.prototype, 'addView').and.callThrough();

        LightboxTextCardCtrl = new LightboxTextCardController(card);
    });

    it('should exist', function() {
        expect(LightboxTextCardCtrl).toEqual(jasmine.any(TextCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a LightboxTextCardView', function() {
                expect(LightboxTextCardCtrl.view).toEqual(jasmine.any(LightboxTextCardView));
                expect(LightboxTextCardCtrl.addView).toHaveBeenCalledWith(LightboxTextCardCtrl.view);
            });
        });
    });

    describe('methods:', function() {
        describe('advance()', function() {
            beforeEach(function() {
                card.complete = jasmine.createSpy('card.complete()');

                LightboxTextCardCtrl.advance();
            });

            it('should call complete() on the card', function() {
                expect(card.complete).toHaveBeenCalled();
            });
        });
    });
});
