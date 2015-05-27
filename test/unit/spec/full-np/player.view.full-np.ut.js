import FullNPPlayerView from '../../../../src/views/full-np/FullNPPlayerView.js';
import PlayerView from '../../../../src/views/PlayerView.js';
import Runner from '../../../../lib/Runner.js';
import LinksListView from '../../../../src/views/LinksListView.js';
import PlaylistPlayerView from '../../../../src/mixins/PlaylistPlayerView.js';
import ResizingPlayerView from '../../../../src/mixins/ResizingPlayerView.js';
import DeckView from '../../../../src/views/DeckView.js';
import View from '../../../../lib/core/View.js';

describe('FullNPPlayerView', function() {
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
