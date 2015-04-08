import LightboxPlaylistRecapCardView from '../../../../src/views/lightbox-playlist/LightboxPlaylistRecapCardView.js';
import RecapCardView from '../../../../src/views/RecapCardView.js';
import Runner from '../../../../lib/Runner.js';
import FullRecapCardListView from '../../../../src/views/full/FullRecapCardListView.js';

describe('LightboxPlaylistRecapCardView', function() {
    let view;

    beforeEach(function() {
        view = new LightboxPlaylistRecapCardView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(RecapCardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of LightboxPlaylistRecapCardView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/lightbox-playlist/LightboxPlaylistRecapCardView.html'));
            });
        });

        describe('child views:', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
            });

            describe('cards', function() {
                it('should be a FullRecapCardListView', function() {
                    expect(view.cards).toEqual(jasmine.any(FullRecapCardListView));
                });
            });
        });
    });
});
