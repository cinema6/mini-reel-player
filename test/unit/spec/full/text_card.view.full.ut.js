import FullTextCardView from '../../../../src/views/full/FullTextCardView.js';
import CardView from '../../../../src/views/CardView.js';
import Runner from '../../../../lib/Runner.js';
import ButtonView from '../../../../src/views/ButtonView.js';

describe('FullTextCardView', function() {
    let view;

    beforeEach(function() {
        view = new FullTextCardView();
    });

    it('should be a CardView', function() {
        expect(view).toEqual(jasmine.any(CardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of FullTextCardView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/full/FullTextCardView.html'));
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

    describe('events:', function() {
        beforeEach(function() {
            Runner.run(() => view.create());
        });

        describe('startButton', function() {
            describe('press', function() {
                let advance;

                beforeEach(function() {
                    advance = jasmine.createSpy('advance()');
                    view.on('advance', advance);

                    view.startButton.emit('press');
                });

                it('should emit "advance"', function() {
                    expect(advance).toHaveBeenCalled();
                });
            });
        });
    });
});
