import LightTextCardView from '../../../../src/views/light/LightTextCardView.js';
import CardView from '../../../../src/views/CardView.js';
import ButtonView from '../../../../src/views/ButtonView.js';
import Runner from '../../../../lib/Runner.js';

describe('LightTextCardView', function() {
    let view;

    beforeEach(function() {
        view = new LightTextCardView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(CardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of LightTextCardView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/light/LightTextCardView.html'));
            });
        });

        describe('child views:', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
            });

            describe('beginButton', function() {
                it('should be a ButtonView', function() {
                    expect(view.beginButton).toEqual(jasmine.any(ButtonView));
                });
            });
        });
    });
});
