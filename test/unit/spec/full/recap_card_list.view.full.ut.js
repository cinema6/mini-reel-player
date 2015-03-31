import FullRecapCardListView from '../../../../src/views/full/FullRecapCardListView.js';
import ListView from '../../../../src/views/ListView.js';
import FullRecapCardItemView from '../../../../src/views/full/FullRecapCardItemView.js';

describe('FullRecapCardListView', function() {
    let view;

    beforeEach(function() {
        view = new FullRecapCardListView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(ListView));
    });

    describe('properties:', function() {
        describe('itemViewClass', function() {
            it('should be the FullRecapCardItemView class', function() {
                expect(view.itemViewClass).toBe(FullRecapCardItemView);
            });
        });
    });
});
