import FullNPPlayerView from '../../../../src/views/full-np/FullNPPlayerView.js';
import PlayerView from '../../../../src/views/PlayerView.js';
import Runner from '../../../../lib/Runner.js';
import ResizableNavButtonView from '../../../../src/views/ResizableNavButtonView.js';
import LinksListView from '../../../../src/views/LinksListView.js';
import PlaylistPlayerView from '../../../../src/mixins/PlaylistPlayerView.js';
import ResizingPlayerView from '../../../../src/mixins/ResizingPlayerView.js';
import DeckView from '../../../../src/views/DeckView.js';
import View from '../../../../lib/core/View.js';

fdescribe('FullNPPlayerView', function() {
    let view;

    beforeEach(function() {
        view = new FullNPPlayerView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(PlayerView));
    });

    it('should mixin the PlaylistPlayerView and ResizingPlayerView', function() {
        expect(FullNPPlayerView.mixins).toContain(PlaylistPlayerView);
        expect(FullNPPlayerView.mixins).toContain(ResizingPlayerView);
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of FullNPPlayerView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/full-np/FullNPPlayerView.html'));
            });
        });

        describe('child views:', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
            });

            describe('nextButton', function() {
                it('should be a ResizableNavButtonView', function() {
                    expect(view.nextButton).toEqual(jasmine.any(ResizableNavButtonView));
                });
            });

            describe('previousButton', function() {
                it('should be a ResizableNavButtonView', function() {
                    expect(view.previousButton).toEqual(jasmine.any(ResizableNavButtonView));
                });
            });

            describe('nextButtons', function() {
                it('should contain the nextButton', function() {
                    expect(view.nextButtons).toEqual([view.nextButton]);
                });
            });

            describe('previousButtons', function() {
                it('should contain the previousButton', function() {
                    expect(view.previousButtons).toEqual([view.previousButton]);
                });
            });

            describe('navButtons', function() {
                it('should contain the nextButton and previousButton', function() {
                    expect(view.navItems).toEqual([view.nextButton, view.previousButton]);
                });
            });

            describe('cards', function() {
                it('should be a DeckView', function() {
                    expect(view.cards).toEqual(jasmine.any(DeckView));
                });
            });

            describe('prerollOutlet', function() {
                it('should be a DeckView', function() {
                    expect(view.prerollOutlet).toEqual(jasmine.any(DeckView));
                });
            });

            describe('links', function() {
                it('should be a LinksListView', function() {
                    expect(view.links).toEqual(jasmine.any(LinksListView));
                });
            });

            describe('pagerOutlet', function() {
                it('should be a View', function() {
                    expect(view.pagerOutlet).toEqual(jasmine.any(View));
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

            it('should enable navigation', function() {
                expect(view.enableNavigation).toHaveBeenCalled();
            });
        });
    });
});
