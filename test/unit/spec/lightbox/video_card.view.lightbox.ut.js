import LightboxVideoCardView from '../../../../src/views/lightbox/LightboxVideoCardView.js';
import VideoCardView from '../../../../src/views/VideoCardView.js';
import Runner from '../../../../lib/Runner.js';
import View from '../../../../lib/core/View.js';
import PlayerOutletView from '../../../../src/views/PlayerOutletView.js';
import LinksListView from '../../../../src/views/LinksListView.js';

describe('LightboxVideoCardView', function() {
    let view;

    beforeEach(function() {
        view = new LightboxVideoCardView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(VideoCardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of LightboxVideoCardView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/lightbox/LightboxVideoCardView.html'));
            });
        });

        describe('child views:', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
            });

            describe('postOutlet', function() {
                it('should be a View', function() {
                    expect(view.postOutlet).toEqual(jasmine.any(View));
                });
            });

            describe('playerOutlet', function() {
                it('should be a PlayerOutletView', function() {
                    expect(view.playerOutlet).toEqual(jasmine.any(PlayerOutletView));
                });
            });

            describe('links', function() {
                it('should be a LinksListView', function() {
                    expect(view.links).toEqual(jasmine.any(LinksListView));
                });
            });

            describe('displayAdOutlet', function() {
                it('should be a View', function() {
                    expect(view.displayAdOutlet).toEqual(jasmine.any(View));
                });
            });

            describe('ballotOutlet', function() {
                it('should be a View', function() {
                    expect(view.ballotOutlet).toEqual(jasmine.any(View));
                });
            });
        });
    });
});
