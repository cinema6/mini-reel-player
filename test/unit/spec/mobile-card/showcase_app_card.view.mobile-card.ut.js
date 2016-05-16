import MobileCardShowcaseAppCardView from '../../../../src/views/mobile-card/MobileCardShowcaseAppCardView.js';
import CardView from '../../../../src/views/CardView.js';
import Runner from '../../../../lib/Runner.js';
import CarouselView from '../../../../src/views/CarouselView.js';

describe('MobileCardShowcaseAppCardView', function() {
    let view;

    beforeEach(function() {
        view = new MobileCardShowcaseAppCardView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(CardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of MobileCardShowcaseAppCardView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/mobile-card/MobileCardShowcaseAppCardView.html'));
            });
        });

        describe('child views', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
            });

            describe('slides', function() {
                it('should be a CarouselView', function() {
                    expect(view.slides).toEqual(jasmine.any(CarouselView));
                });
            });
        });
    });
});
