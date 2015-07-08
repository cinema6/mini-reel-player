import LightboxPlaylistArticleCardView from '../../../../src/views/lightbox-playlist/LightboxPlaylistArticleCardView.js';
import CardView from '../../../../src/views/CardView.js';

describe('LightboxPlaylistVideoCardView', function() {
    let view;

    beforeEach(function() {
        view = new LightboxPlaylistArticleCardView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(CardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of LightboxPlaylistArticleCardView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/lightbox-playlist/LightboxPlaylistArticleCardView.html'));
            });
        });
    });
});
