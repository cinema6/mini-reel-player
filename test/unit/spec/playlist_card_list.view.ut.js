import PlaylistCardListView from '../../../src/views/PlaylistCardListView.js';
import ListView from '../../../src/views/ListView.js';
import PlaylistCardView from '../../../src/views/PlaylistCardView.js';

describe('PlaylistCardListView', function() {
    let view;

    beforeEach(function() {
        view = new PlaylistCardListView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(ListView));
    });

    describe('properties:', function() {
        describe('classes', function() {
            it('should be the usual ListView classes + "playlist"', function() {
                expect(view.classes).toEqual(new ListView().classes.concat(['playlist']));
            });
        });

        describe('itemViewClass', function() {
            it('should be PlaylistCardView', function() {
                expect(view.itemViewClass).toBe(PlaylistCardView);
            });
        });
    });
});
