import MobileCardVideoCardView from '../../../../src/views/mobile-card/MobileCardVideoCardView.js';
import VideoCardView from '../../../../src/views/VideoCardView.js';
import Runner from '../../../../lib/Runner.js';
import View from '../../../../lib/core/View.js';
import PlayerOutletView from '../../../../src/views/PlayerOutletView.js';

describe('MobileCardVideoCardView', function() {
    let view;

    beforeEach(function() {
        view = new MobileCardVideoCardView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(VideoCardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of MobileCardVideoCardView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/mobile-card/MobileCardVideoCardView.html'));
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
        });
    });
});
