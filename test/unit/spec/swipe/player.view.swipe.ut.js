import SwipePlayerView from '../../../../src/views/swipe/SwipePlayerView.js';
import PlayerView from '../../../../src/views/PlayerView.js';
import Runner from '../../../../lib/Runner.js';
import ButtonView from '../../../../src/views/ButtonView.js';
import SkipProgressTimerView from '../../../../src/views/swipe/SkipProgressTimerView.js';
import LinksListView from '../../../../src/views/LinksListView.js';
import View from '../../../../lib/core/View.js';
import CardPannerView from '../../../../src/views/swipe/CardPannerView.js';

describe('SwipePlayerView', function() {
    let view;

    beforeEach(function() {
        view = new SwipePlayerView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(PlayerView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of SwipePlayerView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/swipe/SwipePlayerView.html'));
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

            describe('infoButton', function() {
                it('should be a ButtonView', function() {
                    expect(view.infoButton).toEqual(jasmine.any(ButtonView));
                });
            });

            describe('closeButton', function() {
                it('should be a ButtonView', function() {
                    expect(view.closeButton).toEqual(jasmine.any(ButtonView));
                });
            });

            describe('prerollOutlet', function() {
                it('should be a View', function() {
                    expect(view.prerollOutlet).toEqual(jasmine.any(View));
                });
            });

            describe('cards', function() {
                it('should be a CardPannerView', function() {
                    expect(view.cards).toEqual(jasmine.any(CardPannerView));
                });
            });

            describe('infoOutlet', function() {
                it('should be a View', function() {
                    expect(view.infoOutlet).toEqual(jasmine.any(View));
                });
            });

            describe('previousButton', function() {
                it('should be a ButtonView', function() {
                    expect(view.previousButton).toEqual(jasmine.any(ButtonView));
                });
            });

            describe('flipButton', function() {
                it('should be a ButtonView', function() {
                    expect(view.flipButton).toEqual(jasmine.any(ButtonView));
                });
            });

            describe('nextButton', function() {
                it('should be a ButtonView', function() {
                    expect(view.nextButton).toEqual(jasmine.any(ButtonView));
                });
            });

            describe('skipTimer', function() {
                it('should be a SkipProgressTimerView', function() {
                    expect(view.skipTimer).toEqual(jasmine.any(SkipProgressTimerView));
                });
            });
        });
    });
});
