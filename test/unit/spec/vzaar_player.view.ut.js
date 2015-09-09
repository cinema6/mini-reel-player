import VzaarPlayer from '../../../src/players/VzaarPlayer.js';
import CorePlayer from '../../../src/players/CorePlayer.js';
import Runner from '../../../lib/Runner.js';
import PlayerInterface from '../../../src/interfaces/PlayerInterface.js';
import codeLoader from '../../../src/services/code_loader.js';
import timer from '../../../lib/timer.js';

describe('VzaarPlayer', function() {
    let player;

    // Mock Vzaar player returned by their Javascript API
    class MockVzPlayer {
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
        addEventListener() {}
    }

    beforeEach(function() {
        Object.keys(MockVzPlayer.prototype).forEach(key => {
            spyOn(MockVzPlayer.prototype, key).and.callThrough();
        });
        spyOn(codeLoader, 'load').and.returnValue(Promise.resolve(MockVzPlayer));
        player = new VzaarPlayer();
    });

    it('should exist', function() {
        expect(player).toEqual(jasmine.any(CorePlayer));
    });

    it('should implement the PlayerInterface', function() {
        expect(player).toImplement(PlayerInterface);
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

            describe('startPolling', function() {
                it('should setup a timer interval', function() {
                    spyOn(timer, 'interval');
                    player.__private__.startPolling();
                    expect(timer.interval).toHaveBeenCalledWith(jasmine.any(Function), 250);
                    expect(player.__private__.interval).not.toBeNull();
                });
            });

            describe('stopPolling', function() {
                it('should cancel the timer interval', function() {
                    spyOn(timer, 'cancel');
                    player.__private__.startPolling();
                    player.__private__.stopPolling();
                    expect(timer.cancel).toHaveBeenCalledWith(jasmine.any(Promise));
                });
            });

            describe('updateState', function() {
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

            describe('loadEmbed', function() {
                beforeEach(function() {
                    spyOn(player.__private__.embedView, 'append');
                    spyOn(player, 'unload');
                    spyOn(player.__private__.embedView, 'update');
                    spyOn(player, 'append');
                });

                describe('when there is no videoId', function() {
                    it('should do nothing', function(done) {
                        player.__private__.loadEmbed().then(() => {
                            expect(player.__private__.embedView.append).not.toHaveBeenCalled();
                            done();
                        });
                    });
                });

                describe('when the video with the given videoid is already loaded', function() {
                    it('should do nothing', function(done) {
                        player.__private__.loadEmbed().then(() => {
                            expect(player.__private__.embedView.append).not.toHaveBeenCalled();
                            done();
                        });
                    });
                });

                describe('when loading a new video', function() {
                    it('should unload the player', function(done) {
                        player.src = '123';
                        Runner.run(() => {
                            player.__private__.loadEmbed().then(() => {
                                expect(player.unload).toHaveBeenCalled();
                                done();
                            });
                        });
                    });

                    it('should add event listeners', function(done) {
                        player.src = '123';
                        Runner.run(() => {
                            player.__private__.loadEmbed().then(() => {
                                expect(MockVzPlayer.prototype.addEventListener).toHaveBeenCalled();
                                done();
                            });
                        });
                    });

                    it('should set the vzPlayer property', function(done) {
                        player.src = '123';
                        Runner.run(() => {
                            player.__private__.loadEmbed().then(() => {
                                expect(player.__private__.vzPlayer).not.toBeNull();
                                expect(player.__private__.vzPlayer).toEqual(jasmine.any(MockVzPlayer));
                                done();
                            });
                        });
                    });

                    it('should change the readyState', function(done) {
                        player.src = '123';
                        Runner.run(() => {
                            player.__private__.loadEmbed().then(() => {
                                expect(player.readyState).toBe(3);
                                done();
                            });
                        });
                    });

                    it('should update the view', function(done) {
                        player.src = '123';
                        Runner.run(() => {
                            player.__private__.loadEmbed().then(() => {
                                expect(player.__private__.embedView.update).toHaveBeenCalledWith({
                                    id: '123'
                                });
                                done();
                            });
                        });
                    });

                    it('should append the view to the player', function(done) {
                        player.src = '123';
                        Runner.run(() => {
                            player.__private__.loadEmbed().then(() => {
                                expect(player.append).toHaveBeenCalledWith(player.__private__.embedView);
                                done();
                            });
                        });
                    });

                    it('should call the code loader', function(done) {
                        player.src = '123';
                        Runner.run(() => {
                            player.__private__.loadEmbed().then(() => {
                                expect(codeLoader.load).toHaveBeenCalled();
                                done();
                            });
                        });
                    });

                    it('should wait until the vzaar player is ready', function(done) {
                        player.src = '123';
                        Runner.run(() => {
                            player.__private__.loadEmbed().then(() => {
                                expect(MockVzPlayer.prototype.ready).toHaveBeenCalledWith(jasmine.any(Function));
                                done();
                            });
                        });
                    });

                    it('should set the loadedVideoId', function(done) {
                        player.src = '123';
                        Runner.run(() => {
                            player.__private__.loadEmbed().then(() => {
                                expect(player.__private__.loadedVideoId).toBe('123');
                                done();
                            });
                        });
                    });

                    it('should emit the canplay event', function(done) {
                        const canplaySpy = jasmine.createSpy('canplay');
                        player.on('canplay', canplaySpy);
                        player.src = '123';
                        Runner.run(() => {
                            player.__private__.loadEmbed().then(() => {
                                expect(canplaySpy).toHaveBeenCalled();
                                done();
                            });
                        });
                    });
                });
            });
        });

        describe('public', function() {
            let mockPlayer;

            beforeEach(function() {
                mockPlayer = new MockVzPlayer();
            });

            describe('play', function() {
                beforeEach(function() {
                    spyOn(player.__private__, 'loadEmbed').and.returnValue(Promise.resolve(mockPlayer));
                });

                it('should call load', function(done) {
                    player.play().then(() => {
                        expect(player.__private__.loadEmbed).toHaveBeenCalled();
                        done();
                    });
                });

                it('should call play2 on the video', function(done) {
                    player.play().then(() => {
                        expect(mockPlayer.play2).toHaveBeenCalled();
                        done();
                    });
                });
            });

            describe('pause', function() {
                it('should call pause on the video if its loaded', function() {
                    player.__private__.vzPlayer = mockPlayer;
                    player.pause();
                    expect(mockPlayer.pause).toHaveBeenCalled();
                });

                it('should not call pause on the video if it is not loaded', function() {
                    player.pause();
                    expect(mockPlayer.pause).not.toHaveBeenCalled();
                });
            });

            describe('minimize()', function() {
                beforeEach(function() {
                    Runner.run(() => player.load());
                    player.minimize();
                });

                it('should return a no method error', function() {
                    expect(player.minimize()).toEqual(new Error('VzaarPlayer cannot minimize.'));
                });
            });

            describe('load()', function() {
                beforeEach(function() {
                    spyOn(player.__private__, 'loadEmbed');
                    Runner.run(() => player.load());
                });

                it('should call loadEmbed', function() {
                    expect(player.__private__.loadEmbed).toHaveBeenCalled();
                });
            });

            describe('unload()', function() {
                beforeEach(function() {
                    spyOn(player.__private__.embedView, 'remove');
                    Runner.run(() => player.load());
                    Runner.run(() => player.unload());
                });

                it('should set the vzPlayer to null', function() {
                    expect(player.__private__.vzPlayer).toBeNull();
                });

                it('should set the loadedVideoId to null', function() {
                    expect(player.__private__.loadedVideoId).toBeNull();
                });

                it('should call remove on the embed view', function() {
                    expect(player.__private__.embedView.remove).toHaveBeenCalled();
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
