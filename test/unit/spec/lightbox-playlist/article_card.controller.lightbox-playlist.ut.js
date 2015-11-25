import LightboxPlaylistArticleCardController from '../../../../src/controllers/lightbox-playlist/LightboxPlaylistArticleCardController.js';
import ArticleCardController from '../../../../src/controllers/ArticleCardController.js';
import View from '../../../../lib/core/View.js';
import LightboxPlaylistArticleCardView from '../../../../src/views/lightbox-playlist/LightboxPlaylistArticleCardView.js';
import {EventEmitter} from 'events';

describe('LightboxPlaylistArticleCardController', function() {
    let LightboxPlaylistArticleCardCtrl;
    let card;
    let parentView;

    beforeEach(function() {
        card = new EventEmitter();
        parentView = new View();
        spyOn(LightboxPlaylistArticleCardController.prototype, 'addView').and.callThrough();

        LightboxPlaylistArticleCardCtrl = new LightboxPlaylistArticleCardController(card, parentView);
    });

    it('should exist', function() {
        expect(LightboxPlaylistArticleCardCtrl).toEqual(jasmine.any(ArticleCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a LightboxPlaylistArticleCardView', function() {
                expect(LightboxPlaylistArticleCardCtrl.view).toEqual(jasmine.any(LightboxPlaylistArticleCardView));
                expect(LightboxPlaylistArticleCardCtrl.addView).toHaveBeenCalledWith(LightboxPlaylistArticleCardCtrl.view);
            });
        });
    });
});
