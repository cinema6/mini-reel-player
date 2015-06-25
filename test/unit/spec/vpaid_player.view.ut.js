import VPAIDPlayer from '../../../src/players/VPAIDPlayer.js';
import CorePlayer from '../../../src/players/CorePlayer.js';
import iab from '../../../src/services/iab.js';
import { EventEmitter } from 'events';
import Runner from '../../../lib/Runner.js';
import RunnerPromise from '../../../lib/RunnerPromise.js';
import PlayerInterface from '../../../src/interfaces/PlayerInterface.js';
import {
    defer
} from '../../../lib/utils.js';

let intervals = [];

describe('VPAIDPlayer', function() {
    let player;
    let vpaid;
    let loadDeferred;

    class MockVPAIDPlayer extends EventEmitter {
        constructor() {
            super();

            this.load = jasmine.createSpy('vpaid.load()').and.returnValue(loadDeferred.promise);
            this.initAd = jasmine.createSpy('vpaid.initAd()');
            this.startAd = jasmine.createSpy('vpaid.startAd()');
            this.pauseAd = jasmine.createSpy('vpaid.pauseAd()');
            this.resumeAd = jasmine.createSpy('vpaid.resumeAd()');
            this.stopAd = jasmine.createSpy('vpaid.stopAd()');
            this.adBanners = undefined;
        }
    }

    beforeEach(function() {
        spyOn(CorePlayer.prototype, 'addClass');
        jasmine.clock().install();
        const setInterval = global.setInterval;
        spyOn(global, 'setInterval').and.callFake(function(...args) {
            const id = setInterval.call(global, ...args);
            intervals.push(id);
            return id;
        });
        loadDeferred = defer(RunnerPromise);

        spyOn(iab, 'VPAIDPlayer').and.callFake(tag => {
            return (vpaid = new MockVPAIDPlayer(tag));
        });

        player = new VPAIDPlayer();
    });

    afterEach(function() {
        let id;
        while ((id = intervals.shift()) !== undefined) {
            global.clearInterval(id);
        }
        [1000, 1000, 1000].forEach(time => jasmine.clock().tick(time));
        jasmine.clock().uninstall();
        vpaid = undefined;
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

            it('should not be settable', function() {
                expect(() => player.currentTime = 1).toThrow();
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

        describe('ended', function() {
            it('should be false', function() {
                expect(player.ended).toBe(false);
            });

            it('should not be settable', function() {
                expect(() => player.ended = true).toThrow();
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

        describe('seeking', function() {
            it('should be false', function() {
                expect(player.seeking).toBe(false);
            });

            it('should not be settable', function() {
                expect(() => player.seeking = true).toThrow();
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

        describe('volume', function() {
            describe('getting', function() {
                describe('if the player has not been loaded', function() {
                    it('should be 1', function() {
                        expect(player.volume).toBe(1);
                    });
                });

                describe('if the player has been loaded', function() {
                    beforeEach(function() {
                        player.src = 'foo';
                        Runner.run(() => player.load());
                    });

                    [undefined, null].forEach(value => {
                        describe(`if the adVolume is ${value}`, function() {
                            beforeEach(function() {
                                vpaid.adVolume = value;
                            });

                            it('should be 1', function() {
                                expect(player.volume).toBe(1);
                            });
                        });
                    });

                    describe('if the adVolume is a number', function() {
                        beforeEach(function() {
                            vpaid.adVolume = 0;
                        });

                        it('should be that number', function() {
                            expect(player.volume).toBe(vpaid.adVolume);
                        });
                    });
                });
            });

            describe('setting', function() {
                describe('if the player has not been loaded', function() {
                    beforeEach(function() {
                        player.volume = 0.5;
                    });

                    it('should do nothing', function() {
                        expect(player.volume).toBe(1);
                    });
                });

                describe('if the player has been loaded', function() {
                    let adVolumeSetter;

                    beforeEach(function() {
                        player.src = 'foo';
                        Runner.run(() => player.load());

                        Object.defineProperty(vpaid, 'adVolume', {
                            get: () => 0.44,
                            set: (adVolumeSetter = jasmine.createSpy('adVolumeSetter()'))
                        });
                    });

                    describe('if setting the player\'s adVolume throws an error', function() {
                        beforeEach(function() {
                            adVolumeSetter.and.throwError(new Error('No can-do!'));

                            player.volume = 0.3;
                        });

                        it('should set the volume', function() {
                            expect(adVolumeSetter).toHaveBeenCalledWith(0.3);
                        });
                    });

                    describe('if setting the player\'s adVolume does not throw an error', function() {
                        beforeEach(function() {
                            player.volume = 0.3;
                        });

                        it('should set the volume', function() {
                            expect(adVolumeSetter).toHaveBeenCalledWith(0.3);
                        });
                    });
                });
            });
        });

        describe('src', function() {
            it('should be null', function() {
                expect(player.src).toBeNull();
            });
        });

        describe('autoplay', function() {
            it('should be false', function() {
                expect(player.autoplay).toBe(false);
            });
        });

        describe('controls', function() {
            it('should be false', function() {
                expect(player.controls).toBe(false);
            });
        });
    });

    describe('methods:', function() {
        describe('load()', function() {
            beforeEach(function() {
                spyOn(player, 'create').and.callThrough();
                spyOn(player, 'unload').and.callThrough();
                player.src = `http://u-ads.adap.tv/a/h/DCQzzI0K2rv1k0TZythPvYyD60pQS_90o8grI6Qm2PI=?cb=${Date.now()}&pageUrl=${encodeURIComponent(location.href)}&eov=eov`;

                Runner.run(() => player.load());
            });

            it('should create its element', function() {
                expect(player.create).toHaveBeenCalled();
            });

            it('should unload itself', function() {
                expect(player.unload).toHaveBeenCalled();
            });

            it('should create an iab.VPAIDPlayer()', function() {
                expect(iab.VPAIDPlayer).toHaveBeenCalledWith(player.src);
            });

            it('should load the player into its element', function() {
                expect(vpaid.load).toHaveBeenCalledWith(player.element);
            });

            describe('when the load is complete', function() {
                beforeEach(function() {
                    loadDeferred.fulfill(vpaid);
                    jasmine.clock().tick(1);
                });

                it('should call initAd()', function() {
                    expect(vpaid.initAd).toHaveBeenCalled();
                });
            });

            describe('when "AdLoaded" is emitted', function() {
                let canplay;
                let loadedmetadata;
                let timeupdate;

                beforeEach(function() {
                    canplay = jasmine.createSpy('canplay()');
                    player.on('canplay', canplay);

                    loadedmetadata = jasmine.createSpy('loadedmetadata()');
                    player.on('loadedmetadata', loadedmetadata);

                    timeupdate = jasmine.createSpy('timeupdate()');
                    player.on('timeupdate', timeupdate);

                    vpaid.emit('AdLoaded');
                });

                it('should emit "canplay"', function() {
                    expect(canplay).toHaveBeenCalled();
                });

                it('should set the readyState to 3', function() {
                    expect(player.readyState).toBe(3);
                });

                it('should emit "loadedmetadata" and set the duration when the duration is present', function() {
                    jasmine.clock().tick(250);
                    expect(loadedmetadata).not.toHaveBeenCalled();
                    expect(player.duration).toBe(0);

                    vpaid.adDuration = null;
                    jasmine.clock().tick(250);
                    expect(loadedmetadata).not.toHaveBeenCalled();
                    expect(player.duration).toBe(0);

                    vpaid.adDuration = -2;
                    jasmine.clock().tick(250);
                    expect(loadedmetadata).not.toHaveBeenCalled();
                    expect(player.duration).toBe(0);

                    vpaid.adDuration = 30;
                    jasmine.clock().tick(250);
                    expect(loadedmetadata).toHaveBeenCalled();
                    expect(player.duration).toBe(30);

                    loadedmetadata.calls.reset();
                    jasmine.clock().tick(250);
                    expect(loadedmetadata).not.toHaveBeenCalled();
                    expect(player.duration).toBe(30);

                    vpaid.adDuration = 35;
                    jasmine.clock().tick(250);
                    expect(loadedmetadata).not.toHaveBeenCalled();
                    expect(player.duration).toBe(35);
                });

                it('should emit "timeupdate" and set the currentTime whenever the adCurrentTime changes', function() {
                    jasmine.clock().tick(250);
                    expect(timeupdate).not.toHaveBeenCalled();
                    expect(player.currentTime).toBe(0);

                    vpaid.adCurrentTime = null;
                    jasmine.clock().tick(250);
                    expect(timeupdate).not.toHaveBeenCalled();
                    expect(player.currentTime).toBe(0);

                    vpaid.adCurrentTime = 2;
                    jasmine.clock().tick(250);
                    expect(timeupdate).toHaveBeenCalled();
                    expect(player.currentTime).toBe(2);

                    timeupdate.calls.reset();
                    jasmine.clock().tick(250);
                    expect(timeupdate).not.toHaveBeenCalled();
                    expect(player.currentTime).toBe(2);

                    vpaid.adCurrentTime = 4;
                    jasmine.clock().tick(250);
                    expect(timeupdate).toHaveBeenCalled();
                    expect(player.currentTime).toBe(4);
                });

                describe('player events:', function() {
                    ['AdStarted', 'AdVideoStart', 'AdPlaying'].forEach(event => {
                        describe(event, function() {
                            let play;

                            beforeEach(function() {
                                play = jasmine.createSpy('play()');
                                player.on('play', play);
                                vpaid.emit('AdStopped');

                                vpaid.emit(event);
                            });

                            it('should emit "play"', function() {
                                expect(play).toHaveBeenCalled();
                            });

                            it('should set paused to false', function() {
                                expect(player.paused).toBe(false);
                            });

                            it('should set ended to false', function() {
                                expect(player.ended).toBe(false);
                            });

                            describe('if emitted again', function() {
                                beforeEach(function() {
                                    play.calls.reset();

                                    vpaid.emit(event);
                                });

                                it('should not emit "play" again', function() {
                                    expect(play).not.toHaveBeenCalled();
                                });
                            });
                        });
                    });

                    describe('AdPaused', function() {
                        let pause;

                        beforeEach(function() {
                            pause = jasmine.createSpy('pause()');
                            player.on('pause', pause);
                            vpaid.emit('AdPlaying');

                            vpaid.emit('AdPaused');
                        });

                        it('should emit "pause"', function() {
                            expect(pause).toHaveBeenCalled();
                        });

                        it('should set paused to true', function() {
                            expect(player.paused).toBe(true);
                        });
                    });

                    describe('displayBanners', function() {
                        let companionsReady;

                        beforeEach(function() {
                            companionsReady = jasmine.createSpy('companionsReady()');
                            player.on('companionsReady', companionsReady);

                            vpaid.emit('displayBanners');
                        });

                        it('should emit "companionsReady"', function() {
                            expect(companionsReady).toHaveBeenCalled();
                        });
                    });

                    ['AdStopped', 'AdVideoComplete'].forEach(event => {
                        describe(event, function() {
                            let ended;

                            beforeEach(function() {
                                ended = jasmine.createSpy('ended()');
                                player.on('ended', ended);
                                Object.defineProperty(vpaid, 'adCurrentTime', {
                                    configurable: true,
                                    get: () => { throw new Error('I am slain! (1)'); }
                                });
                                player.unload.and.callThrough();
                                player.unload.calls.reset();
                                vpaid.stopAd.and.throwError(new Error('I ALREADY STOPPED YA DOPE!'));

                                vpaid.emit(event);
                            });

                            it('should emit "ended"', function() {
                                expect(ended).toHaveBeenCalled();
                            });

                            it('should set ended to true', function() {
                                expect(player.ended).toBe(true);
                            });

                            it('should cancel the interval', function() {
                                expect(() => jasmine.clock().tick(250)).not.toThrow();
                            });

                            it('should reset the state of the player', function() {
                                expect(player.readyState).toBe(0);
                            });

                            describe('if called again', function() {
                                beforeEach(function() {
                                    ended.calls.reset();

                                    vpaid.emit(event);
                                });

                                it('should not emit "ended"', function() {
                                    expect(ended).not.toHaveBeenCalled();
                                });
                            });
                        });
                    });

                    describe('AdError', function() {
                        let error;

                        beforeEach(function() {
                            error = jasmine.createSpy('error()');
                            player.on('error', error);
                            Object.defineProperty(vpaid, 'adCurrentTime', {
                                configurable: true,
                                get: () => { throw new Error('I am slain! (2)'); }
                            });

                            vpaid.emit('AdError');
                        });

                        it('should emit "error"', function() {
                            expect(error).toHaveBeenCalled();
                        });

                        it('should cancel the interval', function() {
                            expect(() => jasmine.clock().tick(250)).not.toThrow();
                        });
                    });
                });
            });

            describe('if called again and the src is the same', function() {
                beforeEach(function() {
                    player.create.calls.reset();
                    player.unload.calls.reset();
                    iab.VPAIDPlayer.calls.reset();

                    Runner.run(() => player.load());
                });

                it('should not create() the element', function() {
                    expect(player.create).not.toHaveBeenCalled();
                });

                it('should not unload() itself', function() {
                    expect(player.unload).not.toHaveBeenCalled();
                });

                it('should not create a new iab.VPAIDPlayer', function() {
                    expect(iab.VPAIDPlayer).not.toHaveBeenCalled();
                });
            });

            describe('if called again and the src has changed', function() {
                beforeEach(function() {
                    player.create.calls.reset();
                    player.unload.calls.reset();
                    iab.VPAIDPlayer.calls.reset();
                    Object.defineProperty(vpaid, 'adCurrentTime', {
                        configurable: true,
                        get: () => { throw new Error('I am slain! (3)'); }
                    });
                    loadDeferred.fulfill(vpaid);
                    jasmine.clock().tick(1);
                    vpaid.emit('AdLoaded');

                    player.src = 'tag.com/ieofnvo4f';
                    Runner.run(() => player.load());
                });

                it('should not create() the element', function() {
                    expect(player.create).not.toHaveBeenCalled();
                });

                it('should unload() itself', function() {
                    expect(player.unload).toHaveBeenCalled();
                });

                it('should create a new vpaid player', function() {
                    expect(iab.VPAIDPlayer).toHaveBeenCalled();
                });

                it('should clear the interval on the old player', function() {
                    expect(() => jasmine.clock().tick(250)).not.toThrow();
                });
            });
        });

        describe('play()', function() {
            let attemptPlay;

            beforeEach(function() {
                jasmine.clock().tick(1000);

                attemptPlay = jasmine.createSpy('attemptPlay()');
                player.on('attemptPlay', attemptPlay);

                player.src = 'hey!';
                spyOn(player, 'load').and.callThrough();
            });

            describe('if the player has not been loaded()', function() {
                beforeEach(function() {
                    Runner.run(() => player.play());
                });

                it('should emit "attemptPlay"', function() {
                    expect(attemptPlay).toHaveBeenCalled();
                });

                it('should load the player', function() {
                    expect(player.load).toHaveBeenCalled();
                });

                it('should not start or resume the ad', function() {
                    expect(vpaid.startAd).not.toHaveBeenCalled();
                    expect(vpaid.resumeAd).not.toHaveBeenCalled();
                });

                describe('when the player is ready', function() {
                    beforeEach(function() {
                        player.emit('canplay');
                    });

                    it('should start the ad', function() {
                        expect(vpaid.startAd).toHaveBeenCalled();
                        expect(vpaid.resumeAd).not.toHaveBeenCalled();
                    });
                });
            });

            describe('if the player is fully loaded', function() {
                beforeEach(function() {
                    Runner.run(() => player.load());
                    loadDeferred.fulfill(vpaid);
                    jasmine.clock().tick(1);
                    vpaid.emit('AdLoaded');

                    Runner.run(() => player.play());
                });

                it('should emit "attemptPlay"', function() {
                    expect(attemptPlay).toHaveBeenCalled();
                });

                it('should load the player', function() {
                    expect(player.load).toHaveBeenCalled();
                });

                it('should start the ad', function() {
                    expect(vpaid.startAd).toHaveBeenCalled();
                    expect(vpaid.resumeAd).not.toHaveBeenCalled();
                });
            });

            describe('if the player has already started the ad', function() {
                beforeEach(function() {
                    Runner.run(() => player.load());
                    loadDeferred.fulfill(vpaid);
                    jasmine.clock().tick(1);
                    vpaid.emit('AdLoaded');
                    vpaid.emit('AdStarted');

                    Runner.run(() => player.play());
                });

                it('should emit "attemptPlay"', function() {
                    expect(attemptPlay).toHaveBeenCalled();
                });

                it('should resume the ad', function() {
                    expect(vpaid.resumeAd).toHaveBeenCalled();
                    expect(vpaid.startAd).not.toHaveBeenCalled();
                });
            });
        });

        describe('pause()', function() {
            beforeEach(function() {
                player.src = 'someting';
            });

            describe('if the player was never loaded', function() {
                let error;

                beforeEach(function() {
                    try { Runner.run(() => player.pause()); } catch (e) { error = e; }
                });

                it('should do nothing', function() {
                    expect(error).not.toEqual(jasmine.any(Error));
                });

                describe('when the player is fully loaded', function() {
                    beforeEach(function() {
                        Runner.run(() => player.load());
                        loadDeferred.fulfill(vpaid);
                        jasmine.clock().tick(1);
                        vpaid.emit('AdLoaded');
                    });

                    it('should not call pauseAd()', function() {
                        expect(vpaid.pauseAd).not.toHaveBeenCalled();
                    });
                });
            });

            describe('if the player was loaded', function() {
                beforeEach(function() {
                    Runner.run(() => player.load());
                    Runner.run(() => player.pause());
                });

                it('should not call pauseAd()', function() {
                    expect(vpaid.pauseAd).not.toHaveBeenCalled();
                });

                describe('when the player is ready', function() {
                    beforeEach(function() {
                        loadDeferred.fulfill(vpaid);
                        jasmine.clock().tick(1);
                        vpaid.emit('AdLoaded');
                    });

                    it('should call pauseAd()', function() {
                        expect(vpaid.pauseAd).toHaveBeenCalled();
                    });
                });
            });

            describe('if the player was loaded and ready', function() {
                beforeEach(function() {
                    Runner.run(() => player.load());
                    loadDeferred.fulfill(vpaid);
                    jasmine.clock().tick(1);
                    vpaid.emit('AdLoaded');

                    Runner.run(() => player.pause());
                });

                it('should call pauseAd()', function() {
                    expect(vpaid.pauseAd).toHaveBeenCalled();
                });
            });
        });

        describe('unload()', function() {
            beforeEach(function() {
                player.src = 'foo';
            });

            describe('if the player has not been load()ed', function() {
                it('should do nothing', function() {
                    expect(() => player.unload()).not.toThrow();
                });

                describe('when the player is fully loaded', function() {
                    beforeEach(function() {
                        Runner.run(() => player.unload());
                        Runner.run(() => player.load());
                        player.emit('canplay');
                    });

                    it('should not call stopAd()', function() {
                        expect(vpaid.stopAd).not.toHaveBeenCalled();
                    });
                });
            });

            describe('if the player has been load()ed', function() {
                beforeEach(function() {
                    Runner.run(() => player.load());
                    Runner.run(() => player.unload());
                });

                it('should not touch the player', function() {
                    expect(vpaid.stopAd).not.toHaveBeenCalled();
                });

                describe('when the player has finished loading', function() {
                    beforeEach(function() {
                        vpaid.adCurrentTime = 15;
                        vpaid.adDuration = 30;
                        vpaid.emit('AdStarted');
                        jasmine.clock().tick(250);

                        Object.defineProperty(vpaid, 'adCurrentTime', {
                            get: () => { throw new Error('I am slain! (4)'); }
                        });

                        loadDeferred.fulfill(vpaid);
                        jasmine.clock().tick(1);
                        vpaid.emit('AdLoaded');
                    });

                    it('should call stopAd() on the player', function() {
                        expect(vpaid.stopAd).toHaveBeenCalled();
                    });

                    it('should cancel the interval', function() {
                        expect(() => jasmine.clock().tick(250)).not.toThrow();
                    });

                    it('should reset the state of the player', function() {
                        expect(player.currentTime).toBe(0);
                        expect(player.duration).toBe(0);
                        expect(player.paused).toBe(true);
                    });
                });
            });

            describe('if the player is fully loaded', function() {
                beforeEach(function() {
                    Runner.run(() => player.load());
                    loadDeferred.fulfill(vpaid);
                    jasmine.clock().tick(1);
                    vpaid.emit('AdLoaded');

                    Runner.run(() => player.unload());
                });

                it('should call stopAd() on the player', function() {
                    expect(vpaid.stopAd).toHaveBeenCalled();
                });

                describe('if called again', function() {
                    beforeEach(function() {
                        vpaid.stopAd.calls.reset();
                        spyOn(player, 'once').and.callThrough();

                        Runner.run(() => player.unload());
                    });

                    it('should do nothing', function() {
                        expect(player.once).not.toHaveBeenCalled();
                        expect(vpaid.stopAd).not.toHaveBeenCalled();
                    });
                });
            });
        });

        describe('reload()', function() {
            beforeEach(function() {
                player.src = 'cool-beans';
                Runner.run(() => player.load());
                spyOn(player, 'unload').and.callThrough();
                spyOn(player, 'load').and.callThrough();

                Runner.run(() => player.reload());
            });

            it('should unload() then load() the player', function() {
                expect(player.unload).toHaveBeenCalled();
                expect(player.load).toHaveBeenCalled();
            });
        });

        describe('getCompanions()', function() {
            it('should return null', function() {
                expect(player.getCompanions()).toBeNull();
            });

            describe('after the player is loaded', function() {
                beforeEach(function() {
                    player.src = 'foo';
                    Runner.run(() => player.load());
                });

                describe('if adBanners is undefined', function() {
                    beforeEach(function() {
                        vpaid.adBanners = undefined;
                    });

                    it('should return null', function() {
                        expect(player.getCompanions()).toBeNull();
                    });
                });

                describe('if adBanners is an array', function() {
                    beforeEach(function() {
                        vpaid.adBanners = [];
                    });

                    it('should return the player\'s adBanners', function() {
                        expect(player.getCompanions()).toBe(vpaid.adBanners);
                    });
                });
            });
        });

        describe('minimize()', function() {
            it('should return an error', function() {
                expect(player.minimize()).toEqual(new Error('The video cannot be minimized.'));
            });
        });
    });
});
