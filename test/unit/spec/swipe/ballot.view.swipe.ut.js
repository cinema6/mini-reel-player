import SwipeBallotView from '../../../../src/views/swipe/SwipeBallotView.js';
import TemplateView from '../../../../lib/core/TemplateView.js';
import Runner from '../../../../lib/Runner.js';
import ButtonView from '../../../../src/views/ButtonView.js';

fdescribe('SwipeBallotView', function() {
    let view;

    beforeEach(function() {
        view = new SwipeBallotView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(TemplateView));
    });

    describe('properties:', function() {
        describe('tag', function() {
            it('should be "div"', function() {
                expect(view.tag).toBe('div');
            });
        });

        describe('classes', function() {
            it('should be the usual TemplateView classes + "card__question"', function() {
                expect(view.classes).toEqual(new TemplateView().classes.concat(['card__question']));
            });
        });

        describe('template', function() {
            it('should be the contents of SwipeBallotView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/swipe/SwipeBallotView.html'));
            });
        });

        describe('child views:', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
            });

            describe('choice1Button', function() {
                it('should be a ButtonView', function() {
                    expect(view.choice1Button).toEqual(jasmine.any(ButtonView));
                });
            });

            describe('choice2Button', function() {
                it('should be a ButtonView', function() {
                    expect(view.choice2Button).toEqual(jasmine.any(ButtonView));
                });
            });

            describe('returnButton', function() {
                it('should be a ButtonView', function() {
                    expect(view.returnButton).toEqual(jasmine.any(ButtonView));
                });
            });
        });
    });

    describe('methods:', function() {
        describe('show()', function() {
            beforeEach(function() {
                spyOn(view, 'addClass');

                view.show();
            });

            it('should add the class "card__question--show"', function() {
                expect(view.addClass).toHaveBeenCalledWith('card__question--show');
            });
        });

        describe('hide()', function() {
            beforeEach(function() {
                spyOn(view, 'removeClass');

                view.hide();
            });

            it('should remove the class "card__question--show"', function() {
                expect(view.removeClass).toHaveBeenCalledWith('card__question--show');
            });
        });
    });
});
