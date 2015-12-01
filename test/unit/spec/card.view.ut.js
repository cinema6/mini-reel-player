import CardView from '../../../src/views/CardView.js';
import TemplateView from '../../../lib/core/TemplateView.js';

describe('CardView', function() {
    let cardView;

    beforeEach(function() {
        cardView = new CardView();
    });

    it('should be a TemplateView', function() {
        expect(cardView).toEqual(jasmine.any(TemplateView));
    });

    describe('properties:', function() {
        describe('tag', function() {
            it('should be "li"', function() {
                expect(cardView.tag).toBe('li');
            });
        });

        describe('classes', function() {
            it('should be the usual TemplateView classes + "cards__item"', function() {
                expect(cardView.classes).toEqual(new TemplateView().classes.concat(['cards__item']));
            });
        });
    });

    describe('methods', function() {
        describe('show()', function() {
            beforeEach(function() {
                spyOn(cardView, 'removeClass').and.callThrough();

                cardView.show();
            });

            it('should remove the "ui--offscreen" class', function() {
                expect(cardView.removeClass).toHaveBeenCalledWith('ui--offscreen');
            });
        });

        describe('hide()', function() {
            beforeEach(function() {
                spyOn(cardView, 'addClass');

                cardView.hide();
            });

            it('should add the "ui--offscreen" class', function() {
                expect(cardView.addClass).toHaveBeenCalledWith('ui--offscreen');
            });
        });
    });
});
