import FullRecapCardView from '../../../../src/views/full/FullRecapCardView.js';
import RecapCardView from '../../../../src/views/RecapCardView.js';
import FullRecapCardListView from '../../../../src/views/full/FullRecapCardListView.js';
import Runner from '../../../../lib/Runner.js';

describe('FullRecapCardView', function() {
    let view;

    beforeEach(function() {
        view = new FullRecapCardView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(RecapCardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of FullRecapCardView.html', function() {
                expect(view.template).toEqual(require('../../../../src/views/full/FullRecapCardView.html'));
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
