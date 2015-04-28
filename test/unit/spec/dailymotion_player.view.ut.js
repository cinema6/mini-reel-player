import DailymotionPlayer from '../../../src/players/DailymotionPlayer.js';
import PlayerInterface from '../../../src/interfaces/PlayerInterface.js';
import CorePlayer from '../../../src/players/CorePlayer.js';
import dailymotion from '../../../src/services/dailymotion.js';
import fetcher from '../../../lib/fetcher.js';
import Runner from '../../../lib/Runner.js';
import browser from '../../../src/services/browser.js';
import RunnerPromise from '../../../lib/RunnerPromise.js';
import media from '../../../src/services/media.js';
import {
    defer
} from '../../../lib/utils.js';

describe('DailymotionPlayer', function() {
    let player;
    let video, iframe;

    beforeEach(function() {
        fetcher.constructor();

        player = new DailymotionPlayer();

        const Player  = dailymotion.Player;

        spyOn(dailymotion, 'Player').and.callFake(_iframe_ => {
            iframe = _iframe_;
            return (video = new Player(iframe));
        });
    });

    afterAll(function() {
        fetcher.constructor();
    });

    it('should exist', function() {
        expect(player).toEqual(jasmine.any(CorePlayer));
    });

    it('should implement the PlayerInterface', function() {
        expect(player).toImplement(PlayerInterface);
    });

    describe('properties:', function() {
        describe('readyState', function() {
            it('should be 0', function() {
                expect(player.readyState).toBe(0);
            });

            it('should not be settable', function() {
                expect(() => player.readyState = 1).toThrow();
            });
        });

        describe('duration', function() {
            it('should be 0', function() {
                expect(player.duration).toBe(0);
            });

            it('should not be settable', function() {
                expect(() => player.duration = 1).toThrow();
            });
        });

        describe('currentTime', function() {
            it('should be 0', function() {
                expect(player.currentTime).toBe(0);
            });

            describe('setting', function() {
                describe('before load() is called', function() {
                    beforeEach(function() {
                        player.currentTime = 3;
                    });

                    it('should set the currentTime', function() {
                        expect(player.currentTime).toBe(3);
                    });
                });

                describe('after load is called', function() {
                    beforeEach(function() {
                        spyOn(fetcher, 'get').and.returnValue(new Promise(() => {}));
                        Runner.run(() => player.load());
                        spyOn(video, 'call');
                    });

                    describe('before the api is ready', function() {
                        beforeEach(function() {
                            player.currentTime = 4;
                        });

                        it('should set the currentTime', function() {
                            expect(player.currentTime).toBe(4);
                        });

                        it('should not seek the video', function() {
                            expect(video.call).not.toHaveBeenCalled();
                        });
                    });

                    describe('after the api is ready', function() {
                        beforeEach(function() {
                            video.emit('apiready');

                            player.currentTime = 4;
                        });

                        it('should not set the currentTime', function() {
                            expect(player.currentTime).not.toBe(4);
                        });

                        it('should seek the video', function() {
                            expect(video.call).toHaveBeenCalledWith('seek', 4);
                        });
                    });
                });
            });
        });

        describe('ended', function() {
            it('should be false', function() {
                expect(player.ended).toBe(false);
            });

            it('should not be settable', function() {
                expect(() => player.ended = true).toThrow();
            });
        });

        describe('paused', function() {
            it('should be true', function() {
                expect(player.paused).toBe(true);
            });

            it('should not be settable', function() {
                expect(() => player.paused = false).toThrow();
            });
        });

        describe('seeking', function() {
            it('should be false', function() {
                expect(player.seeking).toBe(false);
            });

            it('should not be settable', function() {
                expect(() => player.seeking = true).toThrow();
            });
        });

        describe('volume', function() {
            it('should be 1', function() {
                expect(player.volume).toBe(1);
            });

            it('should not be settable', function() {
                expect(() => player.volume = 0.5).toThrow();
            });
        });

        describe('muted', function() {
            it('should be false', function() {
                expect(player.muted).toBe(false);
            });

            it('should not be settable', function() {
                expect(() => player.muted = true).toThrow();
            });
        });

        describe('error', function() {
            it('should be null', function() {
                expect(player.error).toBeNull();
            });

            it('should not be settable', function() {
                expect(() => player.error = new Error()).toThrow();
            });
        });

        describe('src', function() {
            it('should be null', function() {
                expect(player.src).toBeNull();
            });
        });

        describe('controls', function() {
            it('should be true', function() {
                expect(player.controls).toBe(true);
            });
        });

        describe('autoplay', function() {
            it('should be false', function() {
                expect(player.autoplay).toBe(false);
            });
        });
    });

    describe('methods:', function() {
        describe('pause()', function() {
            describe('if called before load()', function() {
                it('should do nothing', function() {
                    expect(() => Runner.run(() => player.pause())).not.toThrow();
                });
            });

            describe('if called after load()', function() {
                beforeEach(function() {
                    spyOn(fetcher, 'get').and.returnValue(new Promise(() => {}));
                    Runner.run(() => player.load());
                    spyOn(video, 'call');
                });

                describe('if called before the api is ready', function() {
                    beforeEach(function() {
                        Runner.run(() => player.pause());
                    });

                    it('should do nothing', function() {
                        expect(video.call).not.toHaveBeenCalled();
                    });
                });

                describe('if called after the api is ready', function() {
                    beforeEach(function() {
                        video.emit('apiready');

                        Runner.run(() => player.pause());
                    });

                    it('should pause the video', function() {
                        expect(video.call).toHaveBeenCalledWith('pause');
                    });
                });
            });
        });

        describe('play()', function() {
            let attemptPlay;

            beforeEach(function() {
                attemptPlay = jasmine.createSpy('attemptPlay()');
                player.on('attemptPlay', attemptPlay);
                spyOn(player, 'load').and.callThrough();
                spyOn(fetcher, 'get').and.returnValue(new Promise(() => {}));
            });

            describe('if called before load()', function() {
                beforeEach(function() {
                    Runner.run(() => player.play());
                });

                it('should call load()', function() {
                    expect(player.load).toHaveBeenCalled();
                });

                describe('when the api is ready', function() {
                    let autoplayDeferred;

                    beforeEach(function() {
                        autoplayDeferred = defer(RunnerPromise);
                        spyOn(browser, 'test').and.returnValue(autoplayDeferred.promise);

                        video.emit('apiready');
                    });

                    it('should see if the device can autoplay', function() {
                        expect(browser.test).toHaveBeenCalledWith('autoplay');
                    });

                    describe('if the device cannot autoplay', function() {
                        beforeEach(function(done) {
                            spyOn(video, 'call');
                            autoplayDeferred.fulfill(false);

                            autoplayDeferred.promise.then(done, done);
                        });

                        it('should not play the video', function() {
                            expect(video.call).not.toHaveBeenCalled();
                        });

                        it('should not emit "attemptPlay"', function() {
                            expect(attemptPlay).not.toHaveBeenCalled();
                        });
                    });

                    describe('if the device can autoplay', function() {
                        beforeEach(function(done) {
                            spyOn(video, 'call');
                            autoplayDeferred.fulfill(true);

                            autoplayDeferred.promise.then(done, done);
                        });

                        it('should play the video', function() {
                            expect(video.call).toHaveBeenCalledWith('play');
                        });

                        it('should emit "attemptPlay"', function() {
                            expect(attemptPlay).toHaveBeenCalled();
                        });
                    });
                });
            });

            describe('if called after load()', function() {
                beforeEach(function() {
                    Runner.run(() => player.load());
                });

                describe('but before the api is ready', function() {
                    beforeEach(function() {
                        Runner.run(() => player.play());
                    });

                    it('should call load()', function() {
                        expect(player.load).toHaveBeenCalled();
                    });

                    describe('when the api is ready', function() {
                        let autoplayDeferred;

                        beforeEach(function() {
                            autoplayDeferred = defer(RunnerPromise);
                            spyOn(browser, 'test').and.returnValue(autoplayDeferred.promise);

                            video.emit('apiready');
                        });

                        it('should see if the device can autoplay', function() {
                            expect(browser.test).toHaveBeenCalledWith('autoplay');
                        });

                        describe('if the device cannot autoplay', function() {
                            beforeEach(function(done) {
                                spyOn(video, 'call');
                                autoplayDeferred.fulfill(false);

                                autoplayDeferred.promise.then(done, done);
                            });

                            it('should not play the video', function() {
                                expect(video.call).not.toHaveBeenCalled();
                            });

                            it('should not emit "attemptPlay"', function() {
                                expect(attemptPlay).not.toHaveBeenCalled();
                            });
                        });

                        describe('if the device can autoplay', function() {
                            beforeEach(function(done) {
                                spyOn(video, 'call');
                                autoplayDeferred.fulfill(true);

                                autoplayDeferred.promise.then(done, done);
                            });

                            it('should play the video', function() {
                                expect(video.call).toHaveBeenCalledWith('play');
                            });

                            it('should emit "attemptPlay"', function() {
                                expect(attemptPlay).toHaveBeenCalled();
                            });
                        });
                    });
                });

                describe('and the api is ready', function() {
                    beforeEach(function() {
                        video.emit('apiready');
                    });

                    describe('but the video has not yet played', function() {
                        let autoplayDeferred;

                        beforeEach(function() {
                            autoplayDeferred = defer(RunnerPromise);
                            spyOn(browser, 'test').and.returnValue(autoplayDeferred.promise);

                            Runner.run(() => player.play());
                        });

                        it('should see if the device can autoplay', function() {
                            expect(browser.test).toHaveBeenCalledWith('autoplay');
                        });

                        describe('if the device cannot autoplay', function() {
                            beforeEach(function(done) {
                                spyOn(video, 'call');
                                autoplayDeferred.fulfill(false);

                                autoplayDeferred.promise.then(done, done);
                            });

                            it('should not play the video', function() {
                                expect(video.call).not.toHaveBeenCalled();
                            });

                            it('should not emit "attemptPlay"', function() {
                                expect(attemptPlay).not.toHaveBeenCalled();
                            });
                        });

                        describe('if the device can autoplay', function() {
                            beforeEach(function(done) {
                                spyOn(video, 'call');
                                autoplayDeferred.fulfill(true);

                                autoplayDeferred.promise.then(done, done);
                            });

                            it('should play the video', function() {
                                expect(video.call).toHaveBeenCalledWith('play');
                            });

                            it('should emit "attemptPlay"', function() {
                                expect(attemptPlay).toHaveBeenCalled();
                            });
                        });
                    });

                    describe('and the video has already played', function() {
                        beforeEach(function() {
                            video.emit('playing');
                            spyOn(video, 'call');

                            Runner.run(() => player.play());
                        });

                        it('should play the video', function() {
                            expect(video.call).toHaveBeenCalledWith('play');
                        });

                        it('should emit "attemptPlay"', function() {
                            expect(attemptPlay).toHaveBeenCalled();
                        });
                    });
                });
            });
        });

        describe('unload()', function() {
            describe('before load() is called', function() {
                it('should do nothing', function() {
                    expect(() => player.unload()).not.toThrow();
                });
            });

            describe('after load() is called', function() {
                beforeEach(function() {
                    player.src = '123';
                    spyOn(fetcher, 'get').and.returnValue(new Promise(() => {}));
                    Runner.run(() => player.load());
                    video.emit('apiready');
                    video.emit('timeupdate', { time: 10 });
                    video.emit('playing');
                    video.emit('seeking');
                    spyOn(video, 'destroy');

                    Runner.run(() => player.unload());
                });

                it('should destroy the video', function() {
                    expect(video.destroy).toHaveBeenCalled();
                });

                it('should reset the state of the player', function() {
                    expect(player.readyState).toBe(0);
                    expect(player.currentTime).toBe(0);
                    expect(player.paused).toBe(true);
                    expect(player.seeking).toBe(false);
                });

                it('should remove the iframe', function() {
                    expect(Array.prototype.slice.call(player.element.childNodes)).not.toContain(iframe);
                });

                it('should cause load() to create a new video', function() {
                    spyOn(document, 'createElement').and.callThrough();
                    dailymotion.Player.calls.reset();

                    Runner.run(() => player.load());
                    expect(document.createElement).toHaveBeenCalledWith('iframe');
                    expect(dailymotion.Player).toHaveBeenCalledWith(iframe);
                });

                describe('if called again', function() {
                    beforeEach(function() {
                        video.destroy.calls.reset();
                        Runner.run(() => player.unload());
                    });

                    it('should do nothing', function() {
                        expect(video.destroy).not.toHaveBeenCalled();
                    });
                });
            });
        });

        describe('reload()', function() {
            beforeEach(function() {
                spyOn(player, 'unload');
                spyOn(player, 'load');

                player.reload();
            });

            it('should call unload() then load()', function() {
                expect(player.unload).toHaveBeenCalled();
                expect(player.load).toHaveBeenCalled();
            });
        });

        describe('minimize()', function() {
            it('should return an error', function() {
                expect(player.minimize()).toEqual(new Error('The video cannot be minimized.'));
            });
        });

        describe('load()', function() {
            beforeEach(function() {
                player.src = 'abc';
                player.controls = true;
                spyOn(player, 'create').and.callThrough();
                spyOn(player, 'unload').and.callThrough();
                spyOn(media, 'bestVideoFormat').and.returnValue('video/mp4');

                fetcher.expect('GET', `https://api.dailymotion.com/video/${player.src}?fields=duration`)
                    .respond(200, { duration: 44 });

                Runner.run(() => player.load());
            });

            it('should unload() itself', function() {
                expect(player.unload).toHaveBeenCalled();
            });

            it('should create a dailymotion.Player', function() {
                expect(dailymotion.Player).toHaveBeenCalledWith(jasmine.any(document.createElement('iframe').constructor));
            });

            it('should see if the browser can play mp4s', function() {
                expect(media.bestVideoFormat).toHaveBeenCalledWith(['video/mp4']);
            });

            it('should give the iframe a url', function() {
                expect(iframe.src).toBe(`${location.protocol}//www.dailymotion.com/embed/video/${player.src}?api=postMessage&id=${player.id}&related=0&chromeless=0&html`);
            });

            it('should give the iframe some attributes', function() {
                expect(iframe.getAttribute('width')).toBe('100%');
                expect(iframe.getAttribute('height')).toBe('100%');
                expect(iframe.getAttribute('frameborder')).toBe('0');
            });

            it('should create its element', function() {
                expect(player.create).toHaveBeenCalled();
            });

            it('should insert its iframe as a child', function() {
                expect(Array.prototype.slice.call(player.element.childNodes)).toContain(iframe);
            });

            describe('when the request to the vimeo API comes back', function() {
                let loadedmetadata;

                beforeEach(function(done) {
                    loadedmetadata = jasmine.createSpy('loadedmetadata()');
                    player.on('loadedmetadata', loadedmetadata);

                    fetcher.flush().then(() => {}).then(() => {}).then(() => {}).then(done, done);
                });

                it('should set the readyState to 1', function() {
                    expect(player.readyState).toBe(1);
                });

                it('should set the duration', function() {
                    expect(player.duration).toBe(44);
                });

                it('should emit "loadedmetadata"', function() {
                    expect(loadedmetadata).toHaveBeenCalled();
                });

                describe('if the player loads first', function() {
                    beforeEach(function(done) {
                        player = new DailymotionPlayer();
                        player.src = 'foo';

                        fetcher.expect('GET', `https://api.dailymotion.com/video/${player.src}?fields=duration`)
                            .respond(200, { duration: 44 });

                        Runner.run(() => player.load());

                        video.emit('apiready');
                        fetcher.flush().then(() => {}).then(() => {}).then(() => {}).then(done, done);
                    });

                    it('should not lower the readyState', function() {
                        expect(player.readyState).toBeGreaterThan(1);
                    });
                });
            });

            describe('when the video emits "apiready"', function() {
                let canplay;

                beforeEach(function() {
                    canplay = jasmine.createSpy('canplay()');
                    player.on('canplay', canplay);

                    video.emit('apiready');
                });

                it('should set the readyState to 3', function() {
                    expect(player.readyState).toBe(3);
                });

                it('should emit "canplay"', function() {
                    expect(canplay).toHaveBeenCalled();
                });
            });

            describe('when the player emits "timeupdate"', function() {
                let data;
                let timeupdate;

                beforeEach(function() {
                    timeupdate = jasmine.createSpy('timeupdate()');
                    player.on('timeupdate', timeupdate);

                    data = { time: 8.6 };

                    video.emit('timeupdate', data);
                });

                it('should set the currentTime', function() {
                    expect(player.currentTime).toBe(data.time);
                });

                it('should emit "timeupdate"', function() {
                    expect(timeupdate).toHaveBeenCalled();
                });
            });

            describe('when the player emits "durationchange"', function() {
                let durationchange;
                let data;

                beforeEach(function(done) {
                    durationchange = jasmine.createSpy('durationchange()');
                    player.on('durationchange', durationchange);

                    fetcher.flush().then(() => {}).then(() => {}).then(() => {}).then(done, done);
                });

                describe('if the duration is the same as what what the API returned', function() {
                    beforeEach(function() {
                        data = { duration: 44 };
                        video.emit('durationchange', data);
                    });

                    it('should do nothing', function() {
                        expect(durationchange).not.toHaveBeenCalled();
                    });
                });

                describe('if the duration is different than what was returned by the API', function() {
                    beforeEach(function() {
                        data = { duration: 45 };
                        video.emit('durationchange', data);
                    });

                    it('should update the duration', function() {
                        expect(player.duration).toBe(45);
                    });

                    it('should emit "durationchange"', function() {
                        expect(durationchange).toHaveBeenCalled();
                    });
                });
            });

            describe('when the player emits "ended"', function() {
                let ended;

                beforeEach(function() {
                    ended = jasmine.createSpy('ended()');
                    player.on('ended', ended);

                    video.emit('ended');
                });

                it('should set ended to true', function() {
                    expect(player.ended).toBe(true);
                });

                it('should emit ended', function() {
                    expect(ended).toHaveBeenCalled();
                });
            });

            describe('when the player emits "playing"', function() {
                let play;

                beforeEach(function() {
                    play = jasmine.createSpy('play()');
                    player.on('play', play);
                    video.emit('ended');

                    video.emit('playing');
                });

                it('should set paused to false', function() {
                    expect(player.paused).toBe(false);
                });

                it('should set ended to false', function() {
                    expect(player.ended).toBe(false);
                });

                it('should emit "play"', function() {
                    expect(play).toHaveBeenCalled();
                });
            });

            describe('when the player emits "pause"', function() {
                let pause;

                beforeEach(function() {
                    pause = jasmine.createSpy('pause()');
                    player.on('pause', pause);
                    video.emit('playing');

                    video.emit('pause');
                });

                it('should set paused to true', function() {
                    expect(player.paused).toBe(true);
                });

                it('should emit pause', function() {
                    expect(pause).toHaveBeenCalled();
                });
            });

            describe('when the player emits "seeking"', function() {
                let seeking;

                beforeEach(function() {
                    seeking = jasmine.createSpy('seeking()');
                    player.on('seeking', seeking);

                    video.emit('seeking');
                });

                it('should set seeking to true', function() {
                    expect(player.seeking).toBe(true);
                });

                it('should emit seeking', function() {
                    expect(seeking).toHaveBeenCalled();
                });
            });

            describe('when the player emits "seeked"', function() {
                let seeked;

                beforeEach(function() {
                    seeked = jasmine.createSpy('seeked()');
                    player.on('seeked', seeked);
                    video.emit('seeking');

                    video.emit('seeked');
                });

                it('should set seeking to false', function() {
                    expect(player.seeking).toBe(false);
                });

                it('should emit seeked', function() {
                    expect(seeked).toHaveBeenCalled();
                });
            });

            describe('when the player emits "volumechange"', function() {
                beforeEach(function() {
                    video.emit('volumechange', {
                        volume: 0.75,
                        muted: true
                    });
                });

                it('should set the volume and muted properties', function() {
                    expect(player.volume).toBe(0.75);
                    expect(player.muted).toBe(true);
                });
            });

            describe('if called again with the same src', function() {
                beforeEach(function() {
                    player.unload.calls.reset();
                    dailymotion.Player.calls.reset();
                    spyOn(document, 'createElement').and.callThrough();
                    player.create.calls.reset();

                    Runner.run(() => player.load());
                });

                it('should not unload the player', function() {
                    expect(player.unload).not.toHaveBeenCalled();
                });

                it('should not create a new iframe or player', function() {
                    expect(document.createElement).not.toHaveBeenCalled();
                    expect(dailymotion.Player).not.toHaveBeenCalled();
                });

                it('should not create its element again', function() {
                    expect(player.create).not.toHaveBeenCalled();
                });
            });

            describe('if called again with a different src', function() {
                beforeEach(function() {
                    player.unload.calls.reset();
                    dailymotion.Player.calls.reset();
                    spyOn(document, 'createElement').and.callThrough();
                    player.src = '123';
                    player.create.calls.reset();

                    fetcher.expect('GET', `https://api.dailymotion.com/video/${player.src}?fields=duration`)
                        .respond(200, { duration: 33 });

                    Runner.run(() => player.load());
                });

                it('should unload the player', function() {
                    expect(player.unload).toHaveBeenCalled();
                });

                it('should create a new iframe and player', function() {
                    expect(document.createElement).toHaveBeenCalledWith('iframe');
                    expect(dailymotion.Player).toHaveBeenCalledWith(iframe);
                });

                it('should not create its element again', function() {
                    expect(player.create).not.toHaveBeenCalled();
                });
            });

            describe('if controls is set to false', function() {
                beforeEach(function() {
                    player.controls = false;

                    fetcher.expect('GET', `https://api.dailymotion.com/video/${player.src}?fields=duration`)
                        .respond(200, { duration: 44 });

                    Runner.run(() => player.load());
                });

                it('should make the chromeless param 1', function() {
                    expect(iframe.src).toBe(`${location.protocol}//www.dailymotion.com/embed/video/${player.src}?api=postMessage&id=${player.id}&related=0&chromeless=1&html`);
                });
            });

            describe('if the browser can\'t play mp4s', function() {
                beforeEach(function() {
                    player = new DailymotionPlayer();
                    player.src = 'foo';
                    spyOn(fetcher, 'get').and.returnValue(new Promise(() => {}));
                    media.bestVideoFormat.and.returnValue(null);

                    Runner.run(() => player.load());
                });

                it('should not add the "html" param', function() {
                    expect(media.bestVideoFormat).toHaveBeenCalledWith(['video/mp4']);
                    expect(iframe.src).toBe(`${location.protocol}//www.dailymotion.com/embed/video/${player.src}?api=postMessage&id=${player.id}&related=0&chromeless=0`);
                });
            });
        });
    });

    describe('hooks:', function() {
        describe('didInsertElement()', function() {
            beforeEach(function() {
                spyOn(CorePlayer.prototype, 'didInsertElement').and.callThrough();
                spyOn(player, 'play');
            });

            describe('if autoplay is true', function() {
                beforeEach(function() {
                    player.autoplay = true;

                    player.didInsertElement();
                });

                it('should call play()', function() {
                    expect(player.play).toHaveBeenCalled();
                });

                it('should call super()', function() {
                    expect(CorePlayer.prototype.didInsertElement).toHaveBeenCalled();
                });
            });

            describe('if autoplay is false', function() {
                beforeEach(function() {
                    player.autoplay = false;

                    player.didInsertElement();
                });

                it('should not call play()', function() {
                    expect(player.play).not.toHaveBeenCalled();
                });

                it('should call super()', function() {
                    expect(CorePlayer.prototype.didInsertElement).toHaveBeenCalled();
                });
            });
        });
    });
});
