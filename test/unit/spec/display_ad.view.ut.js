import DisplayAdView from '../../../src/views/DisplayAdView.js';
import View from '../../../lib/core/View.js';
import TemplateView from '../../../lib/core/TemplateView.js';
import Hidable from '../../../src/mixins/Hideable.js';
import Runner from '../../../lib/Runner.js';

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

    describe('methods:', function() {
        describe('populateWith(html)', function() {
            let html;

            beforeEach(function() {
                spyOn(view, 'create').and.callThrough();
                html = '<p>Hello world!</p>';

                Runner.run(() => view.populateWith(html));
            });

            it('should create the element', function() {
                expect(view.create).toHaveBeenCalled();
            });

            it('should set the innerHTML of the adContainer', function() {
                expect(view.adContainer.element.innerHTML).toBe(html);
            });

            describe('if called again', function() {
                beforeEach(function() {
                    view.create.calls.reset();
                    html = '<p>How is life?</p>';

                    Runner.run(() => view.populateWith(html));
                });

                it('should not create the element', function() {
                    expect(view.create).not.toHaveBeenCalled();
                });

                it('should set the adContainer\'s innerHTML', function() {
                    expect(view.adContainer.element.innerHTML).toBe(html);
                });
            });
        });
    });
});
