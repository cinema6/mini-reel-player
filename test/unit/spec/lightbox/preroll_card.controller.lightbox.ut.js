import LightboxPrerollCardController from '../../../../src/controllers/lightbox/LightboxPrerollCardController.js';
import PrerollCardController from '../../../../src/controllers/PrerollCardController.js';
import LightboxPrerollCardView from '../../../../src/views/lightbox/LightboxPrerollCardView.js';
import { EventEmitter } from 'events';

describe('LightboxPrerollCardController', function() {
    let LightboxPrerollCardCtrl;
    let card;

    beforeEach(function() {
        card = new EventEmitter();
        card.data = {};

        LightboxPrerollCardCtrl = new LightboxPrerollCardController(card);
    });

    it('should exist', function() {
        expect(LightboxPrerollCardCtrl).toEqual(jasmine.any(PrerollCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a LightboxPrerollCardView', function() {
                expect(LightboxPrerollCardCtrl.view).toEqual(jasmine.any(LightboxPrerollCardView));
            });
        });
    });
});
