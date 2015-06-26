import LightboxPlaylistImageCardController from '../../../../src/controllers/lightbox-playlist/LightboxPlaylistImageCardController.js';
import ImageCardController from '../../../../src/controllers/ImageCardController.js';
import View from '../../../../lib/core/View.js';
import LightboxPlaylistVideoCardView from '../../../../src/views/lightbox-playlist/LightboxPlaylistVideoCardView.js';
import {EventEmitter} from 'events';

describe('LightboxPlaylistImageCardController', function() {
    let LightboxPlaylistImageCardCtrl;
    let card;
    let parentView;

    beforeEach(function() {
        card = new EventEmitter();
        parentView = new View();
        spyOn(LightboxPlaylistImageCardController.prototype, 'addView').and.callThrough();

        LightboxPlaylistImageCardCtrl = new LightboxPlaylistImageCardController(card, parentView);
    });

    it('should exist', function() {
        expect(LightboxPlaylistImageCardCtrl).toEqual(jasmine.any(ImageCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a LightboxPlaylistVideoCardView', function() {
                expect(LightboxPlaylistImageCardCtrl.view).toEqual(jasmine.any(LightboxPlaylistVideoCardView));
                expect(LightboxPlaylistImageCardCtrl.addView).toHaveBeenCalledWith(LightboxPlaylistImageCardCtrl.view);
            });
        });
    });

    describe('methods:', function() {
        describe('advance()', function() {
            beforeEach(function() {
                card.complete = jasmine.createSpy('card.complete()');

                LightboxPlaylistImageCardCtrl.advance();
            });

            it('should call complete() on the card', function() {
                expect(card.complete).toHaveBeenCalled();
            });
        });
    });
});
