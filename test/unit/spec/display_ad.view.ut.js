import DisplayAdView from '../../../src/views/DisplayAdView.js';
import View from '../../../lib/core/View.js';
import TemplateView from '../../../lib/core/TemplateView.js';
import Hidable from '../../../src/mixins/Hideable.js';

describe('DisplayAdView', function() {
    let view;

    beforeEach(function() {
        view = new DisplayAdView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(TemplateView));
    });

    it('should mixin Hidable', function() {
        expect(DisplayAdView.mixins).toContain(Hidable);
    });

    describe('properties:', function() {
        describe('tag', function() {
            it('should be "div"', function() {
                expect(view.tag).toBe('div');
            });
        });

        describe('classes', function() {
            it('should be the normal TemplateView classes plus "companionAd__group"', function() {
                expect(view.classes).toEqual(new TemplateView().classes.concat(['companionAd__group']));
            });
        });

        describe('template', function() {
            it('should be the contents of DisplayAdView.html', function() {
                expect(view.template).toEqual(require('../../../src/views/DisplayAdView.html'));
            });
        });

        describe('adContainer', function() {
            beforeEach(function() {
                view.create();
            });

            it('should be a view', function() {
                expect(view.adContainer).toEqual(jasmine.any(View));
            });
        });
    });
});
