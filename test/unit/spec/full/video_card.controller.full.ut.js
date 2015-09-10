import FullVideoCardController from '../../../../src/controllers/full/FullVideoCardController.js';
import VideoCardController from '../../../../src/controllers/VideoCardController.js';
import FullVideoCardView from '../../../../src/views/full/FullVideoCardView.js';
import {EventEmitter} from 'events';
import View from '../../../../lib/core/View.js';
import SkipTimerVideoCardController from '../../../../src/mixins/SkipTimerVideoCardController.js';
import ModalBallotResultsVideoCardController from '../../../../src/mixins/ModalBallotResultsVideoCardController.js';
import ModalShareVideoCardController from '../../../../src/mixins/ModalShareVideoCardController.js';

describe('FullVideoCardController', function() {
    let FullVideoCardCtrl;
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
        spyOn(FullVideoCardController.prototype, 'addView').and.callThrough();
        spyOn(FullVideoCardController.prototype, 'initSkipTimer').and.callThrough();
        spyOn(FullVideoCardController.prototype, 'initBallotResults').and.callThrough();
        spyOn(FullVideoCardController.prototype, 'initShare').and.callThrough();

        FullVideoCardCtrl = new FullVideoCardController(card, parentView);
    });

    it('should exist', function() {
        expect(FullVideoCardCtrl).toEqual(jasmine.any(VideoCardController));
    });

    it('should initialize the skip timer', function() {
        expect(FullVideoCardCtrl.initSkipTimer).toHaveBeenCalled();
    });

    it('should mixin the SkipTimerVideoCardController', function() {
        expect(FullVideoCardController.mixins).toContain(SkipTimerVideoCardController);
    });

    it('should mixin the ModalBallotResultsVideoCardController', function() {
        expect(FullVideoCardController.mixins).toContain(ModalBallotResultsVideoCardController);
        expect(FullVideoCardCtrl.initBallotResults).toHaveBeenCalled();
    });

    it('should mixin the ModalShareVideoCardController', function() {
        expect(FullVideoCardController.mixins).toContain(ModalShareVideoCardController);
        expect(FullVideoCardCtrl.initShare).toHaveBeenCalled();
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a FullVideoCardView', function() {
                expect(FullVideoCardCtrl.view).toEqual(jasmine.any(FullVideoCardView));
                expect(FullVideoCardCtrl.addView).toHaveBeenCalledWith(FullVideoCardCtrl.view);
            });
        });
    });
});
