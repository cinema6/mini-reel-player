import FullArticleCardView from '../../../../src/views/full/FullArticleCardView.js';
import ArticleCardView from '../../../../src/views/ArticleCardView.js';
import Runner from '../../../../lib/Runner.js';
import SkipTimerView from '../../../../src/views/SkipTimerView.js';

describe('FullArticleCardView', function() {
    let view;

    beforeEach(function() {
        view = new FullArticleCardView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(ArticleCardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of FullArticleCardView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/full/FullArticleCardView.html'));
            });
        });

        describe('child views', function() {
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

            it('should hide the skip timer', function() {
                expect(view.skipTimer.hide).toHaveBeenCalled();
            });
        });
    });
});
