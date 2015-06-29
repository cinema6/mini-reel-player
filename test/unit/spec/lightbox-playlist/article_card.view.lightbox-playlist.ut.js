import LightboxPlaylistArticleCardView from '../../../../src/views/lightbox-playlist/LightboxPlaylistArticleCardView.js';
import CardView from '../../../../src/views/CardView.js';
import Runner from '../../../../lib/Runner.js';
import SkipTimerView from '../../../../src/views/SkipTimerView.js';

describe('LightboxPlaylistVideoCardView', function() {
    let view;

    beforeEach(function() {
        view = new LightboxPlaylistArticleCardView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(CardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of LightboxPlaylistArticleCardView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/lightbox-playlist/LightboxPlaylistArticleCardView.html'));
            });
        });

        describe('child views:', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
            });

            describe('skipTimer', function() {
                it('should be a SkipTimerView', function() {
                    expect(view.skipTimer).toEqual(jasmine.any(SkipTimerView));
                });
            });
        });
    });

    describe('hooks:', function() {
        describe('didCreateElement()', function() {
            beforeEach(function() {
                spyOn(SkipTimerView.prototype, 'hide');
                Runner.run(() => view.create());
            });

            it('should hide the skipTimer', function() {
                expect(view.skipTimer.hide).toHaveBeenCalled();
            });
        });
    });
});
