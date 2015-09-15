import VzaarPlayer from '../../../src/players/VzaarPlayer.js';
import CorePlayer from '../../../src/players/CorePlayer.js';
import Runner from '../../../lib/Runner.js';
import PlayerInterface from '../../../src/interfaces/PlayerInterface.js';
import codeLoader from '../../../src/services/code_loader.js';
import timer from '../../../lib/timer.js';
import browser from '../../../src/services/browser.js';

describe('VzaarPlayer', function() {
    let player, eventSpies;

    // Mock Vzaar player returned by their Javascript API
    class MockVzPlayer {
        constructor() {
            this.init(...arguments);
            this.eventListeners = {};
        }
        init() {} // used for testing of constructor
        play2() {}
        pause() {}
        getTime(callback) {
            callback(42);
        }
        getTotalTime(callback) {
            callback(123);
        }
        seekTo() {}
        ready(callback) {
            callback();
        }
        muteOn() {}
        muteOff() {}
        setVolume() {}
        getVolume(callback) {
            callback(3);
        }
        addEventListener(event, callback) {
            this.eventListeners[event] = callback;
        }
        removeEventListener(event) {
            this.eventListeners[event] = null;
        }
    }

    // Events emitted by the player
    const events = ['canplay', 'loadstart', 'loadeddata', 'loadedmetadata', 'playing', 'seeking',
                    'seeked', 'durationchange', 'ended', 'timeupdate', 'pause', 'play',
                    'volumechange'];

    beforeEach(function() {
        Object.keys(MockVzPlayer.prototype).forEach(key => {
            spyOn(MockVzPlayer.prototype, key).and.callThrough();
        });
        spyOn(codeLoader, 'load').and.returnValue(Promise.resolve(MockVzPlayer));
        player = new VzaarPlayer();
        eventSpies = {};
        events.forEach(event => {
            const spy = jasmine.createSpy(event);
            eventSpies[event] = spy;
            player.on(event, spy);
        });
        Runner.run(() => {
            player.create();
        });
        spyOn(timer, 'interval').and.returnValue('interval');
        spyOn(timer, 'cancel');
        spyOn(player.element, 'appendChild');
        player.id = 'c6-view-123';
    });

    it('should exist', function() {
        expect(player).toEqual(jasmine.any(CorePlayer));
    });

    it('should implement the PlayerInterface', function() {
        expect(player).toImplement(PlayerInterface);
    });

    describe('scheduling runner tasks on emitted events', function() {
        it('should work', function(done) {
            player.on('ended', () => {
                try {
                    Runner.schedule('afterRender', this, () => {
                    });
                } catch(e) {
                    expect(e).not.toBeDefined();
                }
            });
            player.src = '123';
            Runner.run(() => {
                player.load();
            });
            setTimeout(() => {
                player.__private__.vzPlayer.eventListeners.playState('mediaEnded');
                expect(eventSpies.ended).toHaveBeenCalled();
                done();
            }, 1);
        });
    });

    describe('properties:', function() {
        describe('get currentTime', function() {
            it('should return the current time off of the state', function() {
                player.__private__.state.currentTime = 123;
                expect(player.currentTime).toBe(123);
            });

            it('should have a default', function() {
                expect(player.currentTime).toBe(0);
            });
        });

        describe('set currentTime', function() {
            describe('when the vzaar player exists', function() {
                beforeEach(function() {
                    player.__private__.vzPlayer = new MockVzPlayer();
                    player.currentTime = 123;
                });

                it('should seek the player to the given time', function() {
                    expect(MockVzPlayer.prototype.seekTo).toHaveBeenCalledWith(123);
                });

                it('should set the current time of the state', function() {
                    expect(player.__private__.state.currentTime).toBe(123);
                });
            });

            describe('when the vzaar player does not exist', function() {
                beforeEach(function() {
                    player.currentTime = 123;
                });

                it('should not seek the player', function() {
                    expect(MockVzPlayer.prototype.seekTo).not.toHaveBeenCalled();
                });

                it('should not modify the state', function() {
                    expect(player.__private__.state.currentTime).not.toBe(123);
                });
            });
        });

        describe('get duration', function() {
            it('should return the duration off of the state', function() {
                player.__private__.state.duration = 123;
                expect(player.duration).toBe(123);
            });

            it('should have a default', function() {
                expect(player.duration).toBe(0);
            });
        });

        describe('get ended', function() {
            it('should return the ended property off of the state', function() {
                player.__private__.state.ended = true;
                expect(player.ended).toBe(true);
            });

            it('should have a default', function() {
                expect(player.ended).toBe(false);
            });
        });

        describe('get paused', function() {
            it('should return the paused property off of the state', function() {
                player.__private__.state.paused = false;
                expect(player.paused).toBe(false);
            });

            it('should have a default', function() {
                expect(player.paused).toBe(true);
            });
        });

        describe('get muted', function() {
            it('should return the muted property off of the state', function() {
                player.__private__.state.muted = true;
                expect(player.muted).toBe(true);
            });

            it('should have a default', function() {
                expect(player.muted).toBe(false);
            });
        });

        describe('set muted', function() {
            describe('when the vzaar player exists', function() {
                beforeEach(function() {
                    player.__private__.vzPlayer = new MockVzPlayer();
                });

                it('should be able to mute the player', function() {
                    player.muted = true;
                    expect(player.__private__.state.muted).toBe(true);
                    expect(MockVzPlayer.prototype.muteOn).toHaveBeenCalled();
                });

                it('should be able to un-mute the player', function() {
                    player.muted = false;
                    expect(player.__private__.state.muted).toBe(false);
                    expect(MockVzPlayer.prototype.muteOff).toHaveBeenCalled();
                });
            });

            describe('when the vzaar player does not exist', function() {
                beforeEach(function() {
                    player.muted = false;
                    player.muted = true;
                });

                it('should not mute or un-mute the player', function() {
                    expect(MockVzPlayer.prototype.muteOn).not.toHaveBeenCalled();
                    expect(MockVzPlayer.prototype.muteOff).not.toHaveBeenCalled();
                });

                it('should not modify the state', function() {
                    expect(player.__private__.state.muted).toBe(false);
                });
            });
        });

        describe('get volume', function() {
            it('should return the volume off of the state', function() {
                player.__private__.state.volume = 3;
                expect(player.volume).toBe(3);
            });

            it('should have a default', function() {
                expect(player.volume).toBe(0);
            });
        });

        describe('set Volume', function() {
            describe('when the vzaar player exists', function() {
                beforeEach(function() {
                    player.__private__.vzPlayer = new MockVzPlayer();
                    player.volume = 0.6;
                });

                it('should be able to set the volume', function() {
                    expect(player.__private__.state.volume).toBe(0.6);
                    expect(MockVzPlayer.prototype.setVolume).toHaveBeenCalledWith(3);
                });
            });

            describe('when the vzaar player does not exist', function() {
                beforeEach(function() {
                    player.volume = 0.6;
                });

                it('should not set the volume', function() {
                    expect(MockVzPlayer.prototype.setVolume).not.toHaveBeenCalled();
                });

                it('should not modify the state', function() {
                    expect(player.__private__.state.volume).toBe(0);
                });
            });
        });

        describe('get seeking', function() {
            it('should return the seeking property off of the state', function() {
                player.__private__.state.seeking = true;
                expect(player.seeking).toBe(true);
            });

            it('should have a default', function() {
                expect(player.seeking).toBe(false);
            });
        });

        describe('readyState', function() {
            it('should have a default', function() {
                expect(player.readyState).toBe(0);
            });
        });

        describe('src', function() {
            it('should be null', function() {
                expect(player.src).toBeNull();
            });
        });
    });

    describe('methods:', function() {
        describe('private', function() {

            describe('setState()', function() {
                it('should set the state', function() {
                    const input = {
                        ended: false,
                        seeking: true,
                        foo: 7
                    };
                    Object.keys(input).forEach(key => {
                        player.__private__.setState(key, input[key]);
                        expect(player.__private__.state[key]).toBe(input[key]);
                    });
                });

                describe('ended', function() {
                    it('should emit the ended event when becoming true', function() {
                        player.__private__.state.ended = false;
                        player.__private__.setState('ended', true);
                        expect(eventSpies.ended).toHaveBeenCalled();
                    });

                    it('should emit the playing event when becoming false', function() {
                        player.__private__.state.ended = true;
                        player.__private__.setState('ended', false);
                        expect(eventSpies.playing).toHaveBeenCalled();
                    });
                });

                describe('seeking', function() {
                    it('should emit the seeking event when becoming true', function() {
                        player.__private__.state.seeking = false;
                        player.__private__.setState('seeking', true);
                        expect(eventSpies.seeking).toHaveBeenCalled();
                    });

                    it('should emit the seeked event when becoming false', function() {
                        player.__private__.state.seeking = true;
                        player.__private__.setState('seeking', false);
                        expect(eventSpies.seeked).toHaveBeenCalled();
                    });
                });

                describe('duration', function() {
                    it('should emit the durationchange event when being changed', function() {
                        player.__private__.state.duration = 0;
                        player.__private__.setState('duration', 123);
                        expect(eventSpies.durationchange).toHaveBeenCalled();
                    });
                });

                describe('currentTime', function() {
                    it('should emit the timeupdate event when being changed', function() {
                        player.__private__.state.currentTime = 0;
                        player.__private__.setState('currentTime', 7);
                        expect(eventSpies.timeupdate).toHaveBeenCalled();
                    });
                });

                describe('paused', function() {
                    it('should emit the pause event when becoming true', function() {
                        player.__private__.state.paused = false;
                        player.__private__.setState('paused', true);
                        expect(eventSpies.pause).toHaveBeenCalled();
                    });

                    it('should emit play events when becoming false', function() {
                        player.__private__.state.paused = true;
                        player.__private__.setState('paused', false);
                        expect(eventSpies.play).toHaveBeenCalled();
                        expect(eventSpies.playing).toHaveBeenCalled();
                    });
                });

                describe('volume', function() {
                    it('should emit the volumechanged event when being changed', function() {
                        player.__private__.state.volume = 1;
                        player.__private__.setState('volume', 0);
                        expect(eventSpies.volumechange).toHaveBeenCalled();
                    });
                });
            });

            describe('startPolling()', function() {
                it('should setup a timer interval', function() {
                    player.__private__.startPolling();
                    expect(timer.interval).toHaveBeenCalledWith(jasmine.any(Function), 250);
                    expect(player.__private__.interval).not.toBeNull();
                });

                it('should call updateState()', function() {
                    player.__private__.startPolling();
                    expect(timer.interval.calls.mostRecent().args[0].toString()).toContain('updateState()');
                });
            });

            describe('stopPolling()', function() {
                it('should cancel the timer interval', function() {
                    player.__private__.startPolling();
                    player.__private__.stopPolling();
                    expect(timer.cancel).toHaveBeenCalledWith('interval');
                });
            });

            describe('updateState()', function() {
                describe('when vzPlayer exists', function() {
                    beforeEach(function() {
                        player.__private__.vzPlayer = new MockVzPlayer();
                        player.__private__.updateState();
                    });

                    it('should update the current time', function() {
                        expect(MockVzPlayer.prototype.getTime).toHaveBeenCalled();
                        expect(player.__private__.state.currentTime).toBe(42);
                    });

                    it('should update the duration', function() {
                        expect(MockVzPlayer.prototype.getTotalTime).toHaveBeenCalled();
                        expect(player.__private__.state.duration).toBe(123);
                    });

                    it('should update the volume', function() {
                        expect(MockVzPlayer.prototype.getVolume).toHaveBeenCalled();
                        expect(player.__private__.state.volume).toBe(0.6);
                    });
                });

                describe('when vzPlayer does not exist', function() {
                    it('should stop polling', function() {
                        spyOn(player.__private__, 'stopPolling');
                        player.__private__.updateState();
                        expect(player.__private__.stopPolling).toHaveBeenCalled();
                    });
                });
            });

            describe('loadEmbed()', function() {
                beforeEach(function() {
                    spyOn(player, 'unload');
                    spyOn(player, 'append');
                });

                describe('when there is no viewId', function() {
                    it('should do nothing', function(done) {
                        player.id = null;
                        player.__private__.loadEmbed().then(() => {
                            expect(player.element.appendChild).not.toHaveBeenCalled();
                            done();
                        });
                    });
                });

                describe('when there is no videoId', function() {
                    it('should do nothing', function(done) {
                        player.__private__.loadEmbed().then(() => {
                            expect(player.element.appendChild).not.toHaveBeenCalled();
                            done();
                        });
                    });
                });

                describe('when the video with the given videoid is already loaded', function() {
                    it('should do nothing', function(done) {
                        player.__private__.loadEmbed().then(() => {
                            expect(player.element.appendChild).not.toHaveBeenCalled();
                            done();
                        });
                    });
                });

                describe('when loading a video for the first time', function() {
                    beforeEach(function(done) {
                        spyOn(player.__private__, 'startPolling');
                        player.src = '123';
                        Runner.run(() => {
                            player.__private__.loadEmbed().then(() => {
                                done();
                            });
                        });
                    });

                    it('should set the embedElement', function() {
                        expect(player.__private__.embedElement.innerHTML).toContain('id="c6-view-123_vzvd-123"');
                        expect(player.__private__.embedElement.innerHTML).toContain('name="c6-view-123_vzvd-123"');
                        expect(player.__private__.embedElement.innerHTML).toContain('src="//view.vzaar.com/123/player?apiOn=true"');
                    });

                    describe('when loadeding a new video', function() {
                        beforeEach(function(done) {
                            player.src = 'new-video-123';
                            Runner.run(() => {
                                player.__private__.loadEmbed().then(() => {
                                    done();
                                });
                            });
                        });

                        it('should unload the player', function() {
                            expect(player.unload).toHaveBeenCalled();
                        });

                        it('should emit the emptied event', function() {
                            const emptiedSpy = jasmine.createSpy('emptied');
                            player.on('emptied', emptiedSpy);

                        });
                    });

                    it('should not unload', function() {
                        expect(player.unload).not.toHaveBeenCalled();
                    });

                    it('should add event listeners', function() {
                        expect(MockVzPlayer.prototype.addEventListener).toHaveBeenCalled();
                    });

                    it('should set the vzPlayer property', function() {
                        expect(player.__private__.vzPlayer).not.toBeNull();
                        expect(player.__private__.vzPlayer).toEqual(jasmine.any(MockVzPlayer));
                        expect(MockVzPlayer.prototype.init).toHaveBeenCalledWith('c6-view-123_vzvd-123');
                    });

                    it('should start polling for video properties', function() {
                        expect(player.__private__.startPolling).toHaveBeenCalled();
                    });

                    it('should change the readyState', function() {
                        expect(player.readyState).toBe(3);
                    });

                    it('should append the view to the player', function() {
                        expect(player.element.appendChild).toHaveBeenCalledWith(player.__private__.embedElement);
                    });

                    it('should call the code loader', function() {
                        expect(codeLoader.load).toHaveBeenCalled();
                    });

                    it('should wait until the vzaar player is ready', function() {
                        expect(MockVzPlayer.prototype.ready).toHaveBeenCalledWith(jasmine.any(Function));
                    });

                    it('should set the loadedVideoId', function() {
                        expect(player.__private__.loadedVideoId).toBe('123');
                    });

                    it('should emit the canplay event', function() {
                        expect(eventSpies.canplay).toHaveBeenCalled();
                    });

                    it('should emit the loadstart event', function() {
                        expect(eventSpies.loadstart).toHaveBeenCalled();
                    });

                    it('should emit the loadeddata event', function() {
                        expect(eventSpies.loadeddata).toHaveBeenCalled();
                    });

                    it('should emit the loadedmetadata event', function() {
                        expect(eventSpies.loadedmetadata).toHaveBeenCalled();
                    });
                });
            });
        });

        describe('public', function() {

            beforeEach(function() {
                spyOn(player.__private__, 'loadEmbed').and.callFake(() => {
                    player.__private__.vzPlayer = new MockVzPlayer();
                    player.__private__.embedElement = document.createElement('div');
                    return Promise.resolve('value');
                });
            });

            describe('play', function() {
                beforeEach(function() {
                    spyOn(browser, 'test');
                });

                it('should set the loadingPromise to be null', function(done) {
                    player.__private__.loadingPromise = 'not null';
                    player.play();
                    setTimeout(() => {
                        expect(player.__private__.loadingPromise).toBeNull();
                        done();
                    }, 1);
                });

                describe('on autoplayable browsers', function() {
                    beforeEach(function(done) {
                        browser.test.and.returnValue(Promise.resolve(true));
                        player.play();
                        setTimeout(() => {
                            done();
                        }, 1);
                    });

                    it('should call load', function() {
                        expect(player.__private__.loadEmbed).toHaveBeenCalled();
                    });

                    it('should call play2 on the video', function() {
                        expect(MockVzPlayer.prototype.play2).toHaveBeenCalled();
                    });
                });

                describe('on non-autoplayable browsers', function() {
                    beforeEach(function(done) {
                        browser.test.and.returnValue(Promise.resolve(false));
                        setTimeout(() => {
                            player.play();
                            done();
                        }, 1);
                    });

                    it('should call load', function() {
                        expect(player.__private__.loadEmbed).toHaveBeenCalled();
                    });

                    it('should not call play2 on the video', function() {
                        expect(MockVzPlayer.prototype.play2).not.toHaveBeenCalled();
                    });
                });
            });

            describe('pause', function() {
                it('should call pause on the video if its loaded', function() {
                    player.load();
                    setTimeout(() => {
                        player.pause();
                        expect(MockVzPlayer.prototype.pause).toHaveBeenCalled();
                    }, 1);
                });

                it('should not call pause on the video if it is not loaded', function() {
                    player.pause();
                    expect(MockVzPlayer.prototype.pause).not.toHaveBeenCalled();
                });
            });

            describe('minimize()', function() {
                beforeEach(function() {
                    player.load();
                    player.minimize();
                });

                it('should return a no method error', function() {
                    expect(player.minimize()).toEqual(new Error('VzaarPlayer cannot minimize.'));
                });
            });

            describe('load()', function() {
                beforeEach(function() {
                    player.load();
                });

                it('should call loadEmbed', function() {
                    expect(player.__private__.loadEmbed).toHaveBeenCalled();
                });
            });

            describe('unload()', function() {
                beforeEach(function(done) {
                    player.src = '123';
                    spyOn(player.element, 'removeChild');
                    player.load();
                    setTimeout(() => {
                        player.unload();
                        done();
                    }, 1);
                });

                it('should set the vzPlayer to null', function() {
                    expect(player.__private__.vzPlayer).toBeNull();
                });

                it('should set the loadedVideoId to null', function() {
                    expect(player.__private__.loadedVideoId).toBeNull();
                });

                it('should call remove on the embed view', function() {
                    expect(player.element.removeChild).toHaveBeenCalledWith(jasmine.any(Object));
                });

                it('should remove the event listeners', function() {
                    expect(MockVzPlayer.prototype.removeEventListener).toHaveBeenCalledWith('playState');
                    expect(MockVzPlayer.prototype.removeEventListener).toHaveBeenCalledWith('interaction');
                });

                it('should clean the state', function() {
                    const expectedOutput = {
                        currentTime: 0,
                        duration: 0,
                        ended: false,
                        paused: true,
                        muted: false,
                        volume: 0,
                        seeking: false
                    };
                    expect(player.__private__.state).toEqual(expectedOutput);
                });
            });

            describe('reload()', function() {
                beforeEach(function() {
                    spyOn(player, 'unload');
                    spyOn(player, 'load');

                    Runner.run(() => player.reload());
                });

                it('should unload() then load() the player', function() {
                    expect(player.unload).toHaveBeenCalled();
                    expect(player.load).toHaveBeenCalled();
                });
            });
        });
    });
});
