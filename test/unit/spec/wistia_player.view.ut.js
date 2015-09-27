import WistiaPlayer from '../../../src/players/WistiaPlayer.js';
import CorePlayer from '../../../src/players/CorePlayer.js';
import Runner from '../../../lib/Runner.js';
import PlayerInterface from '../../../src/interfaces/PlayerInterface.js';
import codeLoader from '../../../src/services/code_loader.js';
import browser from '../../../src/services/browser.js';
import {defer} from '../../../lib/utils.js';

class MockWistia {
    play() {}
    pause() {}
    volume() {}
    time() {}
    unbind() {}
    bind() {}
    hasData() {}
    ready() {}
}

describe('WistiaPlayer', function() {
    let player, mockWistia;

    function milliWait() {
        const deferred = defer(Promise);
        setTimeout(function() {
            deferred.fulfill();
        }, 1);
        return deferred.promise;
    }

    beforeEach(function() {
        player = new WistiaPlayer();
        mockWistia = new MockWistia();

        spyOn(player.__private__, 'ensurePlayerReady');
        spyOn(mockWistia, 'pause');
        spyOn(mockWistia, 'volume');
        spyOn(mockWistia, 'time');
        spyOn(mockWistia, 'unbind');
        spyOn(mockWistia, 'bind');
        spyOn(mockWistia, 'hasData');
        spyOn(mockWistia, 'ready');
    });

    it('should exist', function() {
        expect(player).toEqual(jasmine.any(CorePlayer));
    });

    it('should implement the PlayerInterface', function() {
        expect(player).toImplement(PlayerInterface);
    });

    describe('public methods', function() {
        describe('minimize', function() {
            it('should return a noMethodError', function() {
                expect(player.minimize()).toEqual(new Error('WistiaPlayer cannot minimize.'));
            });
        });

        describe('reload', function() {
            beforeEach(function() {
                spyOn(player, 'unload');
                spyOn(player, 'load');
                player.reload();
            });

            it('should call unload and then load', function() {
                expect(player.unload).toHaveBeenCalled();
                expect(player.load).toHaveBeenCalled();
            });
        });

        describe('unload', function() {
            beforeEach(function() {
                spyOn(player.__private__, 'unloadEmbed');
                player.unload();
            });

            it('should call unloadEmbed', function() {
                expect(player.__private__.unloadEmbed).toHaveBeenCalled();
            });
        });

        describe('load', function() {
            beforeEach(function() {
                spyOn(player.__private__, 'loadEmbed');
                player.load();
            });

            it('should call loadEmbed', function() {
                expect(player.__private__.loadEmbed).toHaveBeenCalled();
            });
        });

        describe('play', function() {
            beforeEach(function() {
                spyOn(player, 'load').and.callFake(() => {
                    player.__private__.wistiaEmbed = mockWistia;
                });
                spyOn(browser, 'test');
            });

            it('should call load', function() {
                player.__private__.ensurePlayerReady.and.returnValue(Promise.resolve());
                player.play();
                expect(player.load).toHaveBeenCalled();
            });

            it('should call ensurePlayerReady', function() {
                player.__private__.ensurePlayerReady.and.returnValue(Promise.resolve());
                player.play();
                expect(player.__private__.ensurePlayerReady).toHaveBeenCalled();
            });

            describe('when the browser is autoplayable', function() {
                beforeEach(function(done) {
                    browser.test.and.returnValue(Promise.resolve(true));
                    spyOn(player, 'emit');
                    spyOn(mockWistia, 'play');
                    player.__private__.ensurePlayerReady.and.returnValue(Promise.resolve());
                    player.play();
                    milliWait().then(done);
                });

                it('should emit attemptPlay', function() {
                    expect(player.emit).toHaveBeenCalledWith('attemptPlay');
                });

                it('should play the video', function() {
                    expect(player.__private__.wistiaEmbed.play).toHaveBeenCalled();
                });
            });

            describe('when the browser is not autoplayable', function() {
                 beforeEach(function(done) {
                     browser.test.and.returnValue(Promise.resolve(false));
                     spyOn(player, 'emit');
                     spyOn(mockWistia, 'play');
                     player.__private__.ensurePlayerReady.and.returnValue(Promise.resolve());
                     player.play();
                     milliWait().then(done);
                 });

                it('should not emit attemptPlay', function() {
                    expect(player.emit).not.toHaveBeenCalled();
                });

                it('should not play the video', function() {
                    expect(player.__private__.wistiaEmbed.play).not.toHaveBeenCalled();
                });
            });
        });

        describe('pause', function() {
            beforeEach(function(done) {
                player.__private__.ensurePlayerReady.and.returnValue(Promise.resolve());
                player.__private__.wistiaEmbed = mockWistia;
                player.pause();
                milliWait().then(done);
            });

            it('should ensure the player is ready', function() {
                expect(player.__private__.ensurePlayerReady).toHaveBeenCalled();
            });

            it('should pause the video', function() {
                expect(player.__private__.wistiaEmbed.pause).toHaveBeenCalled();
            });
        });
    });

    describe('public properties', function() {
        describe('get seeking', function() {
            it('should return the value off of the state', function() {
                player.__private__.state.seeking = true;
                expect(player.seeking).toBe(true);
                player.__private__.state.seeking = false;
                expect(player.seeking).toBe(false);
            });
        });

        describe('get volume', function() {
            it('should return the value off of the state', function() {
                player.__private__.state.volume = 0.5;
                expect(player.volume).toBe(0.5);
            });
        });

        describe('set volume', function() {
            beforeEach(function(done) {
                player.__private__.ensurePlayerReady.and.returnValue(Promise.resolve());
                player.__private__.wistiaEmbed = mockWistia;
                player.volume = 0.5;
                milliWait().then(done);
            });

            it('should ensure that the player is ready', function() {
                expect(player.__private__.ensurePlayerReady).toHaveBeenCalled();
            });

            it('should set the volume on the video', function() {
                expect(player.__private__.wistiaEmbed.volume).toHaveBeenCalledWith(0.5);
            });
        });

        describe('get muted', function() {
            it('should get the value off of the state', function() {
                player.__private__.state.muted = true;
                expect(player.muted).toBe(true);
                player.__private__.state.muted = false;
                expect(player.muted).toBe(false);
            });
        });

        describe('get paused', function() {
            it('should get the value off of the state', function() {
                player.__private__.state.paused = true;
                expect(player.paused).toBe(true);
                player.__private__.state.paused = false;
                expect(player.paused).toBe(false);
            });
        });

        describe('get ended', function() {
            it('should get the value off of the state', function() {
                player.__private__.state.ended = true;
                expect(player.ended).toBe(true);
                player.__private__.state.ended = false;
                expect(player.ended).toBe(false);
            });
        });

        describe('get duration', function() {
            it('should get the value off of the state', function() {
                player.__private__.state.duration = 123;
                expect(player.duration).toBe(123);
            });
        });

        describe('get currentTime', function() {
            it('should return the value off of the state', function() {
                player.__private__.state.currentTime = 123;
                expect(player.currentTime).toBe(123);
            });
        });

        describe('set currentTime', function() {
            beforeEach(function(done) {
                player.__private__.ensurePlayerReady.and.returnValue(Promise.resolve());
                player.__private__.wistiaEmbed = mockWistia;
                player.currentTime = 123;
                milliWait().then(done);
            });

            it('should ensure that the player is ready', function() {
                expect(player.__private__.ensurePlayerReady).toHaveBeenCalled();
            });

            it('should set the time of the video', function() {
                expect(player.__private__.wistiaEmbed.time).toHaveBeenCalledWith(123);
            });
        });

        describe('get readyState', function() {
            it('should return the value off of the state', function() {
                player.__private__.state.readyState = 3;
                expect(player.readyState).toBe(3);
            });
        });

        describe('get error', function() {
            it('should return the value off of the state', function() {
                player.__private__.state.error = 'some error';
                expect(player.error).toBe('some error');
            });
        });

        describe('get src', function() {
            it('should return the value off of the state', function() {
                player.__private__.state.src = 'some src';
                expect(player.src).toBe('some src');
            });
        });

        describe('set src', function() {
            beforeEach(function() {
                spyOn(player, 'unload');
                spyOn(player.__private__, 'setState');
            });

            it('should set the src on the state', function() {
                player.src = 'some src';
                expect(player.__private__.setState).toHaveBeenCalledWith('src', 'some src');
            });

            describe('when the new src is different', function() {
                it('should call unload', function() {
                    player.__private__.state.src = 'existing src';
                    player.src = 'different src';
                    expect(player.unload).toHaveBeenCalled();
                });
            });

            describe('when the new src is the same', function() {
                it('should not call unload', function() {
                    player.__private__.state.src = 'existing src';
                    player.src = 'existing src';
                    expect(player.unload).not.toHaveBeenCalled();
                });
            });
        });
    });

    describe('private methods', function() {
        describe('setState', function() {
            beforeEach(function() {
                spyOn(player, 'emit');
            });

            it('should set the state', function() {
                player.__private__.setState('ended', true);
                expect(player.__private__.state.ended).toBe(true);
                player.__private__.setState('duration', 123);
                expect(player.__private__.state.duration).toBe(123);
            });

            describe('changing ended to true', function() {
                it('should emit ended', function() {
                    player.__private__.state.ended = false;
                    player.__private__.setState('ended', true);
                    expect(player.emit).toHaveBeenCalledWith('ended');
                });
            });

            describe('changing ended to false', function() {
                it('should emit playing', function() {
                    player.__private__.state.ended = true;
                    player.__private__.setState('ended', false);
                    expect(player.emit).toHaveBeenCalledWith('playing');
                });
            });

            describe('changing seeking to true', function() {
                it('should emit seeking', function() {
                    player.__private__.state.seeking = false;
                    player.__private__.setState('seeking', true);
                    expect(player.emit).toHaveBeenCalledWith('seeking');
                });
            });

            describe('changing seeking to false', function() {
                it('should emit seeked', function() {
                    player.__private__.state.seeking = true;
                    player.__private__.setState('seeking', false);
                    expect(player.emit).toHaveBeenCalledWith('seeked');
                });
            });

            describe('changing duration', function() {
                it('should emit durationchange', function() {
                    player.__private__.state.duration = 123;
                    player.__private__.setState('duration', 321);
                    expect(player.emit).toHaveBeenCalledWith('durationchange');
                });
            });

            describe('changing currentTime', function() {
                it('should emit timeupdate', function() {
                    player.__private__.state.currentTime = 123;
                    player.__private__.setState('currentTime', 321);
                    expect(player.emit).toHaveBeenCalledWith('timeupdate');
                });
            });

            describe('changing paused to true', function() {
                it('should emit pause', function() {
                    player.__private__.state.paused = false;
                    player.__private__.setState('paused', true);
                    expect(player.emit).toHaveBeenCalledWith('pause');
                });
            });

            describe('changing paused to false', function() {
                beforeEach(function() {
                    player.__private__.state.paused = true;
                    player.__private__.setState('paused', false);
                });

                it('should emit play', function() {
                    expect(player.emit).toHaveBeenCalledWith('play');
                });

                it('should emit playing', function() {
                    expect(player.emit).toHaveBeenCalledWith('playing');
                });
            });

            describe('changing volume', function() {
                it('should emit volumechange', function() {
                    player.__private__.state.volume = 0.25;
                    player.__private__.setState('volume', 0.5);
                    expect(player.emit).toHaveBeenCalledWith('volumechange');
                });
            });

            describe('changing src to null', function() {
                it('should emit emptied', function() {
                    player.__private__.state.src = 'not null';
                    player.__private__.setState('src', null);
                    expect(player.emit).toHaveBeenCalledWith('emptied');
                });
            });

            describe('changing readyState to HAVE_METADATA', function() {
                it('should emit loadedmetadata', function() {
                    player.__private__.state.readyState = 0;
                    player.__private__.setState('readyState', 1);
                    expect(player.emit).toHaveBeenCalledWith('loadedmetadata');
                });
            });

            describe('changing readyState to HAVE_FUTURE_DATA', function() {
                it('should emit canplay', function() {
                    player.__private__.state.readyState = 0;
                    player.__private__.setState('readyState', 3);
                    expect(player.emit).toHaveBeenCalledWith('canplay');
                });
            });

            describe('changing readyState to HAVE_ENOUGH_DATA', function() {
                it('should emit canplaythrough', function() {
                    player.__private__.state.readyState = 0;
                    player.__private__.setState('readyState', 4);
                    expect(player.emit).toHaveBeenCalledWith('canplaythrough');
                });
            });

            describe('changing width', function() {
                it('should emit resize', function() {
                    player.__private__.state.width = 123;
                    player.__private__.setState('width', 321);
                    expect(player.emit).toHaveBeenCalledWith('resize');
                });
            });

            describe('changing height', function() {
                it('should emit resize', function() {
                    player.__private__.state.height = 123;
                    player.__private__.setState('height', 321);
                    expect(player.emit).toHaveBeenCalledWith('resize');
                });
            });
        });

        describe('removeEventListeners', function() {
            beforeEach(function() {
                player.__private__.wistiaEmbed = mockWistia;
                player.__private__.removeEventListeners();
            });

            ['end', 'pause', 'play', 'seek', 'timechange', 'volumechange', 'widthchange', 'heightchange'].forEach(event => {
                it('should unbind ' + event, function() {
                    expect(player.__private__.wistiaEmbed.unbind).toHaveBeenCalledWith(event);
                });
            });
        });

        describe('addEventListeners', function() {
            beforeEach(function() {
                player.__private__.wistiaEmbed = mockWistia;
                player.__private__.addEventListeners();
            });

            ['end', 'pause', 'play', 'seek', 'timechange', 'volumechange', 'widthchange', 'heightchange'].forEach(event => {
                it('should bind ' + event, function() {
                    expect(player.__private__.wistiaEmbed.bind).toHaveBeenCalledWith(event, jasmine.any(Function));
                });
            });
        });

        describe('ensurePlayerReady', function() {
            var fulfillSpy;

            beforeEach(function() {
                player.__private__.ensurePlayerReady.and.callThrough();
                fulfillSpy = jasmine.createSpy('fulfillSpy');
                player.__private__.pending = Promise.resolve();
            });

            describe('when the ready state is greater than 3', function() {
                it('should fulfill', function(done) {
                    player.__private__.state.readyState = 3;
                    player.__private__.ensurePlayerReady().then(() => {
                        fulfillSpy();
                        expect(fulfillSpy).toHaveBeenCalled();
                        done();
                    }).catch(error => {
                        expect(error).not.toBeDefined();
                        done();
                    });
                });
            });

            describe('when the ready state is less than 3', function() {
                beforeEach(function() {
                    player.__private__.state.readyState = 2;
                });

                describe('when the player is loading', function() {
                    it('should fulfill on canplay', function(done) {
                        player.__private__.loading = true;
                        player.__private__.ensurePlayerReady()
                        .then(fulfillSpy)
                        .catch(error => {
                            expect(error).not.toBeDefined();
                        });
                        milliWait().then(() => {
                            expect(fulfillSpy).not.toHaveBeenCalled();
                            Runner.run(() => {
                                player.emit('canplay');
                            });
                            return milliWait();
                        }).then(() => {
                            expect(fulfillSpy).toHaveBeenCalled();
                            done();
                        });
                    });
                });

                describe('when the player is not loading', function() {
                    it('should reject', function(done) {
                        player.__private__.loading = false;
                        player.__private__.ensurePlayerReady()
                        .then(() => {
                            fulfillSpy();
                            expect(fulfillSpy).not.toHaveBeenCalled();
                            done();
                        })
                        .catch(() => {
                            fulfillSpy();
                            expect(fulfillSpy).toHaveBeenCalled();
                            done();
                        });
                    });
                });
            });
        });

        describe('cleanState', function() {
            beforeEach(function() {
                player.__private__.state = {
                    currentTime: 123,
                    duration: 123,
                    ended: true,
                    paused: false,
                    muted: true,
                    volume: 1,
                    seeking: true,
                    src: 'some src',
                    error: 'some error',
                    readyState: 3,
                    poster: 'some poster',
                    currentSrc: 'some src',
                    width: 123,
                    height: 123
                };
            });

            it('should reset every state property except for src', function() {
                player.__private__.cleanState();
                expect(player.__private__.state).toEqual({
                    currentTime: 0,
                    duration: 0,
                    ended: false,
                    paused: true,
                    muted: false,
                    volume: 0,
                    seeking: false,
                    src: 'some src',
                    error: null,
                    readyState: 0,
                    poster: null,
                    currentSrc: null,
                    width: 0,
                    height: 0
                });
            });
        });

        describe('unloadEmbed', function() {
            beforeEach(function() {
                Runner.run(() => {
                    player.create();
                });
                spyOn(player.__private__, 'removeEventListeners');
                spyOn(player.__private__, 'cleanState');
                spyOn(player.element, 'removeChild');
            });

            it('should remove event listeners', function() {
                Runner.run(() => player.__private__.unloadEmbed());
                expect(player.__private__.removeEventListeners).toHaveBeenCalled();
            });

            it('should set the wistiaEmbed to null', function() {
                player.__private__.wistiaEmbed = 'not null';
                Runner.run(() => player.__private__.unloadEmbed());
                expect(player.__private__.wistiaEmbed).toBeNull();
            });

            it('should clean the state', function() {
                Runner.run(() => player.__private__.unloadEmbed());
                expect(player.__private__.cleanState).toHaveBeenCalled();
            });

            it('should set the loadedVideoId to be null', function() {
                player.__private__.loadedVideoId = 'not null';
                Runner.run(() => player.__private__.unloadEmbed());
                expect(player.__private__.loadedVideoId).toBeNull();
            });

            it('should remove the iframe', function() {
                let iframe = document.createElement('iframe');
                player.element.appendChild(iframe);
                Runner.run(() => player.__private__.unloadEmbed());
                expect(player.element.removeChild).toHaveBeenCalled();
            });
        });

        describe('loadEmbed', function() {
            beforeEach(function() {
                Runner.run(() => player.create());
                spyOn(player.element, 'appendChild');
                spyOn(codeLoader, 'load').and.returnValue(Promise.resolve());
            });

            describe('when the src does not exist', function() {
                it('should do nothing', function() {
                    player.__private__.state.src = null;
                    player.__private__.loadEmbed();
                    expect(player.element.appendChild).not.toHaveBeenCalled();
                });
            });

            describe('when the video is already loaded', function() {
                it('should do nothing', function() {
                    player.__private__.loadedVideoId = 'loaded video';
                    player.__private__.state.src = 'loaded video';
                    player.__private__.loadEmbed();
                    expect(player.element.appendChild).not.toHaveBeenCalled();
                });
            });

            describe('when the video is not already loaded', function() {
                beforeEach(function() {
                    player.__private__.state.src = 'some src';
                    spyOn(player.__private__, 'unloadEmbed');
                    Runner.run(() => player.__private__.loadEmbed());
                });

                it('should set loading to true', function() {
                    expect(player.__private__.loading).toBe(true);
                });

                it('should unload the embed', function() {
                    expect(player.__private__.unloadEmbed).toHaveBeenCalled();
                });

                it('should set the loadedVideoId', function() {
                    expect(player.__private__.loadedVideoId).toBe('some src');
                });

                it('should append the iframe', function() {
                    expect(player.element.appendChild).toHaveBeenCalled();
                });

                describe('when the iframe loads', function() {
                    beforeEach(function(done) {
                        let iframe = player.element.appendChild.calls.mostRecent().args[0];
                        spyOn(player, 'emit');
                        spyOn(player.__private__, 'addEventListeners');
                        iframe.wistiaApi = mockWistia;
                        iframe.onload();
                        milliWait().then(done);
                    });

                    it('should call the codeLoader', function() {
                        expect(codeLoader.load).toHaveBeenCalled();
                    });

                    it('should emit loadstart', function() {
                        expect(player.emit).toHaveBeenCalledWith('loadstart');
                    });

                    it('should set the wistiaEmbed', function() {
                        expect(player.__private__.wistiaEmbed).toEqual(jasmine.any(MockWistia));
                    });

                    it('should add event listeners', function() {
                        expect(player.__private__.addEventListeners).toHaveBeenCalled();
                    });

                    it('should add a callback for hasData', function() {
                        expect(player.__private__.wistiaEmbed.hasData).toHaveBeenCalled();
                    });

                    it('should add a callback for ready', function() {
                        expect(player.__private__.wistiaEmbed.ready).toHaveBeenCalled();
                    });
                });
            });
        });
    });
});
