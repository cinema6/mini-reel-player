import ModalShareListView from '../../../src/views/ModalShareListView.js';
import ListView from '../../../src/views/ListView.js';
import ModalShareItemView from '../../../src/views/ModalShareItemView';

describe('ModalShareLIstView', function() {
    let view;

    beforeEach(function() {
        view = new ModalShareListView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(ModalShareListView));
    });

    it('should be a ListView', function() {
        expect(view).toEqual(jasmine.any(ListView));
    });

    describe('properties', function() {
        describe('itemIdentifier', function() {
            it('should be type', function() {
                expect(view.itemIdentifier).toBe('type');
            });
        });

        describe('itemViewClass', function() {
            it('should be ModalShareItemView', function() {
                expect(view.itemViewClass).toBe(ModalShareItemView);
            });
        });
    });
});
