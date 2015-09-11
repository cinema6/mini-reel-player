import SoloVideoCardView from '../../../../src/views/solo/SoloVideoCardView.js';
import VideoCardView from '../../../../src/views/VideoCardView.js';
import TemplateView from '../../../../lib/core/TemplateView.js';
import Runner from '../../../../lib/Runner.js';
import View from '../../../../lib/core/View.js';
import PlayerOutletView from '../../../../src/views/PlayerOutletView.js';
import LinksListView from '../../../../src/views/LinksListView.js';
import LinkItemView from '../../../../src/views/LinkItemView.js';

describe('SoloVideoCardView', function() {
    let view;

    beforeEach(function() {
        view = new SoloVideoCardView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(VideoCardView));
    });

    describe('properties:', function() {
        describe('tag', function() {
            it('should be "div"', function() {
                expect(view.tag).toBe('div');
            });
        });

        describe('classes', function() {
            it('should be just the plain TemplateView classes', function() {
                expect(view.classes).toEqual(new TemplateView().classes);
            });
        });

        describe('template', function() {
            it('should be the contents of SoloVideoCardView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/solo/SoloVideoCardView.html'));
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

            describe('websiteView', function() {
                it('should be a LinkItemView', function() {
                    expect(view.websiteView).toEqual(jasmine.any(LinkItemView));
                });
            });

            describe('logoView', function() {
                it('should be a LinkItemView', function() {
                    expect(view.logoView).toEqual(jasmine.any(LinkItemView));
                });
            });

            describe('ctaButtonView', function() {
                it('should be a LinkItemView', function() {
                    expect(view.ctaButtonView).toEqual(jasmine.any(LinkItemView));
                });
            });

            describe('ctaTextView', function() {
                it('should be a LinkItemView', function() {
                    expect(view.ctaTextView).toEqual(jasmine.any(LinkItemView));
                });
            });

            describe('footerWebsiteView', function() {
                it('should be a LinkItemView', function() {
                    expect(view.footerWebsiteView).toEqual(jasmine.any(LinkItemView));
                });
            });
        });
    });
});
