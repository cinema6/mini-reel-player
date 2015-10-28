import DesktopCardVideoCardView from '../../../../src/views/desktop-card/DesktopCardVideoCardView.js';
import VideoCardView from '../../../../src/views/VideoCardView.js';
import Runner from '../../../../lib/Runner.js';
import View from '../../../../lib/core/View.js';
import PlayerOutletView from '../../../../src/views/PlayerOutletView.js';
import LinkItemView from '../../../../src/views/LinkItemView.js';
import LinksListView from '../../../../src/views/LinksListView.js';
import ButtonView from '../../../../src/views/ButtonView.js';

describe('DesktopCardVideoCardView', function() {
    let view;

    beforeEach(function() {
        view = new DesktopCardVideoCardView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(VideoCardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of DesktopCardVideoCardView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/desktop-card/DesktopCardVideoCardView.html'));
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

            describe('shareOutlet', function() {
                it('should be a View', function() {
                    expect(view.shareOutlet).toEqual(jasmine.any(View));
                });
            });

            describe('playerOutlet', function() {
                it('should be a PlayerOutletView', function() {
                    expect(view.playerOutlet).toEqual(jasmine.any(PlayerOutletView));
                });
            });

            describe('logoView', function() {
                it('should be a LinkItemView', function() {
                    expect(view.logoView).toEqual(jasmine.any(LinkItemView));
                });
            });

            describe('links', function() {
                it('should be a LinksListView', function() {
                    expect(view.links).toEqual(jasmine.any(LinksListView));
                });
            });

            describe('shareButton', function() {
                it('should be a ButtonView', function() {
                    expect(view.shareButton).toEqual(jasmine.any(ButtonView));
                });
            });

            describe('ctaView', function() {
                it('should be a LinkItemView', function() {
                    expect(view.ctaView).toEqual(jasmine.any(LinkItemView));
                });
            });
        });
    });
});
