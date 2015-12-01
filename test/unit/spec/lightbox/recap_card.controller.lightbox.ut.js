import LightboxRecapCardController from '../../../../src/controllers/lightbox/LightboxRecapCardController.js';
import RecapCardController from '../../../../src/controllers/RecapCardController.js';
import LightboxRecapCardView from '../../../../src/views/lightbox/LightboxRecapCardView.js';
import {EventEmitter} from 'events';

describe('LightboxRecapCardController', function() {
    let LightboxRecapCardCtrl;
    let card;

    beforeEach(function() {
        card = new EventEmitter();
        spyOn(LightboxRecapCardController.prototype, 'addListeners').and.callThrough();

        LightboxRecapCardCtrl = new LightboxRecapCardController(card);
    });

    it('should exist', function() {
        expect(LightboxRecapCardCtrl).toEqual(jasmine.any(RecapCardController));
    });

    it('should add listeners', function() {
        expect(LightboxRecapCardCtrl.addListeners).toHaveBeenCalled();
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a LightboxRecapCardView', function() {
                expect(LightboxRecapCardCtrl.view).toEqual(jasmine.any(LightboxRecapCardView));
            });
        });
    });
});
