import SwipePrerollCardView from '../../../../src/views/swipe/SwipePrerollCardView.js';
import CardView from '../../../../src/views/CardView.js';
import Runner from '../../../../lib/Runner.js';
import PlayerOutletView from '../../../../src/views/PlayerOutletView.js';
import TemplateView from '../../../../lib/core/TemplateView.js';
import SkipButtonView from '../../../../src/views/swipe/SkipButtonView.js';

describe('SwipePrerollCardView', function() {
    let view;

    beforeEach(function() {
        view = new SwipePrerollCardView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(CardView));
    });

    describe('properties:', function() {
        describe('tag', function() {
            it('should be "div"', function() {
                expect(view.tag).toBe('div');
            });
        });

        describe('classes', function() {
            it('should be TemplateView classes + "flyOver__group"', function() {
                expect(view.classes).toEqual(new TemplateView().classes.concat(['flyOver__group']));
            });
        });

        describe('template', function() {
            it('should be the contents of SwipePrerollCardView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/swipe/SwipePrerollCardView.html'));
            });
        });

        describe('child views:', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
            });

            describe('playerOutlet', function() {
                it('should be a PlayerOutletView', function() {
                    expect(view.playerOutlet).toEqual(jasmine.any(PlayerOutletView));
                });
            });

            describe('skipButton', function() {
                it('should be a SkipButtonView', function() {
                    expect(view.skipButton).toEqual(jasmine.any(SkipButtonView));
                });
            });
        });
    });
});
