import StarRatingView from '../../../src/views/StarRatingView.js';
import ListView from '../../../src/views/ListView.js';
import Runner from '../../../lib/Runner.js';
import { forEach } from '../../../lib/utils.js';

describe('StarRatingView', function() {
    let view;

    beforeEach(function() {
        view = new StarRatingView();
        Runner.run(() => view.create());
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(ListView));
    });

    it('should be a <ul>', function() {
        expect(view.element.tagName).toBe('UL');
    });

    describe('update(rating)', function() {
        let rating;
        let stars;

        beforeEach(function() {
            rating = 3;

            Runner.run(() => view.update(rating));
            stars = view.element.children;
        });

        it('should render <li>s for each star', function() {
            expect(stars.length).toBe(5);
            forEach(stars, star => expect(star.tagName).toBe('LI'));

            expect(stars[0].firstElementChild.classList).toEqual(jasmine.objectContaining(['fa-icon', 'icon-star']));
            expect(stars[1].firstElementChild.classList).toEqual(jasmine.objectContaining(['fa-icon', 'icon-star']));
            expect(stars[2].firstElementChild.classList).toEqual(jasmine.objectContaining(['fa-icon', 'icon-star']));
            expect(stars[3].firstElementChild.classList).toEqual(jasmine.objectContaining(['fa-icon', 'icon-star-empty']));
            expect(stars[4].firstElementChild.classList).toEqual(jasmine.objectContaining(['fa-icon', 'icon-star-empty']));
        });

        describe('if a float is passed', function() {
            beforeEach(function() {
                Runner.run(() => view.update(2.5));
            });

            it('should render a half-star', function() {
                expect(stars[0].firstElementChild.classList).toEqual(jasmine.objectContaining(['fa-icon', 'icon-star']));
                expect(stars[1].firstElementChild.classList).toEqual(jasmine.objectContaining(['fa-icon', 'icon-star']));
                expect(stars[2].firstElementChild.classList).toEqual(jasmine.objectContaining(['fa-icon', 'icon-star-half-alt']));
                expect(stars[3].firstElementChild.classList).toEqual(jasmine.objectContaining(['fa-icon', 'icon-star-empty']));
                expect(stars[4].firstElementChild.classList).toEqual(jasmine.objectContaining(['fa-icon', 'icon-star-empty']));
            });
        });
    });
});
