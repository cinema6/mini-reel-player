import FullVideoCardView from '../../../../src/views/full/FullVideoCardView.js';
import VideoCardView from '../../../../src/views/VideoCardView.js';
import LinksListView from '../../../../src/views/LinksListView.js';
import Runner from '../../../../lib/Runner.js';
import PlayerOutletView from '../../../../src/views/PlayerOutletView.js';
import SkipTimerView from '../../../../src/views/SkipTimerView.js';

describe('FullVideoCardView', function() {
    let view;

    beforeEach(function() {
        view = new FullVideoCardView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(VideoCardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of FullVideoCardView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/full/FullVideoCardView.html'));
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
