import MobileRecapCardListView from '../../../../src/views/mobile/MobileRecapCardListView.js';
import ListView from '../../../../src/views/ListView.js';
import MobileRecapCardItemView from '../../../../src/views/mobile/MobileRecapCardItemView.js';

describe('MobileRecapCardListView', function() {
    let view;

    beforeEach(function() {
        view = new MobileRecapCardListView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(ListView));
    });

    describe('properties:', function() {
        describe('itemViewClass', function() {
            it('should be RecapCardItemView', function() {
                expect(view.itemViewClass).toBe(MobileRecapCardItemView);
            });
        });
    });
});
