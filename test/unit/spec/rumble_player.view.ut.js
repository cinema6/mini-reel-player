import RumblePlayer from '../../../src/players/RumblePlayer.js';
import CorePlayer from '../../../src/players/CorePlayer.js';
import PlayerInterface from '../../../src/interfaces/PlayerInterface.js';
import rumble from '../../../src/services/rumble.js';
import Runner from '../../../lib/Runner.js';
import RunnerPromise from '../../../lib/RunnerPromise.js';
import {EventEmitter} from 'events';
import browser from '../../../src/services/browser.js';
import {
    defer
} from '../../../lib/utils.js';

describe('RumblePlayer', function() {
    let player;
    let ServicePlayer;
    let rumblePlayer;

    class MockRumbleServicePlayer extends EventEmitter {
        constructor(iframe) {
            var ready = false;

            expect(iframe.tagName).toBe('IFRAME');

            this.call = jasmine.createSpy('player.call()')
                .and.returnValue(new RunnerPromise(() => {}));
            this.destroy = jasmine.createSpy('player.destroy()');

            this.on('ready', function() {
                ready = true;
            });

            this.on('newListener', function(event) {
                if (event.search(
                    /^(newListener|ready)$/
                ) < 0 && !ready) {
                    throw new Error('Can\'t add and event listener: ' + event + ' before the player is ready.');
                }
            });

            rumblePlayer = this;
        }
    }

    beforeEach(function() {
        rumble.constructor();

        ServicePlayer = rumble.Player;
        spyOn(rumble, 'Player').and.callFake(iframe => {
            return new MockRumbleServicePlayer(iframe);
        });

        player = new RumblePlayer();
    });

    afterAll(function() {
        rumble.constructor();
    });

    it('should be a CorePlayer', function() {
        expect(player).toEqual(jasmine.any(CorePlayer));
    });

    it('should implement the PlayerInterface', function() {
        expect(player).toImplement(PlayerInterface);
    });

    describe('with a start/end time', function() {
        beforeEach(function(done) {
            player.start = 15; player.end = 30;
            Runner.run(() => player.load());

            rumblePlayer.call.and.returnValue(RunnerPromise.resolve(60));
            rumblePlayer.emit('ready');
            RunnerPromise.resolve().then(done, done);
        });

        describe('interface', function() {
            describe('duration', function() {
                it('should be the end time - the start time', function() {
                    expect(player.duration).toBe(15);
                });
            });

            describe('currentTime', function() {
                describe('setting', function() {
                    describe('below 0', function() {
                        beforeEach(function() {
                            player.currentTime = -3;
                        });

                        it('should seek to the start time', function() {
                            expect(rumblePlayer.call).toHaveBeenCalledWith('seekTo', 15);
                        });
                    });

                    describe('between 0 and the duration', function() {
                        beforeEach(function() {
                            player.currentTime = 7;
                        });

                        it('should take the start time into account', function() {
                            expect(rumblePlayer.call).toHaveBeenCalledWith('seekTo', 22);
                        });
                    });

                    describe('above the duration', function() {
                        beforeEach(function() {
                            player.currentTime = 20;
                        });

                        it('should seek to the end time', function() {
                            expect(rumblePlayer.call).toHaveBeenCalledWith('seekTo', 30);
                        });
                    });
                });
            });
        });

        describe('if the currentTime is in-between the start and end times', function() {
            it('should not seek or pause', function() {
                [15, 17, 19, 20, 22, 25, 27, 29.999].forEach(function(time) {
                    rumblePlayer.call.calls.reset();
                    rumblePlayer.emit('playProgress', {
                        seconds: time.toString()
                    });
                    expect(rumblePlayer.call).toHaveBeenCalledWith('getVolume');
                });
            });

            describe('interface', function() {
                describe('currentTime', function() {
                    it('should subtract the set start time', function() {
                        rumblePlayer.emit('playProgress', {
                            seconds: '15'
                        });
                        expect(player.currentTime).toBe(0);

                        rumblePlayer.emit('playProgress', {
                            seconds: '16'
                        });
                        expect(player.currentTime).toBe(1);

                        rumblePlayer.emit('playProgress', {
                            seconds: '19'
                        });
                        expect(player.currentTime).toBe(4);
                    });
                });
            });
        });

        describe('if the currentTime is less than the start time', function() {
            var timeupdate;

            beforeEach(function() {
                timeupdate = jasmine.createSpy('timeupdate');

                player.on('timeupdate', timeupdate);

                rumblePlayer.emit('playProgress', {
                    seconds: '0.99'
                });
            });

            it('should seek to the start time', function() {
                expect(rumblePlayer.call).toHaveBeenCalledWith('seekTo', 15);

                rumblePlayer.call.calls.reset();
                rumblePlayer.emit('playProgress', {
                    seconds: '3.22'
                });
                expect(rumblePlayer.call).toHaveBeenCalledWith('seekTo', 15);
            });

            it('should not emit "timeupdate"', function() {
                expect(timeupdate).not.toHaveBeenCalled();
            });

            describe('interface', function() {
                describe('currentTime', function() {
                    beforeEach(function() {
                        rumblePlayer.emit('playProgress', {
                            seconds: '20'
                        });
                    });

                    it('should be 0', function() {
                        rumblePlayer.emit('playProgress', {
                            seconds: '5'
                        });
                        expect(player.currentTime).toBe(0);

                        rumblePlayer.emit('playProgress', {
                            seconds: '14.9'
                        });
                        expect(player.currentTime).toBe(0);
                    });
                });
            });
        });

        describe('if the currentTime is greater than or equal to the end time', function() {
            var ended, timeupdate;

            beforeEach(function() {
                ended = jasmine.createSpy('ended()');
                timeupdate = jasmine.createSpy('timeupdate()');

                player.on('ended', ended)
                    .on('timeupdate', timeupdate);

                rumblePlayer.emit('playProgress', {
                    seconds: '30.14'
                });
            });

            it('should pause the player', function() {
                expect(rumblePlayer.call).toHaveBeenCalledWith('pause');
            });

            describe('the interface', function() {
                it('should emit "ended"', function() {
                    expect(ended).toHaveBeenCalled();
                });

                it('should not emit timeupdate', function() {
                    expect(timeupdate).not.toHaveBeenCalled();
                });

                describe('ended', function() {
                    it('should be true', function() {
                        expect(player.ended).toBe(true);
                    });
                });

                describe('currentTime', function() {
                    it('should be the duration', function() {
                        expect(player.currentTime).toBe(15);
                    });
                });
            });

            describe('the next time the video is played', function() {
                beforeEach(function() {
                    rumblePlayer.emit('play');
                });

                it('should seek to the start time', function() {
                    expect(rumblePlayer.call).toHaveBeenCalledWith('seekTo', 15);
                });
            });
        });
    });

    describe('events:', function() {
        beforeEach(function() {
            Runner.run(() => player.load());
        });

        describe('canplay', function() {
            beforeEach(function() {
                rumblePlayer.emit('ready');
            });

            it('should be emitted the first time the "loadProgress" event is emitted', function() {
                var canplay = jasmine.createSpy('canplay');

                player.on('canplay', canplay);

                rumblePlayer.emit('loadProgress', {});
                expect(canplay).toHaveBeenCalled();

                rumblePlayer.emit('loadProgress', {});
                expect(canplay.calls.count()).toBe(1);
            });
        });

        describe('canplaythrough', function() {
            beforeEach(function() {
                rumblePlayer.emit('ready');
            });

            it('should be emitted after the video buffers 25%', function() {
                var canplaythrough = jasmine.createSpy('canplaythrough');

                function loadProgress(percent) {
                    rumblePlayer.emit('loadProgress', {
                        percent: percent.toString()
                    });
                }

                player.on('canplaythrough', canplaythrough);

                loadProgress(0.01);
                loadProgress(0.1);
                loadProgress(0.15);
                loadProgress(0.2);
                expect(canplaythrough).not.toHaveBeenCalled();

                loadProgress(0.3);
                expect(canplaythrough).toHaveBeenCalled();

                loadProgress(0.5);
                expect(canplaythrough.calls.count()).toBe(1);
            });
        });

        describe('ended', function() {
            beforeEach(function() {
                rumblePlayer.emit('ready');
            });

            it('should be emitted when the player is finished', function() {
                var ended = jasmine.createSpy('ended');

                player.on('ended', ended);

                rumblePlayer.emit('finish');
                expect(ended).toHaveBeenCalled();
            });
        });

        describe('loadedmetadata', function() {
            let deferred;
            let loadedmetadata;

            beforeEach(function() {
                deferred = defer(RunnerPromise);
                rumblePlayer.call.and.returnValue(deferred.promise);

                loadedmetadata = jasmine.createSpy('loadedmetadata');
                player.on('loadedmetadata', loadedmetadata);

                rumblePlayer.emit('ready');
            });

            it('should be emitted when the player gets the duration', function(done) {
                expect(loadedmetadata).not.toHaveBeenCalled();

                deferred.fulfill(3);
                deferred.promise.then(() => {
                    expect(loadedmetadata).toHaveBeenCalled();
                }).then(done, done);
            });
        });

        describe('loadstart', function() {
            beforeEach(function() {
                rumblePlayer.emit('ready');
            });

            it('should be emitted once on the first "loadProgress" event', function() {
                var loadstart = jasmine.createSpy('loadstart');

                player.on('loadstart', loadstart);

                rumblePlayer.emit('loadProgress', {});
                expect(loadstart).toHaveBeenCalled();

                rumblePlayer.emit('loadProgress', {});
                expect(loadstart.calls.count()).toBe(1);
            });
        });

        describe('pause', function() {
            beforeEach(function() {
                rumblePlayer.emit('ready');
            });

            it('should be emitted on every "pause" event', function() {
                var pause = jasmine.createSpy('pause');

                player.on('pause', pause);

                rumblePlayer.emit('pause');
                expect(pause).toHaveBeenCalled();

                rumblePlayer.emit('pause');
                expect(pause.calls.count()).toBe(2);
            });
        });

        describe('play', function() {
            beforeEach(function() {
                rumblePlayer.emit('ready');
            });

            it('should be emitted on every play', function() {
                var play = jasmine.createSpy('play');

                player.on('play', play);

                rumblePlayer.emit('play');
                expect(play).toHaveBeenCalled();

                rumblePlayer.emit('play');
                expect(play.calls.count()).toBe(2);
            });
        });

        describe('progress', function() {
            beforeEach(function() {
                rumblePlayer.emit('ready');
            });

            it('should be emitted for every "loadProgress" event', function() {
                var progress = jasmine.createSpy('progress');

                player.on('progress', progress);

                rumblePlayer.emit('loadProgress', {});
                expect(progress).toHaveBeenCalled();

                rumblePlayer.emit('loadProgress', {});
                expect(progress.calls.count()).toBe(2);
            });
        });

        describe('seeked', function() {
            beforeEach(function() {
                rumblePlayer.emit('ready');
            });

            it('should be emitted when the video finishes seeking', function() {
                var seeked = jasmine.createSpy('seeked');

                player.on('seeked', seeked);

                rumblePlayer.emit('seek', {});
                expect(seeked).toHaveBeenCalled();

                rumblePlayer.emit('seek', {});
                expect(seeked.calls.count()).toBe(2);
            });
        });

        describe('seeking', function() {
            beforeEach(function() {
                rumblePlayer.emit('ready');
            });

            it('should be emitted when the video starts seeking', function() {
                var seeking = jasmine.createSpy('seeking');

                player.on('seeking', seeking);

                player.currentTime = 15;
                expect(seeking).toHaveBeenCalled();

                player.currentTime = 30;
                expect(seeking.calls.count()).toBe(2);
            });
        });

        describe('timeupdate', function() {
            beforeEach(function() {
                rumblePlayer.emit('ready');
            });

            it('should be emitted on every "playProgress" event', function() {
                var timeupdate = jasmine.createSpy('timeupdate');

                player.on('timeupdate', timeupdate);

                rumblePlayer.emit('playProgress', {});
                expect(timeupdate).toHaveBeenCalled();

                rumblePlayer.emit('playProgress', {});
                expect(timeupdate.calls.count()).toBe(2);
            });
        });
    });

    describe('properties:', function() {
        beforeEach(function() {
            Runner.run(() => player.load());
        });

        describe('autoplay', function() {
            it('should be false', function() {
                expect(player.autoplay).toBe(false);
            });
        });

        describe('buffered', function() {
            beforeEach(function() {
                rumblePlayer.emit('ready');
            });

            function loadProgress(percent) {
                rumblePlayer.emit('loadProgress', {
                    percent: percent.toString()
                });
            }

            describe('getting', function() {
                it('should be the percent of the video that is buffered', function() {
                    expect(player.buffered).toBe(0);

                    loadProgress(0.2);
                    expect(player.buffered).toBe(0.2);

                    loadProgress(0.35);
                    expect(player.buffered).toBe(0.35);

                    loadProgress(0.6);
                    expect(player.buffered).toBe(0.6);
                });
            });

            describe('setting', function() {
                it('should throw an error', function() {
                    expect(function() {
                        player.buffered = 0.5;
                    }).toThrow();
                });
            });
        });

        describe('currentTime', function() {
            beforeEach(function() {
                rumblePlayer.emit('ready');
            });

            function playProgress(time) {
                rumblePlayer.emit('playProgress', {
                    seconds: time.toString()
                });
            }

            describe('getting', function() {
                it('should be the most recent time for the video', function() {
                    expect(player.currentTime).toBe(0);

                    playProgress(4);
                    expect(player.currentTime).toBe(4);

                    playProgress(6.4);
                    expect(player.currentTime).toBe(6.4);

                    playProgress(100.2);
                    expect(player.currentTime).toBe(100.2);
                });
            });

            describe('setting', function() {
                it('should seek the player to the provided time', function() {
                    player.currentTime = 15;
                    expect(rumblePlayer.call).toHaveBeenCalledWith('seekTo', 15);

                    player.currentTime = 20.2;
                    expect(rumblePlayer.call).toHaveBeenCalledWith('seekTo', 20.2);

                    player.currentTime = 35;
                    expect(rumblePlayer.call).toHaveBeenCalledWith('seekTo', 35);
                });

                describe('before the player is loaded', function() {
                    beforeEach(function() {
                        player = new RumblePlayer();
                        player.currentTime = 10;
                    });

                    it('should set the currentTime', function() {
                        expect(player.currentTime).toBe(10);
                    });
                });
            });
        });

        describe('duration', function() {
            describe('getting', function() {
                var deferred;

                beforeEach(function() {
                    deferred = defer(RunnerPromise);

                    rumblePlayer.call.and.returnValue(deferred.promise);

                    rumblePlayer.emit('ready');
                });

                it('should be the result of a getDuration call', function(done) {
                    expect(rumblePlayer.call).toHaveBeenCalledWith('getDuration');

                    expect(player.duration).toBe(0);

                    deferred.fulfill(60);
                    deferred.promise.then(() => {
                        expect(player.duration).toBe(60);
                    }).then(done, done);
                });
            });

            describe('setting', function() {
                it('should throw an error', function() {
                    expect(function() {
                        player.duration = 10;
                    }).toThrow();
                });
            });
        });

        describe('end', function() {
            it('should be null', function() {
                expect(player.end).toBeNull();
            });
        });

        describe('ended', function() {
            beforeEach(function() {
                rumblePlayer.emit('ready');
            });

            describe('getting', function() {
                it('should be true when the video has ended, and be false when it plays again', function() {
                    expect(player.ended).toBe(false);

                    rumblePlayer.emit('finish');
                    expect(player.ended).toBe(true);

                    rumblePlayer.emit('play');
                    expect(player.ended).toBe(false);

                    rumblePlayer.emit('finish');
                    expect(player.ended).toBe(true);
                });
            });

            describe('setting', function() {
                it('should throw an error', function() {
                    expect(function() {
                        player.ended = true;
                    }).toThrow();
                });
            });
        });

        describe('muted', function(){
            describe('getting', function() {
                it('should be true when the volume is 0', function(done) {
                    rumblePlayer.call.and.returnValue(RunnerPromise.resolve(0));
                    rumblePlayer.emit('ready');
                    rumblePlayer.call('foo').then(() => {
                        expect(player.volume).toBe(0);
                        expect(player.muted).toBe(true);
                        done();
                    });
                });

                it('should be false when the volume is > 0', function(done) {
                    rumblePlayer.call.and.returnValue(RunnerPromise.resolve(0.5));
                    rumblePlayer.emit('ready');
                    rumblePlayer.call('foo').then(() => {
                        expect(player.volume).toBe(0.5);
                        expect(player.muted).toBe(false);
                        done();
                    });
                });
            });

            describe('setting', function() {
                it('should throw an error', function() {
                    rumblePlayer.emit('ready');
                    expect(function() {
                        player.muted = true;
                    }).toThrow();
                });
            });
        });

        describe('paused', function() {
            beforeEach(function() {
                rumblePlayer.emit('ready');
            });

            describe('getting', function() {
                it('should be true when the video is paused', function() {
                    expect(player.paused).toBe(true);

                    rumblePlayer.emit('play');
                    expect(player.paused).toBe(false);

                    rumblePlayer.emit('pause');
                    expect(player.paused).toBe(true);
                });
            });

            describe('setting', function() {
                it('should throw an error', function() {
                    expect(function() {
                        player.paused = true;
                    }).toThrow();
                });
            });
        });

        describe('readyState', function() {
            describe('getting', function() {
                it('should start as 0', function() {
                    expect(player.readyState).toBe(0);
                });

                it('should be 1 when the duration is fetched', function(done) {
                    var deferred = defer(RunnerPromise);

                    rumblePlayer.call.and.returnValue(deferred.promise);
                    rumblePlayer.emit('ready');
                    deferred.fulfill(45);

                    deferred.promise.then(() => {
                        expect(player.readyState).toBe(1);
                    }).then(done, done);
                });

                it('should be 3 on the first loadProgress event', function() {
                    rumblePlayer.emit('ready');
                    rumblePlayer.emit('loadProgress', {});

                    expect(player.readyState).toBe(3);
                });

                it('should be 4 when the video is 25% buffered', function() {
                    function loadProgress(percent) {
                        rumblePlayer.emit('loadProgress', {
                            percent: percent.toString()
                        });
                    }

                    rumblePlayer.emit('ready');

                    loadProgress(0.1);
                    loadProgress(0.2);
                    loadProgress(0.24);
                    expect(player.readyState).not.toBe(4);
                    loadProgress(0.25);
                    expect(player.readyState).toBe(4);
                });
            });

            describe('setting', function() {
                it('should throw an error', function() {
                    expect(function() {
                        player.readyState = 5;
                    }).toThrow();
                });
            });
        });

        describe('seeking', function() {
            beforeEach(function() {
                rumblePlayer.emit('ready');
            });

            describe('getting', function() {
                it('should be true when a seek is in progress', function() {
                    expect(player.seeking).toBe(false);

                    player.currentTime = 10;
                    expect(player.seeking).toBe(true);

                    rumblePlayer.emit('seek', {});
                    expect(player.seeking).toBe(false);

                    player.currentTime = 20;
                    expect(player.seeking).toBe(true);

                    rumblePlayer.emit('seek');
                    expect(player.seeking).toBe(false);
                });
            });

            describe('setting', function() {
                it('should throw an error', function() {
                    expect(function() {
                        player.seeking = true;
                    }).toThrow();
                });
            });
        });

        describe('src', function() {
            it('should be null', function() {
                expect(player.src).toBeNull();
            });

            it('should be settable', function() {
                player.src = 'foo';
                expect(player.src).toBe('foo');
            });

            describe('when set the first time', function() {
                beforeEach(function() {
                    spyOn(player, 'unload').and.callThrough();
                    player.src = '675438';
                });

                describe('when load() is called', function() {
                    beforeEach(function() {
                        Runner.run(() => player.load());
                    });

                    it('should not unload the player', function() {
                        expect(player.unload).not.toHaveBeenCalled();
                    });
                });
            });

            describe('when set the second time', function() {
                beforeEach(function() {
                    player.src = '12345';
                    Runner.run(() => player.load());

                    spyOn(player, 'unload').and.callThrough();
                    spyOn(document, 'createElement').and.callThrough();

                    player.src = '54321';
                });

                describe('when load() is called', function() {
                    beforeEach(function() {
                        Runner.run(() => player.load());
                    });

                    it('should unload the player', function() {
                        expect(player.unload).toHaveBeenCalled();
                    });

                    it('should start a new load', function() {
                        expect(document.createElement).toHaveBeenCalledWith('iframe');
                    });
                });

                describe('if set to the same thing', function() {
                    beforeEach(function() {
                        Runner.run(() => player.load());
                        player.unload.calls.reset();

                        player.src = '54321';
                    });

                    describe('when load() is called', function() {
                        beforeEach(function() {
                            Runner.run(() => player.load());
                        });

                        it('should not unload() the player', function() {
                            expect(player.unload).not.toHaveBeenCalled();
                        });
                    });
                });
            });
        });

        describe('start', function() {
            it('should be null', function() {
                expect(player.start).toBeNull();
            });
        });

        describe('error', function() {
            describe('getting', function() {
                it('should be null', function() {
                    expect(player.error).toBeNull();
                });
            });

            describe('setting', function() {
                it('should throw an error', function() {
                    expect(function() {
                        player.error = 'sdfh942';
                    }).toThrow();
                });
            });
        });
    });

    describe('methods:', function() {
        describe('pause()', function() {
            describe('if the player has not been loaded', function() {
                it('should do nothing', function() {
                    expect(function() {
                        player.pause();
                    }).not.toThrow();
                });
            });

            describe('if the player has been loaded', function() {
                beforeEach(function() {
                    Runner.run(() => player.load());
                });

                describe('before the player is ready', function() {
                    beforeEach(function() {
                        player.pause();
                    });

                    it('should not call any methods', function() {
                        expect(rumblePlayer.call).not.toHaveBeenCalledWith('pause');
                    });
                });

                describe('after the player is ready', function() {
                    beforeEach(function() {
                        rumblePlayer.emit('ready');
                        player.pause();
                    });

                    it('should call pause on the player', function() {
                        expect(rumblePlayer.call).toHaveBeenCalledWith('pause');
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
            });

            describe('if the player has not been loaded', function() {
                beforeEach(function() {
                    Runner.run(() => player.play());
                });

                it('should load the player', function() {
                    expect(player.load).toHaveBeenCalled();
                });

                it('should not play the player', function() {
                    expect(rumblePlayer.call).not.toHaveBeenCalledWith('play');
                });

                describe('when the player is ready', function() {
                    describe('if the device can\'t autoplay', function() {
                        beforeEach(function(done) {
                            spyOn(browser, 'test').and.returnValue(Promise.resolve(false));
                            rumblePlayer.emit('ready');
                            expect(browser.test).toHaveBeenCalledWith('autoplay');
                            browser.test().then(done, done);
                        });

                        it('should not play the video', function() {
                            expect(rumblePlayer.call).not.toHaveBeenCalledWith('play');
                        });

                        it('should not emit "attemptPlay"', function() {
                            expect(attemptPlay).not.toHaveBeenCalled();
                        });

                        describe('after the video has played once', function() {
                            beforeEach(function() {
                                rumblePlayer.emit('play');
                                browser.test.calls.reset();
                                Runner.run(() => player.play());
                            });

                            it('should not check if the browser can autoplay', function() {
                                expect(browser.test).not.toHaveBeenCalled();
                            });

                            it('should play the video', function() {
                                expect(rumblePlayer.call).toHaveBeenCalledWith('play');
                            });

                            it('should emit "attemptPlay"', function() {
                                expect(attemptPlay).toHaveBeenCalled();
                            });
                        });
                    });

                    describe('if the device can autoplay', function() {
                        beforeEach(function(done) {
                            spyOn(browser, 'test').and.returnValue(Promise.resolve(true));
                            rumblePlayer.emit('ready');
                            expect(browser.test).toHaveBeenCalledWith('autoplay');
                            browser.test().then(done, done);
                        });

                        it('should play the video', function() {
                            expect(rumblePlayer.call).toHaveBeenCalledWith('play');
                        });

                        it('should emit "attemptPlay"', function() {
                            expect(attemptPlay).toHaveBeenCalled();
                        });
                    });
                });
            });

            describe('if the player is ready', function() {
                beforeEach(function() {
                    Runner.run(() => player.load());
                    spyOn(rumblePlayer, 'once').and.callThrough();
                    rumblePlayer.emit('ready');
                });

                describe('if the device can\'t autoplay', function() {
                    beforeEach(function(done) {
                        spyOn(browser, 'test').and.returnValue(Promise.resolve(false));
                        Runner.run(() => player.play());
                        expect(browser.test).toHaveBeenCalledWith('autoplay');
                        browser.test().then(done, done);
                    });

                    it('should not listen for the ready event', function() {
                        expect(rumblePlayer.once).not.toHaveBeenCalledWith('ready', jasmine.any(Function));
                    });

                    it('should not play the video', function() {
                        expect(rumblePlayer.call).not.toHaveBeenCalledWith('play');
                    });

                    it('should not emit "attemptPlay"', function() {
                        expect(attemptPlay).not.toHaveBeenCalled();
                    });

                    describe('after the video has played once', function() {
                        beforeEach(function() {
                            rumblePlayer.emit('play');
                            browser.test.calls.reset();
                            Runner.run(() => player.play());
                        });

                        it('should not check if the browser can autoplay', function() {
                            expect(browser.test).not.toHaveBeenCalled();
                        });

                        it('should play the video', function() {
                            expect(rumblePlayer.call).toHaveBeenCalledWith('play');
                        });

                        it('should emit "attemptPlay"', function() {
                            expect(attemptPlay).toHaveBeenCalled();
                        });
                    });
                });

                describe('if the device can autoplay', function() {
                    beforeEach(function(done) {
                        spyOn(browser, 'test').and.returnValue(Promise.resolve(true));
                        Runner.run(() => player.play());
                        expect(browser.test).toHaveBeenCalledWith('autoplay');
                        browser.test().then(done, done);
                    });

                    it('should not listen for the ready event', function() {
                        expect(rumblePlayer.once).not.toHaveBeenCalledWith('ready', jasmine.any(Function));
                    });

                    it('should play the video', function() {
                        expect(rumblePlayer.call).toHaveBeenCalledWith('play');
                    });

                    it('should emit "attemptPlay"', function() {
                        expect(attemptPlay).toHaveBeenCalled();
                    });
                });
            });
        });

        describe('load()', function() {
            beforeEach(function() {
                player.src = 'abc123';
                Runner.run(() => player.load());
            });

            it('should create a rumble iframe', function() {
                const iframes = player.element.querySelectorAll('iframe');
                const iframe = iframes[0];

                expect(iframes.length).toBe(1);
                expect(iframe.src).toBe(`${location.protocol}//rumble.com/embed/${player.src}/?api=1&player_id=${player.id}`);
                expect(iframe.getAttribute('width')).toBe('100%');
                expect(iframe.getAttribute('height')).toBe('100%');
                expect(iframe.getAttribute('frameborder')).toBe('0');
                expect(iframe.getAttribute('webkitAllowFullScreen')).toBe('');
                expect(iframe.getAttribute('mozallowfullscreen')).toBe('');
                expect(iframe.getAttribute('allowFullScreen')).toBe('');
            });

            it('should create a rumble player', function() {
                expect(rumble.Player).toHaveBeenCalledWith(player.element.querySelector('iframe'));
            });

            describe('if called again', function() {
                beforeEach(function() {
                    spyOn(player, 'create').and.callThrough();
                    Runner.run(() => player.load());
                });

                it('should not create the element again', function() {
                    expect(player.create).not.toHaveBeenCalled();
                });

                it('should not create the iframe again', function() {
                    expect(player.element.querySelectorAll('iframe').length).toBe(1);
                });
            });
        });

        describe('unload()', function() {
            beforeEach(function() {
                player.src = 'foo';
            });

            describe('if the player has not been loaded yet', function() {
                it('should do nothing', function() {
                    expect(function() {
                        player.unload();
                    }).not.toThrow();
                });
            });

            describe('if the player has been loaded', function() {
                beforeEach(function() {
                    Runner.run(() => player.load());
                    rumblePlayer.emit('ready');
                    rumblePlayer.emit('loadProgress', { percent: '0.3' });
                    rumblePlayer.emit('play');
                    rumblePlayer.emit('finish');
                    player.unload();
                });

                it('should destroy the player', function() {
                    expect(rumblePlayer.destroy).toHaveBeenCalled();
                });

                it('should remove the iframe', function() {
                    expect(player.element.querySelector('iframe')).toBeNull();
                });

                it('should reset the player state', function() {
                    expect(player.readyState).toBe(0);
                    expect(player.paused).toBe(true);
                    expect(player.ended).toBe(false);
                });

                it('should not change the src', function() {
                    expect(player.src).not.toBeNull();
                });

                describe('when the player is loaded again', function() {
                    beforeEach(function() {
                        spyOn(document, 'createElement').and.callThrough();
                        rumble.Player.calls.reset();

                        Runner.run(() => player.load());
                    });

                    it('should create a new iframe', function() {
                        expect(document.createElement).toHaveBeenCalledWith('iframe');
                    });

                    it('should create a new player', function() {
                        expect(rumble.Player).toHaveBeenCalledWith(player.element.querySelector('iframe'));
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

            it('should unload() then load() the player', function() {
                expect(player.unload).toHaveBeenCalled();
                expect(player.load).toHaveBeenCalled();
            });
        });

        describe('minimize()', function() {
            let result;

            beforeEach(function() {
                result = player.minimize();
            });

            it('should return an Error', function() {
                expect(result).toEqual(jasmine.any(Error));
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

                it('should not call play()', function() {
                    expect(player.play).not.toHaveBeenCalled();
                });
            });

            describe('if autoplay is false', function() {
                beforeEach(function() {
                    player.autoplay = true;
                    player.didInsertElement();
                });

                it('should call play()', function() {
                    expect(player.play).toHaveBeenCalled();
                });
            });
        });
    });
});
