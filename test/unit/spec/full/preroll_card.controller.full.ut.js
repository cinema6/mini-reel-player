import FullPrerollCardController from '../../../../src/controllers/full/FullPrerollCardController.js';
import PrerollCardController from '../../../../src/controllers/PrerollCardController.js';
import { EventEmitter } from 'events';
import SkipTimerVideoCardController from '../../../../src/mixins/SkipTimerVideoCardController.js';
import CompanionPrerollCardController from '../../../../src/mixins/CompanionPrerollCardController.js';
import FullPrerollCardView from '../../../../src/views/full/FullPrerollCardView.js';

describe('FullPrerollCardController', function() {
    let FullPrerollCardCtrl;
    let card;

    beforeEach(function() {
        card = new EventEmitter();
        card.data = {
            type: 'vast'
        };

        spyOn(FullPrerollCardController.prototype, 'initSkipTimer').and.callThrough();
        spyOn(FullPrerollCardController.prototype, 'initCompanion').and.callThrough();

        FullPrerollCardCtrl = new FullPrerollCardController(card);
    });

    it('should exist', function() {
        expect(FullPrerollCardCtrl).toEqual(jasmine.any(PrerollCardController));
    });

    it('should mixin the SkipTimerVideoCardController', function() {
        expect(FullPrerollCardController.mixins).toContain(SkipTimerVideoCardController);
        expect(FullPrerollCardCtrl.initSkipTimer).toHaveBeenCalled();
    });

    it('should mixin the CompanionPrerollCardController', function() {
        expect(FullPrerollCardController.mixins).toContain(CompanionPrerollCardController);
        expect(FullPrerollCardCtrl.initCompanion).toHaveBeenCalled();
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a FullPrerollCardView', function() {
                expect(FullPrerollCardCtrl.view).toEqual(jasmine.any(FullPrerollCardView));
            });
        });
    });
});
