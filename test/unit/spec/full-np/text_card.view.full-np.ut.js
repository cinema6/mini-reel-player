import FullNPTextCardView from '../../../../src/views/full-np/FullNPTextCardView.js';
import CardView from '../../../../src/views/CardView.js';
import Runner from '../../../../lib/Runner.js';
import ButtonView from '../../../../src/views/ButtonView.js';

describe('FullNPTextCardView', function() {
    let view;

    beforeEach(function() {
        view = new FullNPTextCardView();
    });

    it('should be a CardView', function() {
        expect(view).toEqual(jasmine.any(CardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of FullNPTextCardView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/full-np/FullNPTextCardView.html'));
            });
        });

        describe('child views:', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
            });

            describe('startButton', function() {
                it('should be a ButtonView', function() {
                    expect(view.startButton).toEqual(jasmine.any(ButtonView));
                });
            });
        });
    });
});
