import RecapCardListView from '../../../src/views/RecapCardListView.js';
import ListView from '../../../src/views/ListView.js';
import RecapCardItemView from '../../../src/views/RecapCardItemView.js';

describe('RecapCardListView', function() {
    let view;

    beforeEach(function() {
        view = new RecapCardListView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(ListView));
    });

    describe('properties:', function() {
        describe('itemViewClass', function() {
            it('should be RecapCardItemView', function() {
                expect(view.itemViewClass).toBe(RecapCardItemView);
            });
        });
    });
});
