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
}

fdescribe('WistiaPlayer', function() {
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
                    player.__private__.state.seeked = true;
                    player.__private__.setState('seeked', false);
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
                });
            });

            describe('changing paused to true', function() {
                it('should emit pause', function() {

                });
            });

            describe('changing paused to false', function() {
                it('should emit play', function() {

                });

                it('should emit playing', function() {

                });
            });

            describe('changing volume', function() {
                it('should emit volumechange', function() {

                });
            });

            describe('changing src to null', function() {
                it('should emit emptied', function() {

                });
            });

            describe('changing readyState to HAVE_METADATA', function() {
                it('should emit loadedmetadata', function() {

                });
            });

            describe('changing readyState to HAVE_FUTURE_DATA', function() {
                it('should emit canplay', function() {

                });
            });

            describe('changing readyState to HAVE_ENOUGH_DATA', function() {
                it('should emit canplaythrough', function() {

                });
            });

            describe('changing width', function() {
                it('should emit resize', function() {

                });
            });

            describe('changing height', function() {
                it('should emit resize', function() {

                });
            });
        });
    });
});
