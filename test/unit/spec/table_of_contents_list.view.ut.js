import TableOfContentsListView from '../../../src/views/TableOfContentsListView.js';
import ListView from '../../../src/views/ListView.js';
import TableOfContentsCardView from '../../../src/views/TableOfContentsCardView.js';

describe('TableOfContentsListView', function() {
    let view;

    beforeEach(function() {
        view = new TableOfContentsListView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(ListView));
    });

    describe('properities:', function() {
        describe('itemViewClass', function() {
            it('should be TableOfContentsCardView', function() {
                expect(view.itemViewClass).toBe(TableOfContentsCardView);
            });
        });
    });
});
