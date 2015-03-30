import MobileVideoCardView from '../../../../src/views/mobile/MobileVideoCardView.js';
import VideoCardView from '../../../../src/views/VideoCardView.js';
import Runner from '../../../../lib/Runner.js';
import PlayerOutletView from '../../../../src/views/PlayerOutletView.js';
import View from '../../../../lib/core/View.js';
import LinksListView from '../../../../src/views/LinksListView.js';
import HideableView from '../../../../src/views/HideableView.js';
import ButtonView from '../../../../src/views/ButtonView.js';

describe('MobileVideoCardView', function() {
    let mobileVideoCardView;

    beforeEach(function() {
        mobileVideoCardView = new MobileVideoCardView();
    });

    it('should be a VideoCardView', function() {
        expect(mobileVideoCardView).toEqual(jasmine.any(VideoCardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be a MobileVideoCardView.html', function() {
                expect(mobileVideoCardView.template).toBe(require('../../../../src/views/mobile/MobileVideoCardView.html'));
            });
        });

        describe('playerOutlet', function() {
            beforeEach(function() {
                Runner.run(() => mobileVideoCardView.create());
            });

            it('should be a PlayerOutletView', function() {
                expect(mobileVideoCardView.playerOutlet).toEqual(jasmine.any(PlayerOutletView));
            });
        });

        describe('displayAdOutlet', function() {
            beforeEach(function() {
                Runner.run(() => mobileVideoCardView.create());
            });

            it('should be a view', function() {
                expect(mobileVideoCardView.displayAdOutlet).toEqual(jasmine.any(View));
            });
        });

        describe('postOutlet', function() {
            beforeEach(function() {
                Runner.run(() => mobileVideoCardView.create());
            });

            it('should be a view', function() {
                expect(mobileVideoCardView.postOutlet).toEqual(jasmine.any(View));
            });
        });

        describe('links', function() {
            beforeEach(function() {
                Runner.run(() => mobileVideoCardView.create());
            });

            it('should be a LinksListView', function() {
                expect(mobileVideoCardView.links).toEqual(jasmine.any(LinksListView));
            });
        });

        describe('replayContainer', function() {
            beforeEach(function() {
                spyOn(HideableView.prototype, 'hide');
                Runner.run(() => mobileVideoCardView.create());
            });

            it('should be a HideableView', function() {
                expect(mobileVideoCardView.replayContainer).toEqual(jasmine.any(HideableView));
            });

            it('should be hidden', function() {
                expect(mobileVideoCardView.replayContainer.hide).toHaveBeenCalled();
            });
        });

        describe('replayButton', function() {
            beforeEach(function() {
                Runner.run(() => mobileVideoCardView.create());
            });

            it('should be a ButtonView', function() {
                expect(mobileVideoCardView.replayButton).toEqual(jasmine.any(ButtonView));
            });
        });
    });

    describe('events:', function() {
        beforeEach(function() {
            spyOn(VideoCardView.prototype, 'addListeners');
            mobileVideoCardView.replayButton = new ButtonView();

            mobileVideoCardView.addListeners();
        });

        it('should add its parent\'s listeners', function() {
            expect(VideoCardView.prototype.addListeners).toHaveBeenCalled();
        });

        describe('replayButton', function() {
            describe('press', function() {
                let spy;

                beforeEach(function() {
                    spy = jasmine.createSpy('replay()');
                    mobileVideoCardView.on('replay', spy);

                    mobileVideoCardView.replayButton.emit('press');
                });

                it('should emit the replay event', function() {
                    expect(spy).toHaveBeenCalled();
                });
            });
        });
    });
});
