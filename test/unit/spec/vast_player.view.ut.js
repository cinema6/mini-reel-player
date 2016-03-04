import VASTPlayer from '../../../src/players/VASTPlayer.js';
import ThirdPartyPlayer from '../../../src/players/ThirdPartyPlayer.js';
import Runner from '../../../lib/Runner.js';
import Player from 'vast-player';
import {
    defer
} from '../../../lib/utils.js';
import completeUrl from '../../../src/fns/complete_url.js';
import PlayButtonView from '../../../src/views/PlayButtonView.js';

describe('VASTPlayer', function() {
    let player;
    let playButton;

    beforeEach(function() {
        spyOn(Player.prototype, 'load').and.callFake(function() { return Promise.resolve(this); });
        spyOn(PlayButtonView.prototype, 'hide');

        player = new VASTPlayer();
        playButton = PlayButtonView.prototype.hide.calls.mostRecent().object;
    });

    it('should exist', function() {
        expect(player).toEqual(jasmine.any(ThirdPartyPlayer));
    });

    it('should set the location of the Flash VPAID SWF', function() {
        expect(Player.vpaidSWFLocation).toBe('swf/vast-player--vpaid.swf');
    });

    it('should hide its play button', function() {
        expect(PlayButtonView.prototype.hide).toHaveBeenCalledWith();
    });

    describe('properties:', function() {
        describe('clickToPlay', function() {
            it('should be false', function() {
                expect(player.clickToPlay).toBe(false);
            });
        });

        describe('__api__', function() {
            describe('name', function() {
                it('should be VASTPlayer', function() {
                    expect(player.__api__.name).toBe('VASTPlayer');
                });
            });

            describe('autoplayTest', function() {
                it('should be false', function() {
                    expect(player.__api__.autoplayTest).toBe(false);
                });
            });

            describe('singleUse', function() {
                it('should be true', function() {
                    expect(player.__api__.singleUse).toBe(true);
                });
            });

            describe('loadPlayer()', function() {
                let success, failure;
                let src;
                let vastPlayer;
                let result;

                beforeEach(function() {
                    player.element = document.createElement('div');

                    success = jasmine.createSpy('success()');
                    failure = jasmine.createSpy('failure()');

                    src = 'https://platform-staging.reelcontent.com/api/public/vast/2.0/tag?campaign=cam-e951792a909f17';

                    result = player.__api__.loadPlayer(src);
                    result.then(success, failure);
                    vastPlayer = Player.prototype.load.calls.mostRecent().object;
                });

                it('should create a vast-player and load it', function() {
                    expect(Player.prototype.load).toHaveBeenCalledWith(src);

                    expect(vastPlayer.container).toBe(player.element);
                    expect(vastPlayer.config.tracking.mapper).toBe(completeUrl);

                    expect(result).toBe(vastPlayer.load.calls.mostRecent().returnValue);
                });

                describe('if loading the creative fails', function() {
                    beforeEach(function(done) {
                        player.emit('ended');
                        spyOn(player, 'unload');
                        Player.prototype.load.and.returnValue(Promise.reject('I FAILED'));

                        player.__api__.loadPlayer(src).then(done, done);
                    });

                    it('should call unload()', function() {
                        expect(player.unload).toHaveBeenCalled();
                    });

                    describe('when called again', function() {
                        beforeEach(function() {
                            Player.prototype.load.calls.reset();
                            Player.prototype.load.and.callFake(function() { return Promise.resolve(this); });

                            player.__api__.loadPlayer(src);
                        });

                        it('should load a new player', function() {
                            expect(Player.prototype.load).toHaveBeenCalledWith(src);
                        });
                    });
                });

                describe('if called again', function() {
                    beforeEach(function() {
                        Player.prototype.load.calls.reset();
                    });

                    describe('and the ad has finished', function() {
                        beforeEach(function() {
                            player.emit('ended');

                            result = player.__api__.loadPlayer(src);
                        });

                        it('should load a new player', function() {
                            expect(Player.prototype.load).toHaveBeenCalledWith(src);
                        });
                    });

                    describe('and the ad has not finished', function() {
                        beforeEach(function() {
                            result = player.__api__.loadPlayer(src);
                        });

                        it('should return the existing player', function() {
                            expect(result).toBe(vastPlayer);
                        });
                    });
                });
            });

            describe('onReady()', function() {
                let api;

                beforeEach(function() {
                    spyOn(player, '__setProperty__').and.callThrough();

                    api = { adRemainingTime: 33 };
                    player.__api__.onReady(api);
                });

                it('should set the duration', function() {
                    expect(player.__setProperty__).toHaveBeenCalledWith('duration', api.adRemainingTime);
                });
            });

            describe('pollingDelay', function() {
                it('should be 250', function() {
                    expect(player.__api__.pollingDelay).toBe(250);
                });
            });

            describe('onPoll()', function() {
                let api;

                beforeEach(function() {
                    api = { adRemainingTime: 33 };

                    spyOn(player, '__setProperty__').and.callThrough();
                });

                describe('before the duration is set', function() {
                    beforeEach(function() {
                        player.__api__.onPoll(api);
                    });

                    it('should do nothing', function() {
                        expect(player.__setProperty__).not.toHaveBeenCalled();
                    });
                });

                describe('after the duration is set', function() {
                    beforeEach(function() {
                        player.__api__.onReady(api);
                        player.__setProperty__.calls.reset();

                        api.adRemainingTime = 10;
                        player.__api__.onPoll(api);
                    });

                    it('should set the currentTime', function() {
                        expect(player.__setProperty__).toHaveBeenCalledWith('currentTime', 23);
                    });
                });
            });

            describe('methods', function() {
                let api;

                beforeEach(function() {
                    api = new Player(document.createElement('div'));
                });

                describe('play()', function() {
                    beforeEach(function() {
                        spyOn(api, 'startAd').and.returnValue(defer(Promise).promise);
                        spyOn(api, 'resumeAd').and.returnValue(defer(Promise).promise);

                        player.__api__.methods.play(api);
                    });

                    it('should call startAd()', function() {
                        expect(api.startAd).toHaveBeenCalledWith();
                        expect(api.resumeAd).not.toHaveBeenCalled();
                    });

                    describe('if called again', function() {
                        beforeEach(function() {
                            api.startAd.calls.reset();
                            api.resumeAd.calls.reset();

                            player.__api__.methods.play(api);
                        });

                        it('should call resumeAd()', function() {
                            expect(api.resumeAd).toHaveBeenCalledWith();
                            expect(api.startAd).not.toHaveBeenCalled();
                        });

                        describe('after the ad is loaded again', function() {
                            beforeEach(function() {
                                api.startAd.calls.reset();
                                api.resumeAd.calls.reset();

                                player.__api__.loadPlayer('foo');
                                player.__api__.methods.play(api);
                            });

                            it('should call startAd()', function() {
                                expect(api.startAd).toHaveBeenCalledWith();
                                expect(api.resumeAd).not.toHaveBeenCalled();
                            });
                        });
                    });
                });

                describe('pause()', function() {
                    beforeEach(function() {
                        spyOn(api, 'pauseAd').and.returnValue(Promise.resolve(api));
                        player.__api__.methods.play(api);

                        player.__api__.methods.pause(api);
                    });

                    it('should call pauseAd()', function() {
                        expect(api.pauseAd).toHaveBeenCalledWith();
                    });

                    describe('if the ad has not been started', function() {
                        beforeEach(function() {
                            api.pauseAd.calls.reset();
                            player.__api__.loadPlayer('foo');

                            expect(player.__api__.methods.pause(api)).toBeUndefined();
                        });

                        it('should not call pauseAd()', function() {
                            expect(api.pauseAd).not.toHaveBeenCalled();
                        });
                    });
                });

                describe('unload()', function() {
                    beforeEach(function() {
                        spyOn(api, 'stopAd').and.returnValue(defer(Promise).promise);
                        player.__api__.loadPlayer('foo');
                        player.__api__.methods.play(api);

                        player.__api__.methods.unload(api);
                    });

                    it('should call stopAd()', function() {
                        expect(api.stopAd).toHaveBeenCalledWith();
                    });

                    describe('if the ad has not been started', function() {
                        beforeEach(function() {
                            api.stopAd.calls.reset();
                            player.__api__.loadPlayer('foo');

                            expect(player.__api__.methods.unload(api)).toBeUndefined();
                        });

                        it('should not call stopAd()', function() {
                            expect(api.stopAd).not.toHaveBeenCalled();
                        });
                    });

                    describe('if the ad is already unloaded', function() {
                        beforeEach(function() {
                            api.stopAd.calls.reset();
                            player.__api__.loadPlayer('foo');
                            player.__api__.methods.play(api);
                            player.__api__.events.AdStopped(api);

                            expect(player.__api__.methods.unload(api)).toBeUndefined();
                        });

                        it('should not call stopAd()', function() {
                            expect(api.stopAd).not.toHaveBeenCalled();
                        });
                    });
                });

                describe('volume()', function() {
                    beforeEach(function() {
                        api = { adVolume: 1 };

                        player.__api__.methods.volume(api, 0.5);
                    });

                    it('should set the adVolume', function() {
                        expect(api.adVolume).toBe(0.5);
                    });
                });

                describe('addEventListener()', function() {
                    let AdStarted;
                    let result;

                    beforeEach(function() {
                        AdStarted = jasmine.createSpy('AdStarted()').and.callFake(() => Runner.schedule('render', null, () => {}));
                        spyOn(api, 'on').and.callThrough();

                        result = player.__api__.methods.addEventListener(api, 'AdStarted', AdStarted);
                    });

                    it('should a handler for the event', function() {
                        api.emit('AdStarted', 'foo', 'bar');
                        expect(AdStarted).toHaveBeenCalledWith(api, 'foo', 'bar');
                    });

                    it('should return the handler it creates', function() {
                        expect(result).toBe(api.on.calls.mostRecent().args[1]);
                    });
                });

                describe('removeEventListener()', function() {
                    let AdStarted;

                    beforeEach(function() {
                        AdStarted = jasmine.createSpy('AdStarted()').and.callFake(() => Runner.schedule('render', null, () => {}));
                        spyOn(api, 'on').and.callThrough();
                        player.__api__.methods.addEventListener(api, 'AdStarted', AdStarted);

                        player.__api__.methods.removeEventListener(api, 'AdStarted', api.on.calls.mostRecent().args[1]);
                    });

                    it('should stop listening for the event', function() {
                        api.emit('AdStarted');
                        expect(AdStarted).not.toHaveBeenCalled();
                    });
                });
            });

            describe('events', function() {
                let api;

                beforeEach(function() {
                    api = new Player(document.createElement('div'));
                    spyOn(player, '__setProperty__').and.callThrough();
                });

                describe('AdVideoStart', function() {
                    beforeEach(function() {
                        player.__api__.events.AdVideoStart(api);
                    });

                    it('should set ended and paused to false', function() {
                        expect(player.__setProperty__).toHaveBeenCalledWith('ended', false);
                        expect(player.__setProperty__).toHaveBeenCalledWith('paused', false);
                        expect(player.__setProperty__.calls.count()).toBe(2);
                    });
                });

                describe('AdPaused', function() {
                    beforeEach(function() {
                        player.__api__.events.AdPaused(api);
                    });

                    it('should set paused to true', function() {
                        expect(player.__setProperty__).toHaveBeenCalledWith('paused', true);
                        expect(player.__setProperty__.calls.count()).toBe(1);
                    });
                });

                describe('AdPlaying', function() {
                    beforeEach(function() {
                        player.__api__.events.AdPlaying(api);
                    });

                    it('should paused to false', function() {
                        expect(player.__setProperty__).toHaveBeenCalledWith('paused', false);
                        expect(player.__setProperty__.calls.count()).toBe(1);
                    });
                });

                describe('AdVideoComplete', function() {
                    beforeEach(function() {
                        player.__api__.events.AdVideoComplete(api);
                    });

                    it('should set paused and ended to true', function() {
                        expect(player.__setProperty__).toHaveBeenCalledWith('ended', true);
                        expect(player.__setProperty__).toHaveBeenCalledWith('paused', true);
                        expect(player.__setProperty__.calls.count()).toBe(2);
                    });
                });

                describe('AdStopped', function() {
                    beforeEach(function() {
                        player.__api__.events.AdStopped(api);
                    });

                    it('should set paused and ended to true', function() {
                        expect(player.__setProperty__).toHaveBeenCalledWith('ended', true);
                        expect(player.__setProperty__).toHaveBeenCalledWith('paused', true);
                        expect(player.__setProperty__.calls.count()).toBe(2);
                    });
                });

                describe('AdVolumeChange', function() {
                    beforeEach(function() {
                        api = { adVolume: 0.6 };
                        player.__api__.events.AdVolumeChange(api);
                    });

                    it('should set the volume', function() {
                        expect(player.__setProperty__).toHaveBeenCalledWith('volume', api.adVolume);
                        expect(player.__setProperty__.calls.count()).toBe(1);
                    });
                });

                describe('AdError', function() {
                    let message;

                    beforeEach(function() {
                        message = 'It went very wrong...';

                        player.__api__.events.AdError(api, message);
                    });

                    it('should set the error', function() {
                        expect(player.__setProperty__).toHaveBeenCalledWith('error', new Error(message));
                        expect(player.__setProperty__.calls.count()).toBe(1);
                    });
                });

                describe('error', function() {
                    let error;

                    beforeEach(function() {
                        error = new Error('It went very wrong...');

                        player.__api__.events.error(api, error);
                    });

                    it('should set the error', function() {
                        expect(player.__setProperty__).toHaveBeenCalledWith('error', error);
                        expect(player.__setProperty__.calls.count()).toBe(1);
                    });
                });
            });
        });
    });

    describe('events:', function() {
        describe('play', function() {
            beforeEach(function() {
                playButton.hide.calls.reset();

                player.emit('play');
            });

            it('should hide the play button', function() {
                expect(playButton.hide).toHaveBeenCalledWith();
            });
        });

        describe('pause', function() {
            beforeEach(function() {
                spyOn(playButton, 'show');

                player.emit('pause');
            });

            it('should show the play button', function() {
                expect(playButton.show).toHaveBeenCalledWith();
            });
        });

        describe('[play button]', function() {
            describe('press', function() {
                beforeEach(function() {
                    spyOn(player, 'play');

                    playButton.emit('press');
                });

                it('should play the video', function() {
                    expect(player.play).toHaveBeenCalledWith();
                });
            });
        });
    });

    describe('hooks:', function() {
        describe('didCreateElement()', function() {
            beforeEach(function() {
                spyOn(player, 'append').and.callThrough();
                spyOn(playButton, 'show');

                Runner.run(() => player.create());
            });

            it('should append a PlayButtonView to itself', function() {
                expect(player.append).toHaveBeenCalledWith(jasmine.any(PlayButtonView));
                expect(player.append).toHaveBeenCalledWith(playButton);
            });

            it('should not show the player button', function() {
                expect(playButton.show).not.toHaveBeenCalled();
            });

            describe('if clickToPlay is true', function() {
                beforeEach(function() {
                    player = new VASTPlayer();
                    playButton = PlayButtonView.prototype.hide.calls.mostRecent().object;
                    spyOn(playButton, 'show');

                    player.clickToPlay = true;
                    Runner.run(() => player.create());
                });

                it('should show the player button', function() {
                    expect(playButton.show).toHaveBeenCalled();
                });
            });
        });
    });
});
