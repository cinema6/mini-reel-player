import ThumbnailNavigatorListView from '../../../src/views/ThumbnailNavigatorListView.js';
import ListView from '../../../src/views/ListView.js';
import ThumbnailNavigatorItemView from '../../../src/views/ThumbnailNavigatorItemView.js';

describe('ThumbnailNavigatorListView', function() {
    let view;

    beforeEach(function() {
        view = new ThumbnailNavigatorListView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(ListView));
    });

    describe('properties:', function() {
        describe('itemViewClass', function() {
            it('should be ThumbnailNavigatorItemView', function() {
                expect(view.itemViewClass).toBe(ThumbnailNavigatorItemView);
            });
        });
    });
});
