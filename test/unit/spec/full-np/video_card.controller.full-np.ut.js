import FullNPVideoCardController from '../../../../src/controllers/full-np/FullNPVideoCardController.js';
import VideoCardController from '../../../../src/controllers/VideoCardController.js';
import FullNPVideoCardView from '../../../../src/views/full-np/FullNPVideoCardView.js';
import {EventEmitter} from 'events';
import View from '../../../../lib/core/View.js';
import SkipTimerVideoCardController from '../../../../src/mixins/SkipTimerVideoCardController.js';
import ModalBallotResultsVideoCardController from '../../../../src/mixins/ModalBallotResultsVideoCardController.js';
import ModalShareVideoCardController from '../../../../src/mixins/ModalShareVideoCardController.js';

describe('FullNPVideoCardController', function() {
    let FullNPVideoCardCtrl;
    let parentView;
    let card;

    beforeEach(function() {
        parentView = new View();
        card = new EventEmitter();
        card.data = {
            type: 'youtube'
        };
        card.thumbs = { large: 'large.jpg' };
        card.modules = {};
        card.getSrc = jasmine.createSpy('card.getSrc()');
        spyOn(FullNPVideoCardController.prototype, 'addView').and.callThrough();
        spyOn(FullNPVideoCardController.prototype, 'initSkipTimer').and.callThrough();
        spyOn(FullNPVideoCardController.prototype, 'initBallotResults').and.callThrough();
        spyOn(FullNPVideoCardController.prototype, 'initShare').and.callThrough();

        FullNPVideoCardCtrl = new FullNPVideoCardController(card, parentView);
    });

    it('should exist', function() {
        expect(FullNPVideoCardCtrl).toEqual(jasmine.any(VideoCardController));
    });

    it('should initialize the skip timer', function() {
        expect(FullNPVideoCardCtrl.initSkipTimer).toHaveBeenCalled();
    });

    it('should mixin the SkipTimerVideoCardController', function() {
        expect(FullNPVideoCardController.mixins).toContain(SkipTimerVideoCardController);
    });

    it('should mixin the ModalBallotResultsVideoCardController', function() {
        expect(FullNPVideoCardController.mixins).toContain(ModalBallotResultsVideoCardController);
        expect(FullNPVideoCardCtrl.initBallotResults).toHaveBeenCalled();
    });

    it('should mixin the ModalShareVideoCardController', function() {
        expect(FullNPVideoCardController.mixins).toContain(ModalShareVideoCardController);
        expect(FullNPVideoCardCtrl.initShare).toHaveBeenCalled();
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a FullNPVideoCardView', function() {
                expect(FullNPVideoCardCtrl.view).toEqual(jasmine.any(FullNPVideoCardView));
                expect(FullNPVideoCardCtrl.addView).toHaveBeenCalledWith(FullNPVideoCardCtrl.view);
            });
        });
    });
});
