import LightPlayerView from '../../../../src/views/light/LightPlayerView.js';
import PlayerView from '../../../../src/views/PlayerView.js';
import Runner from '../../../../lib/Runner.js';
import View from '../../../../lib/core/View.js';
import LinksListView from '../../../../src/views/LinksListView.js';

describe('LightPlayerView', function() {
    let view;

    beforeEach(function() {
        view = new LightPlayerView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(PlayerView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of LightPlayerView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/light/LightPlayerView.html'));
            });
        });

        describe('child views:', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
            });

            describe('cards', function() {
                it('should be a View', function() {
                    expect(view.cards).toEqual(jasmine.any(View));
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
});
