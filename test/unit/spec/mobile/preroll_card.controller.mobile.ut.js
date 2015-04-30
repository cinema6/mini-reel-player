import MobilePrerollCardController from '../../../../src/controllers/mobile/MobilePrerollCardController.js';
import PrerollCardController from '../../../../src/controllers/PrerollCardController.js';
import { EventEmitter } from 'events';
import MobilePrerollCardView from '../../../../src/views/mobile/MobilePrerollCardView.js';

describe('MobilePrerollCardController', function() {
    let MobilePrerollCardCtrl;
    let card;

    beforeEach(function() {
        card = new EventEmitter();
        card.data = {
            type: 'vast'
        };

        MobilePrerollCardCtrl = new MobilePrerollCardController(card);
    });

    it('should exist', function() {
        expect(MobilePrerollCardCtrl).toEqual(jasmine.any(PrerollCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a MobilePrerollCardView', function() {
                expect(MobilePrerollCardCtrl.view).toEqual(jasmine.any(MobilePrerollCardView));
            });
        });
    });
});
