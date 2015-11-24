import FullNPRecapCardView from '../../../../src/views/full-np/FullNPRecapCardView.js';
import RecapCardView from '../../../../src/views/RecapCardView.js';
import FullNPRecapCardListView from '../../../../src/views/full-np/FullNPRecapCardListView.js';
import Runner from '../../../../lib/Runner.js';

describe('FullNPRecapCardView', function() {
    let view;

    beforeEach(function() {
        view = new FullNPRecapCardView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(RecapCardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of FullNPRecapCardView.html', function() {
                expect(view.template).toEqual(require('../../../../src/views/full-np/FullNPRecapCardView.html'));
            });
        });

        describe('child views:', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
            });

            describe('cards', function() {
                it('should be a FullNPRecapCardListView', function() {
                    expect(view.cards).toEqual(jasmine.any(FullNPRecapCardListView));
                });
            });
        });
    });
});
