import LinksListView from '../../../src/views/LinksListView.js';
import ListView from '../../../src/views/ListView.js';

describe('LinksListView', function() {
    let view;

    beforeEach(function() {
        view = new LinksListView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(ListView));
    });

    describe('properties:', function() {
        describe('itemIdentifier', function() {
            it('should be "type"', function() {
                expect(view.itemIdentifier).toBe('type');
            });
        });
    });
});
