import LightPrerollCardController from '../../../../src/controllers/light/LightPrerollCardController.js';
import PrerollCardController from '../../../../src/controllers/PrerollCardController.js';
import { EventEmitter } from 'events';
import LightPrerollCardView from '../../../../src/views/light/LightPrerollCardView.js';

describe('LightPrerollCardController', function() {
    let LightPrerollCardCtrl;
    let card;

    beforeEach(function() {
        card = new EventEmitter();
        card.data = {};

        LightPrerollCardCtrl = new LightPrerollCardController(card);
    });

    it('should exist', function() {
        expect(LightPrerollCardCtrl).toEqual(jasmine.any(PrerollCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a LightPrerollCardView', function() {
                expect(LightPrerollCardCtrl.view).toEqual(jasmine.any(LightPrerollCardView));
            });
        });
    });
});
