describe('YouTubePlayer', function() {
    import YouTubePlayer from '../../../src/players/YouTubePlayer.js';
    import CorePlayer from '../../../src/players/CorePlayer.js';
    import PlayerInterface from '../../../src/interfaces/PlayerInterface.js';
    import codeLoader from '../../../src/services/code_loader.js';
    import fetcher from '../../../lib/fetcher.js';
    import browser from '../../../src/services/browser.js';
    import Runner from '../../../lib/Runner.js';
    import RunnerPromise from '../../../lib/RunnerPromise.js';
    import {
        defer
    } from '../../../lib/utils.js';
    let player, youtube;
    const intervals = [];

    /* global beforeAll */
    beforeAll(function() {
        const deferred = defer(Promise);

        codeLoader.configure('youtube', {
            src: 'https://www.youtube.com/iframe_api',

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
        const setInterval = global.setInterval;

        fetcher.constructor();
        codeLoader.load('youtube').then(YT => {
            youtube = YT;
            done();
        }, done);
        player = new YouTubePlayer();

        spyOn(global, 'setInterval').and.callFake(() => {
            return intervals[intervals.push(setInterval.call(global, ...arguments)) - 1];
        });
    });

    afterEach(function() {
        let interval;

        while (interval = intervals.shift()) {
            global.clearInterval(interval);
        }
    });

    it('should be a CorePlayer', function() {
        expect(player).toEqual(jasmine.any(CorePlayer));
    });

    it('should implement the PlayerInterface', function() {
        expect(player).toImplement(PlayerInterface);
    });

    describe('properties:', function() {
        describe('tag', function() {
            it('should be div', function() {
                expect(player.tag).toBe('div');
            });
        });

        describe('readyState', function() {
            it('should be 0', function() {
                expect(player.readyState).toBe(0);
            });
        });

        describe('currentTime', function() {
            it('should be 0', function() {
                expect(player.currentTime).toBe(0);
            });

            describe('setting', function() {
                describe('before the player is ready', function() {
                    beforeEach(function() {
                        player.currentTime = 3;
                    });

                    it('should set the currentTime', function() {
                        expect(player.currentTime).toBe(3);
                    });
                });

                describe('after the player is ready', function() {
                    let ytPlayer;

                    beforeEach(function(done) {
                        ytPlayer = {
                            seekTo: jasmine.createSpy('Player.seekTo()')
                        };
                        spyOn(youtube, 'Player').and.returnValue(ytPlayer);

                        fetcher.expect('GET', 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=VSL0vtRrTYk&key=AIzaSyBYOutFJ1yBx8MAYy5OgtTvslvBiFk8wok')
                            /* jshint quotmark:double */
                            .respond(200, {
                                "kind": "youtube#videoListResponse",
                                "etag": "\"9Y5jTkxN1JET3y-M4wKMA5aK7Mk/sIFI89DqvelExXrnNpMtej8AGvc\"",
                                "pageInfo": {
                                    "totalResults": 1,
                                    "resultsPerPage": 1
                                },
                                "items": [
                                    {
                                        "kind": "youtube#video",
                                        "etag": "\"9Y5jTkxN1JET3y-M4wKMA5aK7Mk/3SdJJ2pdgmy0jBGcJ3JyHZby0fs\"",
                                        "id": "VSL0vtRrTYk",
                                        "contentDetails": {
                                            "duration": "PT3M2S",
                                            "dimension": "2d",
                                            "definition": "hd",
                                            "caption": "false",
                                            "licensedContent": true
                                        }
                                    }
                                ]
                            });
                            /* jshint quotmark:single */

                        player.src = 'VSL0vtRrTYk';
                        Runner.run(() => player.load());
                        Promise.all([Promise.resolve(codeLoader.load('youtube')).then(() => {
                            youtube.Player.calls.mostRecent().args[1].events.onReady();
                        }), fetcher.flush()]).then(() => {
                            player.currentTime = 5;
                            done();
                        }, done);
                    });

                    it('should call seekTo() with the specified value', function() {
                        expect(ytPlayer.seekTo).toHaveBeenCalledWith(5);
                    });

                    it('should not set the currentTime immediately', function() {
                        expect(player.currentTime).not.toBe(5);
                    });
                });
            });
        });

        describe('duration', function() {
            it('should be 0', function() {
                expect(player.duration).toBe(0);
            });
        });

        describe('volume', function() {
            it('should be 0', function() {
                expect(player.volume).toBe(0);
            });
        });

        describe('ended', function() {
            it('should be false', function() {
                expect(player.ended).toBe(false);
            });
        });

        describe('paused', function() {
            it('should be true', function() {
                expect(player.paused).toBe(true);
            });
        });

        describe('seeking', function() {
            it('should be false', function() {
                expect(player.seeking).toBe(false);
            });
        });

        describe('src', function() {
            it('should be null', function() {
                expect(player.src).toBeNull();
            });

            describe('setting', function() {
                beforeEach(function() {
                    spyOn(player, 'unload').and.callThrough();
                    player.src = 'Q8e5VTlzXgU';
                });

                it('should unload the player', function() {
                    expect(player.unload).toHaveBeenCalled();
                });
            });
        });

        describe('error', function() {
            it('should be null', function() {
                expect(player.error).toBeNull();
            });
        });

        describe('start', function() {
            it('should be null', function() {
                expect(player.start).toBeNull();
            });
        });

        describe('end', function() {
            it('should be null', function() {
                expect(player.end).toBeNull();
            });
        });

        describe('autoplay', function() {
            it('should be false', function() {
                expect(player.autoplay).toBe(false);
            });
        });
    });

    describe('methods:', function() {
        describe('play()', function() {
            let ytPlayer;
            let autoplayDeferred;

            beforeEach(function() {
                autoplayDeferred = defer(RunnerPromise);

                fetcher.expect('GET', 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=VSL0vtRrTYk&key=AIzaSyBYOutFJ1yBx8MAYy5OgtTvslvBiFk8wok')
                    /* jshint quotmark:double */
                    .respond(200, {
                        "kind": "youtube#videoListResponse",
                        "etag": "\"9Y5jTkxN1JET3y-M4wKMA5aK7Mk/sIFI89DqvelExXrnNpMtej8AGvc\"",
                        "pageInfo": {
                            "totalResults": 1,
                            "resultsPerPage": 1
                        },
                        "items": [
                            {
                                "kind": "youtube#video",
                                "etag": "\"9Y5jTkxN1JET3y-M4wKMA5aK7Mk/3SdJJ2pdgmy0jBGcJ3JyHZby0fs\"",
                                "id": "VSL0vtRrTYk",
                                "contentDetails": {
                                    "duration": "PT3M2S",
                                    "dimension": "2d",
                                    "definition": "hd",
                                    "caption": "false",
                                    "licensedContent": true
                                }
                            }
                        ]
                    });
                    /* jshint quotmark:single */

                ytPlayer = {
                    playVideo: jasmine.createSpy('Player.playVideo()')
                };
                spyOn(youtube, 'Player').and.returnValue(ytPlayer);
                spyOn(player, 'load').and.callThrough();
                spyOn(browser, 'test').and.returnValue(autoplayDeferred.promise);

                player.src = 'VSL0vtRrTYk';
                player.play();
            });

            it('should check if the browser can autoplay', function() {
                expect(browser.test).toHaveBeenCalledWith('autoplay');
            });

            describe('if the device can autoplay', function() {
                beforeEach(function(done) {
                    autoplayDeferred.promise.then(done, done);

                    autoplayDeferred.fulfill(true);
                });

                it('should load() the player', function() {
                    expect(player.load).toHaveBeenCalled();
                });

                it('should not play the player', function() {
                    expect(ytPlayer.playVideo).not.toHaveBeenCalled();
                });

                describe('when the player is ready', function() {
                    beforeEach(function(done) {
                        codeLoader.load('youtube').then(() => youtube.Player.calls.mostRecent().args[1].events.onReady()).then(done, done);
                    });

                    it('should play the video', function() {
                        expect(ytPlayer.playVideo).toHaveBeenCalled();
                    });

                    describe('when called again', function() {
                        beforeEach(function(done) {
                            player.load.calls.reset();
                            ytPlayer.playVideo.calls.reset();
                            player.play();
                            autoplayDeferred.promise.then(done, done);
                        });

                        it('should not load the video', function() {
                            expect(player.load).not.toHaveBeenCalled();
                        });

                        it('should play the video', function() {
                            expect(ytPlayer.playVideo).toHaveBeenCalled();
                        });
                    });
                });
            });

            describe('if the device cannot autoplay', function() {
                beforeEach(function(done) {
                    autoplayDeferred.promise.then(done, done);

                    autoplayDeferred.fulfill(false);
                });

                it('should load() the player', function() {
                    expect(player.load).toHaveBeenCalled();
                });

                describe('when the player is ready', function() {
                    beforeEach(function(done) {
                        codeLoader.load('youtube').then(() => youtube.Player.calls.mostRecent().args[1].events.onReady()).then(done, done);
                    });

                    it('should not play the video', function() {
                        expect(ytPlayer.playVideo).not.toHaveBeenCalled();
                    });

                    describe('when the video has played', function() {
                        beforeEach(function(done) {
                            youtube.Player.calls.mostRecent().args[1].events.onStateChange({ data: youtube.PlayerState.PLAYING });

                            player.play();
                            autoplayDeferred.promise.then(done, done);
                        });

                        it('should play the video', function() {
                            expect(ytPlayer.playVideo).toHaveBeenCalled();
                        });
                    });

                    describe('when called again', function() {
                        beforeEach(function(done) {
                            player.load.calls.reset();
                            ytPlayer.playVideo.calls.reset();
                            player.play();
                            autoplayDeferred.promise.then(done, done);
                        });

                        it('should not load the video', function() {
                            expect(player.load).not.toHaveBeenCalled();
                        });

                        it('should not play the video', function() {
                            expect(ytPlayer.playVideo).not.toHaveBeenCalled();
                        });
                    });
                });
            });
        });

        describe('pause()', function() {
            let ytPlayer;

            beforeEach(function() {
                ytPlayer = {
                    pauseVideo: jasmine.createSpy('Player.pauseVideo()')
                };
                spyOn(youtube, 'Player').and.returnValue(ytPlayer);

                player.src = 'uf_QhUZX3BM';
            });

            describe('if called before load()', function() {
                beforeEach(function() {
                    player.pause();
                });

                it('should do nothing', function() {
                    expect(ytPlayer.pauseVideo).not.toHaveBeenCalled();
                });
            });

            describe('if called after load', function() {
                beforeEach(function(done) {
                    fetcher.expect('GET', 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=uf_QhUZX3BM&key=AIzaSyBYOutFJ1yBx8MAYy5OgtTvslvBiFk8wok')
                        /* jshint quotmark:double */
                        .respond(200, {
                            "kind": "youtube#videoListResponse",
                            "etag": "\"9Y5jTkxN1JET3y-M4wKMA5aK7Mk/sIFI89DqvelExXrnNpMtej8AGvc\"",
                            "pageInfo": {
                                "totalResults": 1,
                                "resultsPerPage": 1
                            },
                            "items": [
                                {
                                    "kind": "youtube#video",
                                    "etag": "\"9Y5jTkxN1JET3y-M4wKMA5aK7Mk/3SdJJ2pdgmy0jBGcJ3JyHZby0fs\"",
                                    "id": "uf_QhUZX3BM",
                                    "contentDetails": {
                                        "duration": "PT3M2S",
                                        "dimension": "2d",
                                        "definition": "hd",
                                        "caption": "false",
                                        "licensedContent": true
                                    }
                                }
                            ]
                        });
                        /* jshint quotmark:single */

                    Runner.run(() => player.load());
                    codeLoader.load('youtube').then(() => {
                        player.pause();
                        done();
                    });
                });

                it('should do nothing', function() {
                    expect(ytPlayer.pauseVideo).not.toHaveBeenCalled();
                });

                describe('and after the video is ready', function() {
                    beforeEach(function() {
                        youtube.Player.calls.mostRecent().args[1].events.onReady();
                        player.pause();
                    });

                    it('should call pauseVideo()', function() {
                        expect(ytPlayer.pauseVideo).toHaveBeenCalled();
                    });
                });
            });
        });

        describe('load()', function() {
            let iframe, ytPlayer;
            let loadstart;

            beforeEach(function(_done) {
                const createElement = document.createElement;

                function done() { process.nextTick(_done); }
                codeLoader.load('youtube').then(done, done);

                spyOn(codeLoader, 'load').and.callThrough();
                spyOn(document, 'createElement').and.callFake(function() {
                    return (iframe = createElement.call(document, ...arguments));
                });

                ytPlayer = {
                    getCurrentTime: jasmine.createSpy('Player.getCurrentTime()').and.returnValue(0),
                    seekTo: jasmine.createSpy('Player.seekTo()'),
                    pauseVideo: jasmine.createSpy('Player.pauseVideo()')
                };
                spyOn(youtube, 'Player').and.returnValue(ytPlayer);

                loadstart = jasmine.createSpy('loadstart');
                player.on('loadstart', loadstart);

                fetcher.expect('GET', 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=DcylVx2ex78&key=AIzaSyBYOutFJ1yBx8MAYy5OgtTvslvBiFk8wok')
                    /* jshint quotmark:double */
                    .respond(200, {
                        "kind": "youtube#videoListResponse",
                        "etag": "\"9Y5jTkxN1JET3y-M4wKMA5aK7Mk/sIFI89DqvelExXrnNpMtej8AGvc\"",
                        "pageInfo": {
                            "totalResults": 1,
                            "resultsPerPage": 1
                        },
                        "items": [
                            {
                                "kind": "youtube#video",
                                "etag": "\"9Y5jTkxN1JET3y-M4wKMA5aK7Mk/3SdJJ2pdgmy0jBGcJ3JyHZby0fs\"",
                                "id": "DcylVx2ex78",
                                "contentDetails": {
                                    "duration": "PT7M5S",
                                    "dimension": "2d",
                                    "definition": "hd",
                                    "caption": "false",
                                    "licensedContent": true
                                }
                            }
                        ]
                    });
                    /* jshint quotmark:single */

                player.src = 'DcylVx2ex78';
                Runner.run(() => player.load());
            });

            it('should emit loadstart', function() {
                expect(loadstart).toHaveBeenCalled();
            });

            it('should load the youtube library', function() {
                expect(codeLoader.load).toHaveBeenCalledWith('youtube');
            });

            it('should fetch the video metadata', function(done) {
                fetcher.flush().then(done);
            });

            describe('after the metadata is fetched', function() {
                let loadedmetadata, durationchange;

                beforeEach(function(done) {
                    loadedmetadata = jasmine.createSpy('loadedmetadata()');
                    durationchange = jasmine.createSpy('durationchange()');

                    player.on('loadedmetadata', loadedmetadata);
                    player.on('durationchange', durationchange);

                    fetcher.flush().then(() => process.nextTick(done));
                });

                it('should set the duration', function() {
                    expect(player.duration).toBe(425);
                });

                it('should emit durationchange', function() {
                    expect(durationchange).toHaveBeenCalled();
                });

                it('should set readyState to 1', function() {
                    expect(player.readyState).toBe(1);
                });

                it('should emit loadedmetadata', function() {
                    expect(loadedmetadata).toHaveBeenCalled();
                });

                describe('if the API is ready', function() {
                    beforeEach(function(done) {
                        player = new YouTubePlayer();

                        youtube.Player.calls.reset();

                        fetcher.expect('GET', 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=HSGHNfxxDjw&key=AIzaSyBYOutFJ1yBx8MAYy5OgtTvslvBiFk8wok')
                            /* jshint quotmark:double */
                            .respond(200, {
                                "kind": "youtube#videoListResponse",
                                "etag": "\"9Y5jTkxN1JET3y-M4wKMA5aK7Mk/sIFI89DqvelExXrnNpMtej8AGvc\"",
                                "pageInfo": {
                                    "totalResults": 1,
                                    "resultsPerPage": 1
                                },
                                "items": [
                                    {
                                        "kind": "youtube#video",
                                        "etag": "\"9Y5jTkxN1JET3y-M4wKMA5aK7Mk/3SdJJ2pdgmy0jBGcJ3JyHZby0fs\"",
                                        "id": "HSGHNfxxDjw",
                                        "contentDetails": {
                                            "duration": "PT1H5S",
                                            "dimension": "2d",
                                            "definition": "hd",
                                            "caption": "false",
                                            "licensedContent": true
                                        }
                                    }
                                ]
                            });
                            /* jshint quotmark:single */

                        player.src = 'HSGHNfxxDjw';
                        Runner.run(() => player.load());
                        Promise.resolve(codeLoader.load('youtube')).then(() => {
                            youtube.Player.calls.mostRecent().args[1].events.onReady();
                            fetcher.flush().then(() => process.nextTick(done));
                        });
                    });

                    it('should not change the readyState', function() {
                        expect(player.readyState).not.toBe(1);
                    });
                });
            });

            it('should create a new YT.Player()', function() {
                expect(youtube.Player).toHaveBeenCalledWith(iframe, {
                    events: {
                        onReady: jasmine.any(Function),
                        onStateChange: jasmine.any(Function)
                    }
                });
            });

            it('should create an iframe and append it to the player', function() {
                expect(document.createElement).toHaveBeenCalledWith('iframe');
                expect(player.element.childNodes).toContain(iframe);
            });

            it('should set the iframe src based on the player src', function() {
                expect(iframe.src).toBe(`https://www.youtube.com/embed/${player.src}?html5=1&wmode=opaque&rel=0&enablejsapi=1`);
            });

            describe('when the api is ready', function() {
                let canplay, timeupdate;
                let config;

                beforeEach(function() {
                    config = youtube.Player.calls.mostRecent().args[1];

                    canplay = jasmine.createSpy('canplay()');
                    player.on('canplay', canplay);

                    timeupdate = jasmine.createSpy('timeupdate()');
                    player.on('timeupdate', timeupdate);

                    jasmine.clock().install();
                    config.events.onReady();
                });

                afterEach(function() {
                    jasmine.clock().uninstall();
                });

                it('should emit canplay', function() {
                    expect(canplay).toHaveBeenCalled();
                });

                it('should set the readyState to 3', function() {
                    expect(player.readyState).toBe(3);
                });

                describe('if the video is seeked', function() {
                    let seeking;

                    beforeEach(function() {
                        ytPlayer.getCurrentTime.and.returnValue(2);
                        jasmine.clock().tick(250);

                        seeking = jasmine.createSpy('seeking()');
                        player.on('seeking', seeking);

                        player.currentTime = 5;
                    });

                    it('should set seeking to true', function() {
                        expect(player.seeking).toBe(true);
                    });

                    it('should emit seeking', function() {
                        expect(seeking).toHaveBeenCalled();
                    });

                    describe('when the currentTime changes', function() {
                        let seeked;

                        beforeEach(function() {
                            seeked = jasmine.createSpy('seeked()');
                            player.on('seeked', seeked);

                            jasmine.clock().tick(250);
                            expect(seeked).not.toHaveBeenCalled();
                            expect(player.seeking).toBe(true);

                            ytPlayer.getCurrentTime.and.returnValue(5);
                            jasmine.clock().tick(250);
                        });

                        it('should set seeking to false', function() {
                            expect(player.seeking).toBe(false);
                        });

                        it('should emit seeked', function() {
                            expect(seeked).toHaveBeenCalled();
                        });
                    });
                });

                describe('if the video is not seeked', function() {
                    let seeked;

                    beforeEach(function() {
                        ytPlayer.getCurrentTime.and.returnValue(3);

                        seeked = jasmine.createSpy('seeked()');
                        player.on('seeked', seeked);

                        jasmine.clock().tick(250);
                    });

                    it('should not emit seeked', function() {
                        expect(seeked).not.toHaveBeenCalled();
                    });
                });

                it('should poll the video to emit "timeupdate" and update the currentTime whenever the currentTime changes', function() {
                    jasmine.clock().tick(250);
                    expect(player.currentTime).toBe(0);
                    expect(timeupdate).not.toHaveBeenCalled();

                    ytPlayer.getCurrentTime.and.returnValue(2.5);
                    jasmine.clock().tick(250);
                    expect(player.currentTime).toBe(2.5);
                    expect(timeupdate).toHaveBeenCalled();
                    timeupdate.calls.reset();

                    jasmine.clock().tick(250);
                    expect(player.currentTime).toBe(2.5);
                    expect(timeupdate).not.toHaveBeenCalled();

                    ytPlayer.getCurrentTime.and.returnValue(3.2);
                    jasmine.clock().tick(250);
                    expect(player.currentTime).toBe(3.2);
                    expect(timeupdate).toHaveBeenCalled();
                });

                describe('if there is a start time', function() {
                    beforeEach(function() {
                        player.start = 15;
                    });

                    it('should account for the start time when computing the currentTime', function() {
                        ytPlayer.getCurrentTime.and.returnValue(10);
                        jasmine.clock().tick(250);
                        expect(player.currentTime).toBe(0);

                        ytPlayer.getCurrentTime.and.returnValue(16);
                        jasmine.clock().tick(250);
                        expect(player.currentTime).toBe(1);
                    });

                    it('should account for the start time when setting currentTime', function() {
                        player.currentTime = 10;
                        expect(ytPlayer.seekTo).toHaveBeenCalledWith(25);

                        player.currentTime = -3;
                        expect(ytPlayer.seekTo).toHaveBeenCalledWith(15);
                    });

                    describe('when accounting for the duration', function() {
                        beforeEach(function(done) {
                            jasmine.clock().uninstall();

                            fetcher.expect('GET', 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=DcylVx2ex78&key=AIzaSyBYOutFJ1yBx8MAYy5OgtTvslvBiFk8wok')
                                /* jshint quotmark:double */
                                .respond(200, {
                                    "kind": "youtube#videoListResponse",
                                    "etag": "\"9Y5jTkxN1JET3y-M4wKMA5aK7Mk/sIFI89DqvelExXrnNpMtej8AGvc\"",
                                    "pageInfo": {
                                        "totalResults": 1,
                                        "resultsPerPage": 1
                                    },
                                    "items": [
                                        {
                                            "kind": "youtube#video",
                                            "etag": "\"9Y5jTkxN1JET3y-M4wKMA5aK7Mk/3SdJJ2pdgmy0jBGcJ3JyHZby0fs\"",
                                            "id": "DcylVx2ex78",
                                            "contentDetails": {
                                                "duration": "PT1M5S",
                                                "dimension": "2d",
                                                "definition": "hd",
                                                "caption": "false",
                                                "licensedContent": true
                                            }
                                        }
                                    ]
                                });
                                /* jshint quotmark:single */

                            Runner.run(() => player.reload());
                            fetcher.flush().then(() => process.nextTick(done));
                        });

                        afterEach(function() {
                            jasmine.clock().install();
                        });

                        it('should use the start time', function() {
                            expect(player.duration).toBe(50);
                        });
                    });

                    describe('if the video is playing', function() {
                        beforeEach(function() {
                            config.events.onStateChange({ data: youtube.PlayerState.PLAYING });
                        });

                        it('should call seekTo() with the start time if the currentTime is less than the start time', function() {
                            ytPlayer.getCurrentTime.and.returnValue(10);
                            jasmine.clock().tick(250);
                            expect(ytPlayer.seekTo).toHaveBeenCalledWith(15);
                            ytPlayer.seekTo.calls.reset();

                            ytPlayer.getCurrentTime.and.returnValue(14.99);
                            jasmine.clock().tick(250);
                            expect(ytPlayer.seekTo).toHaveBeenCalledWith(15);
                            ytPlayer.seekTo.calls.reset();

                            ytPlayer.getCurrentTime.and.returnValue(15);
                            jasmine.clock().tick(250);
                            expect(ytPlayer.seekTo).not.toHaveBeenCalled();
                        });
                    });

                    describe('if the video is not playing', function() {
                        it('should not call seekTo()', function() {
                            ytPlayer.getCurrentTime.and.returnValue(0.25);
                            jasmine.clock().tick(250);
                            expect(ytPlayer.seekTo).not.toHaveBeenCalled();
                        });
                    });
                });

                describe('if there is no start time', function() {
                    beforeEach(function() {
                        player.start = null;

                        ytPlayer.getCurrentTime.and.returnValue(10);
                        jasmine.clock().tick(250);
                    });

                    it('should not call seekTo()', function() {
                        expect(ytPlayer.seekTo).not.toHaveBeenCalled();
                    });
                });

                describe('if there is an end time', function() {
                    let ended;

                    beforeEach(function() {
                        ended = jasmine.createSpy('ended()');
                        player.on('ended', ended);

                        player.end = 45;
                    });

                    it('should account for the end time when setting the currentTime', function() {
                        player.currentTime = 50;
                        expect(ytPlayer.seekTo).toHaveBeenCalledWith(45);
                    });

                    describe('when accounting for the duration', function() {
                        beforeEach(function(done) {
                            jasmine.clock().uninstall();

                            fetcher.expect('GET', 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=DcylVx2ex78&key=AIzaSyBYOutFJ1yBx8MAYy5OgtTvslvBiFk8wok')
                                /* jshint quotmark:double */
                                .respond(200, {
                                    "kind": "youtube#videoListResponse",
                                    "etag": "\"9Y5jTkxN1JET3y-M4wKMA5aK7Mk/sIFI89DqvelExXrnNpMtej8AGvc\"",
                                    "pageInfo": {
                                        "totalResults": 1,
                                        "resultsPerPage": 1
                                    },
                                    "items": [
                                        {
                                            "kind": "youtube#video",
                                            "etag": "\"9Y5jTkxN1JET3y-M4wKMA5aK7Mk/3SdJJ2pdgmy0jBGcJ3JyHZby0fs\"",
                                            "id": "DcylVx2ex78",
                                            "contentDetails": {
                                                "duration": "PT1M5S",
                                                "dimension": "2d",
                                                "definition": "hd",
                                                "caption": "false",
                                                "licensedContent": true
                                            }
                                        }
                                    ]
                                });
                                /* jshint quotmark:single */

                            Runner.run(() => player.reload());
                            fetcher.flush().then(() => process.nextTick(done));
                        });

                        afterEach(function() {
                            jasmine.clock().install();
                        });

                        it('should use the end time', function() {
                            expect(player.duration).toBe(45);
                        });
                    });

                    describe('if the currentTime is < the end time', function() {
                        beforeEach(function() {
                            config.events.onStateChange({ data: youtube.PlayerState.PLAYING });

                            ytPlayer.getCurrentTime.and.returnValue(2);
                            jasmine.clock().tick(250);

                            ytPlayer.getCurrentTime.and.returnValue(30);
                            jasmine.clock().tick(250);

                            ytPlayer.getCurrentTime.and.returnValue(41);
                            jasmine.clock().tick(250);

                            ytPlayer.getCurrentTime.and.returnValue(44.99);
                            jasmine.clock().tick(250);
                        });

                        it('should not pause the video', function() {
                            expect(ytPlayer.pauseVideo).not.toHaveBeenCalled();
                        });

                        it('should not set ended to true', function() {
                            expect(player.ended).not.toBe(true);
                        });

                        it('should not emit ended', function() {
                            expect(ended).not.toHaveBeenCalled();
                        });
                    });

                    describe('if the currentTime is >= the end time', function() {
                        beforeEach(function() {
                            config.events.onStateChange({ data: youtube.PlayerState.PLAYING });

                            ytPlayer.getCurrentTime.and.returnValue(45);
                            jasmine.clock().tick(250);
                        });

                        it('should pause the video', function() {
                            expect(ytPlayer.pauseVideo).toHaveBeenCalled();
                        });

                        it('should set ended to true', function() {
                            expect(player.ended).toBe(true);
                        });

                        it('should emit ended', function() {
                            expect(ended).toHaveBeenCalled();
                        });

                        describe('if the video is not playing', function() {
                            beforeEach(function() {
                                ytPlayer.pauseVideo.calls.reset();
                                config.events.onStateChange({ data: youtube.PlayerState.PAUSED });
                                jasmine.clock().tick(250);
                            });

                            it('should not pause the video again', function() {
                                expect(ytPlayer.pauseVideo).not.toHaveBeenCalled();
                            });
                        });
                    });
                });

                describe('if there is no end time', function() {
                    beforeEach(function() {
                        player.end = null;

                        config.events.onStateChange({ data: youtube.PlayerState.PLAYING });

                        ytPlayer.getCurrentTime.and.returnValue(2);
                        jasmine.clock().tick(250);
                    });

                    it('should not pause the video', function() {
                        expect(ytPlayer.pauseVideo).not.toHaveBeenCalled();
                    });
                });

                describe('when the video starts playing', function() {
                    let play;

                    beforeEach(function() {
                        config.events.onStateChange({ data: youtube.PlayerState.ENDED });
                        config.events.onStateChange({ data: youtube.PlayerState.BUFFERING });

                        play = jasmine.createSpy('play()');
                        player.on('play', play);

                        config.events.onStateChange({ data: youtube.PlayerState.PLAYING });
                    });

                    it('should set paused to "false"', function() {
                        expect(player.paused).toBe(false);
                    });

                    it('should set ended to "false"', function() {
                        expect(player.ended).toBe(false);
                    });

                    it('should emit "play"', function() {
                        expect(play).toHaveBeenCalled();
                    });

                    describe('if the last state was BUFFERING', function() {
                        beforeEach(function() {
                            play.calls.reset();

                            config.events.onStateChange({ data: youtube.PlayerState.BUFFERING });
                            config.events.onStateChange({ data: youtube.PlayerState.PLAYING });
                        });

                        it('should not emit "play"', function() {
                            expect(play).not.toHaveBeenCalled();
                        });
                    });
                });

                describe('when the video pauses', function() {
                    let pause;

                    beforeEach(function() {
                        config.events.onStateChange({ data: youtube.PlayerState.PLAYING });

                        pause = jasmine.createSpy('pause()');
                        player.on('pause', pause);

                        config.events.onStateChange({ data: youtube.PlayerState.BUFFERING });
                        config.events.onStateChange({ data: youtube.PlayerState.PAUSED });
                    });

                    it('should set paused to true', function() {
                        expect(player.paused).toBe(true);
                    });

                    it('should emit pause', function() {
                        expect(pause).toHaveBeenCalled();
                    });

                    describe('if the last state was BUFFERING', function() {
                        beforeEach(function() {
                            pause.calls.reset();

                            config.events.onStateChange({ data: youtube.PlayerState.BUFFERING });
                            config.events.onStateChange({ data: youtube.PlayerState.PAUSED });
                        });

                        it('should not emit "pause"', function() {
                            expect(pause).not.toHaveBeenCalled();
                        });
                    });
                });

                describe('when the video ends', function() {
                    let ended;

                    beforeEach(function() {
                        config.events.onStateChange({ data: youtube.PlayerState.PLAYING });

                        ended = jasmine.createSpy('ended()');
                        player.on('ended', ended);

                        config.events.onStateChange({ data: youtube.PlayerState.ENDED });
                    });

                    it('should set paused to true', function() {
                        expect(player.paused).toBe(true);
                    });

                    it('should set ended to true', function() {
                        expect(player.ended).toBe(true);
                    });

                    it('should emit "ended"', function() {
                        expect(ended).toHaveBeenCalled();
                    });
                });
            });

            describe('if called again', function() {
                beforeEach(function() {
                    document.createElement.calls.reset();
                    spyOn(fetcher, 'fetch').and.callThrough();
                    codeLoader.load.calls.reset();
                    loadstart.calls.reset();

                    player.src = player.src;
                    Runner.run(() => player.load());
                });

                it('should not remove the previous iframe', function() {
                    expect(player.element.childNodes).toContain(iframe);
                });

                it('should not create any new elements', function() {
                    expect(document.createElement).not.toHaveBeenCalled();
                });

                it('should not fetch anything', function() {
                    expect(fetcher.fetch).not.toHaveBeenCalled();
                });

                it('should not reload the iframe api', function() {
                    expect(codeLoader.load).not.toHaveBeenCalled();
                });

                it('should not emit loadstart', function() {
                    expect(loadstart).not.toHaveBeenCalled();
                });

                describe('if the src changes', function() {
                    let prevFrame;

                    beforeEach(function(done) {
                        prevFrame = iframe;

                        youtube.Player.calls.reset();
                        fetcher.expect('GET', 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=w_x7rSZ5aJQ&key=AIzaSyBYOutFJ1yBx8MAYy5OgtTvslvBiFk8wok')
                            /* jshint quotmark:double */
                            .respond(200, {
                                "kind": "youtube#videoListResponse",
                                "etag": "\"9Y5jTkxN1JET3y-M4wKMA5aK7Mk/sIFI89DqvelExXrnNpMtej8AGvc\"",
                                "pageInfo": {
                                    "totalResults": 1,
                                    "resultsPerPage": 1
                                },
                                "items": [
                                    {
                                        "kind": "youtube#video",
                                        "etag": "\"9Y5jTkxN1JET3y-M4wKMA5aK7Mk/3SdJJ2pdgmy0jBGcJ3JyHZby0fs\"",
                                        "id": "w_x7rSZ5aJQ",
                                        "contentDetails": {
                                            "duration": "PT59S",
                                            "dimension": "2d",
                                            "definition": "hd",
                                            "caption": "false",
                                            "licensedContent": true
                                        }
                                    }
                                ]
                            });
                            /* jshint quotmark:single */

                        player.src = 'w_x7rSZ5aJQ';
                        Runner.run(() => player.load());
                        codeLoader.load('youtube').then(done);
                    });

                    it('should remove the previous iframe', function() {
                        expect(player.element.childNodes).not.toContain(prevFrame);
                    });

                    it('should create a new iframe', function() {
                        expect(document.createElement).toHaveBeenCalledWith('iframe');
                    });

                    it('should create a new youtube.Player', function() {
                        expect(youtube.Player).toHaveBeenCalledWith(iframe, jasmine.any(Object));
                    });
                });
            });
        });

        describe('unload()', function() {
            let iframe, ytPlayer;

            beforeEach(function(done) {
                player.src = 'UkOKCWDJ4iA';

                fetcher.expect('GET', 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=UkOKCWDJ4iA&key=AIzaSyBYOutFJ1yBx8MAYy5OgtTvslvBiFk8wok')
                    /* jshint quotmark:double */
                    .respond(200, {
                        "kind": "youtube#videoListResponse",
                        "etag": "\"9Y5jTkxN1JET3y-M4wKMA5aK7Mk/sIFI89DqvelExXrnNpMtej8AGvc\"",
                        "pageInfo": {
                            "totalResults": 1,
                            "resultsPerPage": 1
                        },
                        "items": [
                            {
                                "kind": "youtube#video",
                                "etag": "\"9Y5jTkxN1JET3y-M4wKMA5aK7Mk/3SdJJ2pdgmy0jBGcJ3JyHZby0fs\"",
                                "id": "UkOKCWDJ4iA",
                                "contentDetails": {
                                    "duration": "PT59S",
                                    "dimension": "2d",
                                    "definition": "hd",
                                    "caption": "false",
                                    "licensedContent": true
                                }
                            }
                        ]
                    });
                    /* jshint quotmark:single */

                ytPlayer = {
                    playVideo: jasmine.createSpy('Player.playVideo()'),
                    getCurrentTime: jasmine.createSpy('Player.getCurrentTime()').and.returnValue(3),
                    seekTo: jasmine.createSpy('Player.seekTo()')
                };
                spyOn(youtube, 'Player').and.returnValue(ytPlayer);

                jasmine.clock().install();

                Runner.run(() => player.load());
                iframe = player.element.querySelector('iframe');
                Promise.all([Promise.resolve(codeLoader.load('youtube')).then(() => {
                    youtube.Player.calls.mostRecent().args[1].events.onReady();
                    youtube.Player.calls.mostRecent().args[1].events.onStateChange({ data: youtube.PlayerState.PLAYING });
                    jasmine.clock().tick(250);
                    ytPlayer.getCurrentTime.calls.reset();
                }), fetcher.flush()]).then(() => {
                    player.currentTime = 2;
                    player.unload();
                    done();
                }).catch(done);
            });

            afterEach(function() {
                jasmine.clock().uninstall();
            });

            describe('if the player was playing', function() {
                beforeEach(function() {
                    youtube.Player.calls.mostRecent().args[1].events.onStateChange({ data: youtube.PlayerState.PLAYING });
                    player.unload();
                });

                it('should reset paused', function() {
                    expect(player.paused).toBe(true);
                });
            });

            describe('if the player had ended', function() {
                beforeEach(function() {
                    youtube.Player.calls.mostRecent().args[1].events.onStateChange({ data: youtube.PlayerState.ENDED });
                    player.unload();
                });

                it('should reset ended', function() {
                    expect(player.ended).toBe(false);
                });
            });

            it('should reset seeking', function() {
                expect(player.seeking).toBe(false);
            });

            it('should reset the readyState', function() {
                expect(player.readyState).toBe(0);
            });

            it('should reset the duration', function() {
                expect(player.duration).toBe(0);
            });

            it('should reset the currentTime', function() {
                expect(player.currentTime).toBe(0);
            });

            it('should remove any iframe from the DOM', function() {
                expect(player.element.childNodes).not.toContain(iframe);
            });

            it('should stop polling the player', function() {
                jasmine.clock().tick(250);
                expect(ytPlayer.getCurrentTime).not.toHaveBeenCalled();
            });

            it('should cause play() to load the video again', function(done) {
                spyOn(browser, 'test').and.returnValue(RunnerPromise.resolve(true));
                spyOn(player, 'load');
                player.play();

                browser.test().then(() => expect(player.load).toHaveBeenCalled()).then(done, done);
            });

            it('should cause play() to require the video to autoplay again', function(done) {
                ytPlayer.playVideo.calls.reset();
                spyOn(browser, 'test').and.returnValue(RunnerPromise.resolve(false));
                player.play();

                browser.test().then(() => {
                    youtube.Player.calls.mostRecent().args[1].events.onReady();
                    expect(ytPlayer.playVideo).not.toHaveBeenCalled();
                }).then(done, done);
            });

            describe('if called initially', function() {
                beforeEach(function() {
                    player.unload();
                    player = new YouTubePlayer();
                });

                it('should not throw', function() {
                    expect(function() {
                        player.unload();
                    }).not.toThrow();
                });
            });
        });

        describe('reload()', function() {
            beforeEach(function() {
                spyOn(player, 'unload');
                spyOn(player, 'load');

                Runner.run(() => player.reload());
            });

            it('should call unload() then load()', function() {
                expect(player.unload).toHaveBeenCalled();
                expect(player.load).toHaveBeenCalled();
            });
        });

        describe('minimize()', function() {
            let result;

            beforeEach(function() {
                result = player.minimize();
            });

            it('should return an error', function() {
                expect(result).toEqual(new Error('YouTubePlayer cannot be minimized.'));
            });
        });
    });

    describe('hooks:', function() {
        describe('didInsertElement()', function() {
            beforeEach(function() {
                spyOn(player, 'play');
            });

            describe('if autoplay is false', function() {
                beforeEach(function() {
                    player.autoplay = false;
                    player.didInsertElement();
                });

                it('should not play', function() {
                    expect(player.play).not.toHaveBeenCalled();
                });
            });

            describe('if autoplay is true', function() {
                beforeEach(function() {
                    player.autoplay = true;
                    player.didInsertElement();
                });

                it('should play', function() {
                    expect(player.play).toHaveBeenCalled();
                });
            });
        });
    });
});
