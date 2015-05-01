import SoloVideoCardController from '../../../../src/controllers/solo/SoloVideoCardController.js';
import VideoCardController from '../../../../src/controllers/VideoCardController.js';
import SoloVideoCardView from '../../../../src/views/solo/SoloVideoCardView.js';
import { EventEmitter } from 'events';

describe('SoloVideoCardController', function() {
    let SoloVideoCardCtrl;
    let card;

    beforeEach(function() {
        card = new EventEmitter();
        card.data = { type: 'youtube' };
        card.thumbs = {};
        card.modules = {};
        card.getSrc = jasmine.createSpy('card.getSrc()');

        SoloVideoCardCtrl = new SoloVideoCardController(card);
    });

    it('should exist', function() {
        expect(SoloVideoCardCtrl).toEqual(jasmine.any(VideoCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a SoloVideoCardView', function() {
                expect(SoloVideoCardCtrl.view).toEqual(jasmine.any(SoloVideoCardView));
            });
        });
    });
});
