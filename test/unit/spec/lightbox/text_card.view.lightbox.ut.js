import LightboxTextCardView from '../../../../src/views/lightbox/LightboxTextCardView.js';
import CardView from '../../../../src/views/CardView.js';
import Runner from '../../../../lib/Runner.js';
import ButtonView from '../../../../src/views/ButtonView.js';

describe('LightboxTextCardView', function() {
    let view;

    beforeEach(function() {
        view = new LightboxTextCardView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(CardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of LightboxTextCardView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/lightbox/LightboxTextCardView.html'));
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

            describe('posterButton', function() {
                it('should be a ButtonView', function() {
                    expect(view.posterButton).toEqual(jasmine.any(ButtonView));
                });
            });
        });
    });
});
