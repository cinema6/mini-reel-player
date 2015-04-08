import LightboxPlaylistTextCardController from '../../../../src/controllers/lightbox-playlist/LightboxPlaylistTextCardController.js';
import TextCardController from '../../../../src/controllers/TextCardController.js';
import LightboxPlaylistTextCardView from '../../../../src/views/lightbox-playlist/LightboxPlaylistTextCardView.js';
import {EventEmitter} from 'events';

describe('LightboxPlaylistTextCardController', function() {
    let LightboxPlaylistTextCardCtrl;
    let card;

    beforeEach(function() {
        card = new EventEmitter();
        spyOn(LightboxPlaylistTextCardController.prototype, 'addView').and.callThrough();

        LightboxPlaylistTextCardCtrl = new LightboxPlaylistTextCardController(card);
    });

    it('should exist', function() {
        expect(LightboxPlaylistTextCardCtrl).toEqual(jasmine.any(TextCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a LightboxPlaylistTextCardView', function() {
                expect(LightboxPlaylistTextCardCtrl.view).toEqual(jasmine.any(LightboxPlaylistTextCardView));
                expect(LightboxPlaylistTextCardCtrl.addView).toHaveBeenCalledWith(LightboxPlaylistTextCardCtrl.view);
            });
        });
    });

    describe('methods:', function() {
        describe('advance()', function() {
            beforeEach(function() {
                card.complete = jasmine.createSpy('card.complete()');

                LightboxPlaylistTextCardCtrl.advance();
            });

            it('should call complete() on the card', function() {
                expect(card.complete).toHaveBeenCalled();
            });
        });
    });
});
