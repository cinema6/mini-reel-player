import SwipeVideoCardView from '../../../../src/views/swipe/SwipeVideoCardView.js';
import VideoCardView from '../../../../src/views/VideoCardView.js';
import Runner from '../../../../lib/Runner.js';
import PlayerOutletView from '../../../../src/views/PlayerOutletView.js';
import LinksListView from '../../../../src/views/LinksListView.js';
import View from '../../../../lib/core/View.js';

describe('SwipeVideoCardView', function() {
    let view;

    beforeEach(function() {
        view = new SwipeVideoCardView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(VideoCardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of SwipeVideoCardView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/swipe/SwipeVideoCardView.html'));
            });
        });

        describe('flipped', function() {
            it('should be false', function() {
                expect(view.flipped).toBe(false);
            });
        });

        describe('child views:', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
            });

            describe('playerOutlet', function() {
                it('should be PlayerOutletView', function() {
                    expect(view.playerOutlet).toEqual(jasmine.any(PlayerOutletView));
                });
            });

            describe('postOutlet', function() {
                it('should be a view', function() {
                    expect(view.postOutlet).toEqual(jasmine.any(View));
                });
            });

            describe('ballotOutlet', function() {
                it('should be a view', function() {
                    expect(view.ballotOutlet).toEqual(jasmine.any(View));
                });
            });

            describe('links', function() {
                it('should be a LinksListView', function() {
                    expect(view.links).toEqual(jasmine.any(LinksListView));
                });
            });
        });
    });

    describe('flip(yes)', function() {
        let flip, unflip;

        beforeEach(function() {
            flip = jasmine.createSpy('flip()');
            view.on('flip', flip);

            unflip = jasmine.createSpy('unflip()');
            view.on('unflip', unflip);

            spyOn(view, 'update');
        });

        describe('if called with true', function() {
            beforeEach(function() {
                view.flipped = false;
                view.flip(true);
            });

            it('should update() the view with flipped: true', function() {
                expect(view.update).toHaveBeenCalledWith({
                    flipped: true
                });
            });

            it('should set flipped to true', function() {
                expect(view.flipped).toBe(true);
            });

            it('should emit "flip"', function() {
                expect(flip).toHaveBeenCalled();
                expect(unflip).not.toHaveBeenCalled();
            });

            describe('a second time', function() {
                beforeEach(function() {
                    flip.calls.reset();
                    view.update.calls.reset();

                    view.flip(true);
                });

                it('should do nothing', function() {
                    expect(view.update).not.toHaveBeenCalled();
                    expect(flip).not.toHaveBeenCalled();
                });
            });
        });

        describe('if called with false', function() {
            beforeEach(function() {
                view.flipped = true;
                view.flip(false);
            });

            it('should update() the view with flipped: false', function() {
                expect(view.update).toHaveBeenCalledWith({
                    flipped: false
                });
            });

            it('should set flipped to false', function() {
                expect(view.flipped).toBe(false);
            });

            it('should emit "unflip"', function() {
                expect(unflip).toHaveBeenCalled();
                expect(flip).not.toHaveBeenCalled();
            });

            describe('a second time', function() {
                beforeEach(function() {
                    unflip.calls.reset();
                    view.update.calls.reset();

                    view.flip(false);
                });

                it('should do nothing', function() {
                    expect(view.update).not.toHaveBeenCalled();
                    expect(unflip).not.toHaveBeenCalled();
                });
            });
        });
    });
});
