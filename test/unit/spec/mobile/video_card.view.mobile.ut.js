import MobileVideoCardView from '../../../../src/views/mobile/MobileVideoCardView.js';
import VideoCardView from '../../../../src/views/VideoCardView.js';
import Runner from '../../../../lib/Runner.js';
import PlayerOutletView from '../../../../src/views/PlayerOutletView.js';
import View from '../../../../lib/core/View.js';
import LinksListView from '../../../../src/views/LinksListView.js';
import HideableView from '../../../../src/views/HideableView.js';
import ButtonView from '../../../../src/views/ButtonView.js';
import LinkItemView from '../../../../src/views/LinkItemView.js';

describe('MobileVideoCardView', function() {
    let view;

    beforeEach(function() {
        view = new MobileVideoCardView();
    });

    it('should be a VideoCardView', function() {
        expect(view).toEqual(jasmine.any(VideoCardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be a MobileVideoCardView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/mobile/MobileVideoCardView.html'));
            });
        });

        describe('child views:', function() {
            beforeEach(function() {
                spyOn(HideableView.prototype, 'hide');
                Runner.run(() => view.create());
            });

            describe('playerOutlet', function() {
                it('should be a PlayerOutletView', function() {
                    expect(view.playerOutlet).toEqual(jasmine.any(PlayerOutletView));
                });
            });

            describe('displayAdOutlet', function() {
                it('should be a view', function() {
                    expect(view.displayAdOutlet).toEqual(jasmine.any(View));
                });
            });

            describe('postOutlet', function() {
                it('should be a view', function() {
                    expect(view.postOutlet).toEqual(jasmine.any(View));
                });
            });

            describe('links', function() {
                it('should be a LinksListView', function() {
                    expect(view.links).toEqual(jasmine.any(LinksListView));
                });
            });

            describe('replayContainer', function() {
                it('should be a HideableView', function() {
                    expect(view.replayContainer).toEqual(jasmine.any(HideableView));
                });

                it('should be hidden', function() {
                    expect(view.replayContainer.hide).toHaveBeenCalled();
                });
            });

            describe('replayButton', function() {
                it('should be a ButtonView', function() {
                    expect(view.replayButton).toEqual(jasmine.any(ButtonView));
                });
            });

            describe('ballotOutlet', function() {
                it('should be a View', function() {
                    expect(view.ballotOutlet).toEqual(jasmine.any(View));
                });
            });

            describe('ballotResultsOutlet', function() {
                it('should be a View', function() {
                    expect(view.ballotResultsOutlet).toEqual(jasmine.any(View));
                });
            });

            describe('websiteView', function() {
                it('should be a LinkItemView', function() {
                    expect(view.websiteView).toEqual(jasmine.any(LinkItemView));
                });
            });

            describe('landscapeWebsiteView', function() {
                it('should be a LinkItemView', function() {
                    expect(view.landscapeWebsiteView).toEqual(jasmine.any(LinkItemView));
                });
            });

            describe('logoView', function() {
                it('should be a LinkItemView', function() {
                    expect(view.logoView).toEqual(jasmine.any(LinkItemView));
                });
            });

            describe('landscapeLogoView', function() {
                it('should be a LinkItemView', function() {
                    expect(view.landscapeLogoView).toEqual(jasmine.any(LinkItemView));
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

            describe('shareButton', function() {
                it('should be a ButtonView', function() {
                    expect(view.shareButton).toEqual(jasmine.any(ButtonView));
                });
            });

            describe('landscapeShareButton', function() {
                it('should be a ButtonView', function() {
                    expect(view.landscapeShareButton).toEqual(jasmine.any(ButtonView));
                });
            });
        });
    });
});
