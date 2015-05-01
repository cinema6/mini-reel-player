import LightboxPrerollCardController from '../../../../src/controllers/lightbox/LightboxPrerollCardController.js';
import PrerollCardController from '../../../../src/controllers/PrerollCardController.js';
import LightboxPrerollCardView from '../../../../src/views/lightbox/LightboxPrerollCardView.js';
import { EventEmitter } from 'events';
import CompanionPrerollCardController from '../../../../src/mixins/CompanionPrerollCardController.js';

describe('LightboxPrerollCardController', function() {
    let LightboxPrerollCardCtrl;
    let card;

    beforeEach(function() {
        card = new EventEmitter();
        card.data = {
            type: 'vast'
        };
        card.getSrc = jasmine.createSpy('card.getSrc()');

        spyOn(LightboxPrerollCardController.prototype, 'initCompanion').and.callThrough();

        LightboxPrerollCardCtrl = new LightboxPrerollCardController(card);
    });

    it('should exist', function() {
        expect(LightboxPrerollCardCtrl).toEqual(jasmine.any(PrerollCardController));
    });

    it('should mixin the CompanionPrerollCardController', function() {
        expect(LightboxPrerollCardController.mixins).toContain(CompanionPrerollCardController);
        expect(LightboxPrerollCardCtrl.initCompanion).toHaveBeenCalled();
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a LightboxPrerollCardView', function() {
                expect(LightboxPrerollCardCtrl.view).toEqual(jasmine.any(LightboxPrerollCardView));
            });
        });
    });
});
