import SoloPlayerView from '../../../../src/views/solo/SoloPlayerView.js';
import PlayerView from '../../../../src/views/PlayerView.js';
import Runner from '../../../../lib/Runner.js';
import LinksListView from '../../../../src/views/LinksListView.js';
import DeckView from '../../../../src/views/DeckView.js';

describe('SoloPlayerView', function() {
    let view;

    beforeEach(function() {
        Runner.run(() => view = new SoloPlayerView());
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(PlayerView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of SoloPlayerView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/solo/SoloPlayerView.html'));
            });
        });

        describe('links', function() {
            it('should be a LinksListView', function() {
                expect(view.links).toEqual(jasmine.any(LinksListView));
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
        });
    });
});
