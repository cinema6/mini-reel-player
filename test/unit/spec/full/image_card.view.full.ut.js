import FullImageCardView from '../../../../src/views/full/FullImageCardView.js';
import CardView from '../../../../src/views/CardView.js';
import Runner from '../../../../lib/Runner.js';
import View from '../../../../lib/core/View.js';

describe('FullImageCardView', function() {
    let view;

    beforeEach(function() {
        view = new FullImageCardView();
    });

    it('should be a CardView', function() {
        expect(view).toEqual(jasmine.any(CardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of FullImageCardView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/full/FullImageCardView.html'));
            });
        });

        describe('child views:', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
            });

            describe('embed', function() {
                it('should be a View', function() {
                    expect(view.embed).toEqual(jasmine.any(View));
                });
            });
        });
    });
});
