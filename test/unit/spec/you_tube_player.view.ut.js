import YouTubePlayer from '../../../src/players/YouTubePlayer.js';
import ThirdPartyPlayer from '../../../src/players/ThirdPartyPlayer.js';
import codeLoader from '../../../src/services/code_loader.js';
import Runner from '../../../lib/Runner.js';
import RunnerPromise from '../../../lib/RunnerPromise.js';
import {
    defer
} from '../../../lib/utils.js';
import { stringify } from 'querystring';

describe('YouTubePlayer', function() {
    let player, youtube;

    class MockYouTube {
        constructor() {
            this.getCurrentTime = jasmine.createSpy('Player.getCurrentTime()').and.returnValue(0);
            this.seekTo = jasmine.createSpy('Player.seekTo()');
            this.pauseVideo = jasmine.createSpy('Player.pauseVideo()');
            this.playVideo = jasmine.createSpy('Player.playVideo()');
            this.getDuration = jasmine.createSpy('Player.getDuration()').and.returnValue(0);
            this.setVolume = jasmine.createSpy('Player.setVolume()');
            this.getVolume = jasmine.createSpy('Player.getVolume()').and.returnValue(100);
        }
    }

    /* global beforeAll */
    beforeAll(function() {
        const deferred = defer(Promise);

        codeLoader.configure('youtube', {
            src: 'http://www.youtube.com/iframe_api',

            before() {
                global.onYouTubeIframeAPIReady = () => {
                    delete global.onYouTubeIframeAPIReady;
                    deferred.fulfill(global.YT);
                };
            },

            after() {
                return deferred.promise;
            }
        });
    });

    beforeEach(function(done) {
        Promise.resolve(codeLoader.load('youtube')).then(YT => {
            youtube = YT;
        }).then(done, done.fail);

        player = new YouTubePlayer();
    });

    it('should be a ThirdPartyPlayer', function() {
        expect(player).toEqual(jasmine.any(ThirdPartyPlayer));
    });

    describe('properties:', function() {
        describe('__api__', function() {
            describe('.name', function() {
                it('should be YouTubePlayer', function() {
                    expect(player.__api__.name).toBe('YouTubePlayer');
                });
            });

            describe('.pollingDelay', function() {
                it('should be 250', function() {
                    expect(player.__api__.pollingDelay).toBe(250);
                });
            });
        });
    });

    describe('methods:', function() {
        describe('__api__', function() {
            beforeEach(function() {
                spyOn(player, '__setProperty__').and.callThrough();

                Runner.run(() => player.create());
                document.body.appendChild(player.element);
            });

            afterEach(function() {
                document.body.removeChild(player.element);
            });

            describe('.loadPlayer(src)', function() {
                let src;
                let success, failure;
                let result;
                let iframe;

                let yt;

                beforeEach(function(done) {
                    src = 'WdhvxJZDqzU';

                    success = jasmine.createSpy('success()');
                    failure = jasmine.createSpy('failure()');

                    spyOn(document, 'createElement').and.callThrough();

                    yt = new MockYouTube();
                    spyOn(youtube, 'Player').and.returnValue(yt);

                    Runner.run(() => result = player.__api__.loadPlayer(src));
                    result.then(success, failure);

                    iframe = document.createElement.calls.mostRecent().returnValue;

                    process.nextTick(done);
                });

                it('should return a RunnerPromise', function() {
                    expect(result).toEqual(jasmine.any(RunnerPromise));
                });

                it('should create an <iframe> for the player', function() {
                    expect(document.createElement).toHaveBeenCalledWith('iframe');

                    const params = {
                        html5: 1,
                        wmode: 'opaque',
                        rel: 0,
                        enablejsapi: 1,
                        playsinline: 1,
                        controls: Number(player.controls)
                    };
                    expect(iframe.src).toBe(`https://www.youtube-nocookie.com/embed/${src}?${stringify(params)}`);
                });

                it('should put the <iframe> in the DOM', function() {
                    expect(player.element.contains(iframe)).toBe(true);
                });

                it('should create a YT.Player() for the <iframe>', function() {
                    expect(youtube.Player).toHaveBeenCalledWith(iframe, {
                        events: {
                            onReady: jasmine.any(Function),
                            onStateChange: jasmine.any(Function)
                        }
                    });
                });

                it('should not resolve', function() {
                    expect(success).not.toHaveBeenCalled();
                    expect(failure).not.toHaveBeenCalled();
                });

                describe('when the player is ready', function() {
                    beforeEach(function(done) {
                        youtube.Player.calls.mostRecent().args[1].events.onReady();

                        setTimeout(done, 0);
                    });

                    it('should fulfill with the player', function() {
                        expect(success).toHaveBeenCalledWith(yt);
                    });
                });

                describe('when the state changes', function() {
                    beforeEach(function() {
                        player.on('play', () => expect(() => Runner.schedule('render', null, () => {})).not.toThrow());
                        player.on('pause', () => expect(() => Runner.schedule('render', null, () => {})).not.toThrow());
                        player.on('ended', () => expect(() => Runner.schedule('render', null, () => {})).not.toThrow());
                    });

                    function stateChange(STATE) {
                        return youtube.Player.calls.mostRecent().args[1].events.onStateChange({ data: STATE });
                    }

                    describe('to PLAYING', function() {
                        beforeEach(function() {
                            stateChange(youtube.PlayerState.PLAYING);
                        });

                        it('should set paused to false', function() {
                            expect(player.__setProperty__).toHaveBeenCalledWith('paused', false);
                        });

                        it('should set ended to false', function() {
                            expect(player.__setProperty__).toHaveBeenCalledWith('ended', false);
                        });
                    });

                    describe('to PAUSED', function() {
                        beforeEach(function() {
                            stateChange(youtube.PlayerState.PAUSED);
                        });

                        it('should set paused to true', function() {
                            expect(player.__setProperty__).toHaveBeenCalledWith('paused', true);
                        });
                    });

                    describe('to ENDED', function() {
                        beforeEach(function() {
                            stateChange(youtube.PlayerState.ENDED);
                        });

                        it('should set ended to true', function() {
                            expect(player.__setProperty__).toHaveBeenCalledWith('ended', true);
                        });

                        it('should set paused to true', function() {
                            expect(player.__setProperty__).toHaveBeenCalledWith('paused', true);
                        });
                    });
                });
            });

            describe('.onReady(api)', function() {
                let api;

                beforeEach(function() {
                    api = new MockYouTube();
                    api.getDuration.and.returnValue(47);

                    Runner.run(() => player.create());
                    Runner.run(() => player.__api__.onReady(api));
                });

                it('should set the duration', function() {
                    expect(player.__setProperty__).toHaveBeenCalledWith('duration', api.getDuration());
                });
            });

            describe('.onPoll(api)', function() {
                let api;

                beforeEach(function() {
                    api = new MockYouTube();
                    api.getDuration.and.returnValue(33);
                    api.getCurrentTime.and.returnValue(21);
                    api.getVolume.and.returnValue(76);

                    Runner.run(() => player.create());
                    Runner.run(() => player.__api__.onPoll(api));
                });

                it('should set the currentTime', function() {
                    expect(player.__setProperty__).toHaveBeenCalledWith('currentTime', api.getCurrentTime());
                });

                it('should set the duration', function() {
                    expect(player.__setProperty__).toHaveBeenCalledWith('duration', api.getDuration());
                });

                it('should set the volume', function() {
                    expect(player.__setProperty__).toHaveBeenCalledWith('volume', api.getVolume() / 100);
                });
            });

            describe('.methods', function() {
                let api;

                beforeEach(function(done) {
                    api = new MockYouTube();
                    spyOn(youtube, 'Player').and.returnValue(api);

                    Runner.run(() => Promise.resolve(player.__api__.loadPlayer('748r934')).then(done, done.fail));

                    process.nextTick(() => youtube.Player.calls.mostRecent().args[1].events.onReady());
                });

                describe('.unload(api)', function() {
                    beforeEach(function() {
                        Runner.run(() => player.__api__.methods.unload(api));
                    });

                    it('should remove the <iframe> from the DOM', function() {
                        expect(player.element.querySelector('iframe')).toBeNull();
                    });
                });

                describe('.seek(api, time)', function() {
                    let time;

                    beforeEach(function() {
                        time = 33;

                        Runner.run(() => player.__api__.methods.seek(api, time));
                    });

                    it('should call seekTo()', function() {
                        expect(api.seekTo).toHaveBeenCalledWith(time);
                    });
                });

                describe('.volume(api, volume)', function() {
                    let volume;

                    beforeEach(function() {
                        volume = 0.77;

                        Runner.run(() => player.__api__.methods.volume(api, volume));
                    });

                    it('should call setVolume()', function() {
                        expect(api.setVolume).toHaveBeenCalledWith(volume * 100);
                    });
                });

                describe('.pause(api)', function() {
                    beforeEach(function() {
                        Runner.run(() => player.__api__.methods.pause(api));
                    });

                    it('should call pauseVideo()', function() {
                        expect(api.pauseVideo).toHaveBeenCalled();
                    });
                });

                describe('.play(api)', function() {
                    beforeEach(function() {
                        Runner.run(() => player.__api__.methods.play(api));
                    });

                    it('should call playVideo()', function() {
                        expect(api.playVideo).toHaveBeenCalled();
                    });
                });
            });
        });
    });
});
