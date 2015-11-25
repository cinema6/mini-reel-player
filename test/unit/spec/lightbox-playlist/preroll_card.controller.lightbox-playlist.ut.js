import LightboxPlaylistPrerollCardController from '../../../../src/controllers/lightbox-playlist/LightboxPlaylistPrerollCardController.js';
import PrerollCardController from '../../../../src/controllers/PrerollCardController.js';
import LightboxPlaylistPrerollCardView from '../../../../src/views/lightbox-playlist/LightboxPlaylistPrerollCardView.js';
import SkipTimerVideoCardController from '../../../../src/mixins/SkipTimerVideoCardController.js';
import CompanionPrerollCardController from '../../../../src/mixins/CompanionPrerollCardController.js';
import { EventEmitter } from 'events';

describe('LightboxPlaylistPrerollCardController', function() {
    let LightboxPlaylistPrerollCardCtrl;
    let card;

    beforeEach(function() {
        card = new EventEmitter();
        card.data = {
            type: 'vast'
        };
        card.getSrc = jasmine.createSpy('card.getSrc()');

        spyOn(LightboxPlaylistPrerollCardController.prototype, 'initSkipTimer').and.callThrough();
        spyOn(LightboxPlaylistPrerollCardController.prototype, 'initCompanion').and.callThrough();

        LightboxPlaylistPrerollCardCtrl = new LightboxPlaylistPrerollCardController(card);
    });

    it('should exist', function() {
        expect(LightboxPlaylistPrerollCardCtrl).toEqual(jasmine.any(PrerollCardController));
    });

    it('should mixin the SkipTimerVideoCardController', function() {
        expect(LightboxPlaylistPrerollCardController.mixins).toContain(SkipTimerVideoCardController);
        expect(LightboxPlaylistPrerollCardCtrl.initSkipTimer).toHaveBeenCalled();
    });

    it('should mixin the CompanionPrerollCardController', function() {
        expect(LightboxPlaylistPrerollCardController.mixins).toContain(CompanionPrerollCardController);
        expect(LightboxPlaylistPrerollCardCtrl.initCompanion).toHaveBeenCalled();
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a LightboxPlaylistPrerollCardView', function() {
                expect(LightboxPlaylistPrerollCardCtrl.view).toEqual(jasmine.any(LightboxPlaylistPrerollCardView));
            });
        });
    });
});
