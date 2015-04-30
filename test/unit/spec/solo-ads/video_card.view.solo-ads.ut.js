import SoloAdsVideoCardView from '../../../../src/views/solo-ads/SoloAdsVideoCardView.js';
import VideoCardView from '../../../../src/views/VideoCardView.js';
import Runner from '../../../../lib/Runner.js';
import TemplateView from '../../../../lib/core/TemplateView.js';
import View from '../../../../lib/core/View.js';
import PlayerOutletView from '../../../../src/views/PlayerOutletView.js';
import LinksListView from '../../../../src/views/LinksListView.js';

describe('SoloAdsVideoCardView', function() {
    let view;

    beforeEach(function() {
        view = new SoloAdsVideoCardView();
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
            it('should be the standard TemplateView classes', function() {
                expect(view.classes).toEqual(new TemplateView().classes);
            });
        });

        describe('template', function() {
            it('should be the contents of SoloAdsVideoCardView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/solo-ads/SoloAdsVideoCardView.html'));
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
        });
    });
});
