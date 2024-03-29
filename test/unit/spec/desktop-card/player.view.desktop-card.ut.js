import DesktopCardPlayerView from '../../../../src/views/desktop-card/DesktopCardPlayerView.js';
import TemplateView from '../../../../lib/core/TemplateView.js';
import Runner from '../../../../lib/Runner.js';
import View from '../../../../lib/core/View.js';
import ButtonView from '../../../../src/views/ButtonView.js';
import SkipTimerView from '../../../../src/views/SkipTimerView.js';

describe('DesktopCardPlayerView', function() {
    let view;

    beforeEach(function() {
        view = new DesktopCardPlayerView();
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

        describe('template', function() {
            it('should be the contents of DesktopCardPlayerView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/desktop-card/DesktopCardPlayerView.html'));
            });
        });

        describe('child views:', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
            });

            describe('cardOutlet', function() {
                it('should be a View', function() {
                    expect(view.cardOutlet).toEqual(jasmine.any(View));
                });
            });

            describe('skipButton', function() {
                it('should be a ButtonView', function() {
                    expect(view.skipButton).toEqual(jasmine.any(ButtonView));
                });
            });

            describe('skipTimer', function() {
                it('should be a SkipTimerView', function() {
                    expect(view.skipTimer).toEqual(jasmine.any(SkipTimerView));
                });
            });
        });
    });
});
