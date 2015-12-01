import FullNPRecapCardListView from '../../../../src/views/full-np/FullNPRecapCardListView.js';
import ListView from '../../../../src/views/ListView.js';
import FullNPRecapCardItemView from '../../../../src/views/full-np/FullNPRecapCardItemView.js';

describe('FullNPRecapCardListView', function() {
    let view;

    beforeEach(function() {
        view = new FullNPRecapCardListView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(ListView));
    });

    describe('properties:', function() {
        describe('itemViewClass', function() {
            it('should be the FullNPRecapCardItemView class', function() {
                expect(view.itemViewClass).toBe(FullNPRecapCardItemView);
            });
        });
    });
});
