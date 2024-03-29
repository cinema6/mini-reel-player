import FullNPVideoCardView from '../../../../src/views/full-np/FullNPVideoCardView.js';
import VideoCardView from '../../../../src/views/VideoCardView.js';
import LinksListView from '../../../../src/views/LinksListView.js';
import Runner from '../../../../lib/Runner.js';
import PlayerOutletView from '../../../../src/views/PlayerOutletView.js';
import SkipTimerView from '../../../../src/views/SkipTimerView.js';
import View from '../../../../lib/core/View.js';
import LinkItemView from '../../../../src/views/LinkItemView.js';

describe('FullNPVideoCardView', function() {
    let view;

    beforeEach(function() {
        view = new FullNPVideoCardView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(VideoCardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of FullNPVideoCardView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/full-np/FullNPVideoCardView.html'));
            });
        });

        describe('child views', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
            });

            describe('links', function() {
                it('should be a LinksListView', function() {
                    expect(view.links).toEqual(jasmine.any(LinksListView));
                });
            });

            describe('playerOutlet', function() {
                it('should be a PlayerOutletView', function() {
                    expect(view.playerOutlet).toEqual(jasmine.any(PlayerOutletView));
                });
            });

            describe('skipTimer', function() {
                it('should be a SkipTimerView', function() {
                    expect(view.skipTimer).toEqual(jasmine.any(SkipTimerView));
                });
            });

            describe('postOutlet', function() {
                it('should be a View', function() {
                    expect(view.postOutlet).toEqual(jasmine.any(View));
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
        });
    });

    describe('hooks:', function() {
        describe('didCreateElement()', function() {
            beforeEach(function() {
                spyOn(SkipTimerView.prototype, 'hide');

                Runner.run(() => view.create());
            });

            it('should hide the skip timer', function() {
                expect(view.skipTimer.hide).toHaveBeenCalled();
            });
        });
    });
});
