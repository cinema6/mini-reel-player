import LightboxPlayerView from '../../../../src/views/lightbox/LightboxPlayerView.js';
import PlayerView from '../../../../src/views/PlayerView.js';
import Runner from '../../../../lib/Runner.js';
import ButtonView from '../../../../src/views/ButtonView.js';
import View from '../../../../lib/core/View.js';
import LightboxNavButtonView from '../../../../src/views/LightboxNavButtonView.js';
import LinksListView from '../../../../src/views/LinksListView.js';

describe('LightboxPlayerView', function() {
    let view;

    beforeEach(function() {
        view = new LightboxPlayerView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(PlayerView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of LightboxPlayerView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/lightbox/LightboxPlayerView.html'));
            });
        });

        describe('child views:', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
            });

            describe('closeButton', function() {
                it('should be a ButtonView', function() {
                    expect(view.closeButton).toEqual(jasmine.any(ButtonView));
                });
            });

            describe('cards', function() {
                it('should be a View', function() {
                    expect(view.cards).toEqual(jasmine.any(View));
                });
            });

            describe('previousButton', function() {
                it('should be a LightboxNavButtonView', function() {
                    expect(view.previousButton).toEqual(jasmine.any(LightboxNavButtonView));
                });
            });

            describe('nextButton', function() {
                it('should be a LightboxNavButtonView', function() {
                    expect(view.nextButton).toEqual(jasmine.any(LightboxNavButtonView));
                });
            });

            describe('pagerOutlet', function() {
                it('should be a View', function() {
                    expect(view.pagerOutlet).toEqual(jasmine.any(View));
                });
            });

            describe('links', function() {
                it('should be a LinksListView', function() {
                    expect(view.links).toEqual(jasmine.any(LinksListView));
                });
            });
        });
    });

    describe('hooks:', function() {
        describe('didCreateElement()', function() {
            beforeEach(function() {
                spyOn(view, 'enableNavigation');

                Runner.run(() => view.create());
            });

            it('should populate the closeButtons array', function() {
                expect(view.closeButtons).toContain(view.closeButton);
            });

            it('should populate the nextButtons array', function() {
                expect(view.nextButtons).toContain(view.nextButton);
            });

            it('should populate the previousButtons array', function() {
                expect(view.previousButtons).toContain(view.previousButton);
            });

            it('should populate the navItems array', function() {
                expect(view.navItems).toContain(view.nextButton);
                expect(view.navItems).toContain(view.previousButton);
            });

            it('should enableNavigation()', function() {
                expect(view.enableNavigation).toHaveBeenCalled();
            });
        });
    });
});
