import LightboxPlaylistPlayerView from '../../../../src/views/lightbox-playlist/LightboxPlaylistPlayerView.js';
import PlayerView from '../../../../src/views/PlayerView.js';
import Runner from '../../../../lib/Runner.js';
import View from '../../../../lib/core/View.js';
import ButtonView from '../../../../src/views/ButtonView.js';
import LinksListView from '../../../../src/views/LinksListView.js';
import PlaylistPlayerView from '../../../../src/mixins/PlaylistPlayerView.js';
import LightboxNavButtonView from '../../../../src/views/LightboxNavButtonView.js';
import ResizingPlayerView from '../../../../src/mixins/ResizingPlayerView.js';
import DeckView from '../../../../src/views/DeckView.js';

describe('LightboxPlaylistPlayerView', function() {
    let view;

    beforeEach(function() {
        view = new LightboxPlaylistPlayerView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(PlayerView));
    });

    it('should mixin the PlaylistPlayerView and ResizingPlayerView', function() {
        expect(LightboxPlaylistPlayerView.mixins).toContain(PlaylistPlayerView);
        expect(LightboxPlaylistPlayerView.mixins).toContain(ResizingPlayerView);
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of LightboxPlaylistPlayerView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/lightbox-playlist/LightboxPlaylistPlayerView.html'));
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

            describe('closeButton', function() {
                it('should be a ButtonView', function() {
                    expect(view.closeButton).toEqual(jasmine.any(ButtonView));
                });
            });

            describe('playlistOutlet', function() {
                it('should be a View', function() {
                    expect(view.playlistOutlet).toEqual(jasmine.any(View));
                });
            });

            describe('displayAdOutlet', function() {
                it('should be a View', function() {
                    expect(view.displayAdOutlet).toEqual(jasmine.any(View));
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

            it('should add the nextButton to the nextButtons array', function() {
                expect(view.nextButtons).toContain(view.nextButton);
            });

            it('should add the previousButton to the previousButtons array', function() {
                expect(view.previousButtons).toContain(view.previousButton);
            });

            it('should add the next and previous buttons to the navItems array', function() {
                expect(view.navItems).toContain(view.nextButton);
                expect(view.navItems).toContain(view.previousButton);
            });

            it('should add the close button to the closeButtons array', function() {
                expect(view.closeButtons).toContain(view.closeButton);
            });

            it('should call enableNavigation()', function() {
                expect(view.enableNavigation).toHaveBeenCalled();
            });
        });
    });
});
