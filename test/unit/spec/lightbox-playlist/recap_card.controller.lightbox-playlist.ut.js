import LightboxPlaylistRecapCardController from '../../../../src/controllers/lightbox-playlist/LightboxPlaylistRecapCardController.js';
import RecapCardController from '../../../../src/controllers/RecapCardController.js';
import LightboxPlaylistRecapCardView from '../../../../src/views/lightbox-playlist/LightboxPlaylistRecapCardView.js';
import {EventEmitter} from 'events';

describe('LightboxPlaylistRecapCardController', function() {
    let LightboxPlaylistRecapCardCtrl;
    let card;

    beforeEach(function() {
        card = new EventEmitter();
        spyOn(LightboxPlaylistRecapCardController.prototype, 'addListeners').and.callThrough();

        LightboxPlaylistRecapCardCtrl = new LightboxPlaylistRecapCardController(card);
    });

    it('should exist', function() {
        expect(LightboxPlaylistRecapCardCtrl).toEqual(jasmine.any(RecapCardController));
    });

    it('should add listeners', function() {
        expect(LightboxPlaylistRecapCardCtrl.addListeners).toHaveBeenCalled();
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a LightboxPlaylistRecapCardView', function() {
                expect(LightboxPlaylistRecapCardCtrl.view).toEqual(jasmine.any(LightboxPlaylistRecapCardView));
            });
        });
    });
});
