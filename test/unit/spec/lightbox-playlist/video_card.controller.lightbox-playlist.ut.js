import LightboxPlaylistVideoCardController from '../../../../src/controllers/lightbox-playlist/LightboxPlaylistVideoCardController.js';
import VideoCardController from '../../../../src/controllers/VideoCardController.js';
import LightboxPlaylistVideoCardView from '../../../../src/views/lightbox-playlist/LightboxPlaylistVideoCardView.js';
import SkipTimerVideoCardController from '../../../../src/mixins/SkipTimerVideoCardController.js';
import {EventEmitter} from 'events';
import ModalBallotResultsVideoCardController from '../../../../src/mixins/ModalBallotResultsVideoCardController.js';
import ModalShareVideoCardController from '../../../../src/mixins/ModalShareVideoCardController.js';

describe('LightboxPlaylistVideoCardController', function() {
    let LightboxPlaylistVideoCardCtrl;
    let card;

    beforeEach(function() {
        card = new EventEmitter();
        card.data = {
            type: 'youtube'
        };
        card.thumbs = {
            large: 'large.jpg'
        };
        card.modules = {};
        card.getSrc = jasmine.createSpy('card.getSrc()');
        spyOn(LightboxPlaylistVideoCardController.prototype, 'addView').and.callThrough();
        spyOn(LightboxPlaylistVideoCardController.prototype, 'initSkipTimer').and.callThrough();
        spyOn(LightboxPlaylistVideoCardController.prototype, 'initBallotResults').and.callThrough();
        spyOn(LightboxPlaylistVideoCardController.prototype, 'initShare').and.callThrough();

        LightboxPlaylistVideoCardCtrl = new LightboxPlaylistVideoCardController(card);
    });

    it('should exist', function() {
        expect(LightboxPlaylistVideoCardCtrl).toEqual(jasmine.any(VideoCardController));
    });

    it('should mix in the SkipTimerVideoCardController', function() {
        expect(LightboxPlaylistVideoCardController.mixins).toContain(SkipTimerVideoCardController);
        expect(LightboxPlaylistVideoCardCtrl.initSkipTimer).toHaveBeenCalled();
    });

    it('should mix in the ModalBallotResultsVideoCardController', function() {
        expect(LightboxPlaylistVideoCardController.mixins).toContain(ModalBallotResultsVideoCardController);
        expect(LightboxPlaylistVideoCardCtrl.initBallotResults).toHaveBeenCalled();
    });

    it('should mix in the ModalShareVideoCardController', function() {
        expect(LightboxPlaylistVideoCardController.mixins).toContain(ModalShareVideoCardController);
        expect(LightboxPlaylistVideoCardCtrl.initShare).toHaveBeenCalled();
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a LightboxPlaylistVideoCardView', function() {
                expect(LightboxPlaylistVideoCardCtrl.view).toEqual(jasmine.any(LightboxPlaylistVideoCardView));
                expect(LightboxPlaylistVideoCardCtrl.addView).toHaveBeenCalledWith(LightboxPlaylistVideoCardCtrl.view);
            });
        });
    });
});
