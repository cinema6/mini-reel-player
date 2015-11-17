import JWPlayer from '../../../src/players/JWPlayer.js';
import ThirdPartyPlayer from '../../../src/players/ThirdPartyPlayer.js';
import Runner from '../../../lib/Runner.js';
import PlayerInterface from '../../../src/interfaces/PlayerInterface.js';

describe('JWPlayer', function() {
    let player, mockApi;

    beforeEach(function() {
        player = new JWPlayer();
        mockApi = {
            play: jasmine.createSpy('play()'),
            pause: jasmine.createSpy('pause()'),
            seek: jasmine.createSpy('seek()'),
            setVolume: jasmine.createSpy('setVolume()'),
            stop: jasmine.createSpy('stop()'),
            remove: jasmine.createSpy('remove()'),
            on: jasmine.createSpy('on()').and.callFake((name, callback) => {
                switch(name) {
                case 'ready':
                    callback();
                }
            }),
            off: jasmine.createSpy('off()'),
            getPosition: jasmine.createSpy('getPosition()'),
            getState: jasmine.createSpy('getState()'),
            getDuration: jasmine.createSpy('getDuration()'),
            getMute: jasmine.createSpy('getMute()'),
            getVolume: jasmine.createSpy('getVolume()'),
            getFullscreen: jasmine.createSpy('getFullscreen()'),
            getWidth: jasmine.createSpy('getWidth()'),
            getHeight: jasmine.createSpy('getHeight()')
        };
        Runner.run(() => {
            player.create();
        });
        spyOn(player.element, 'appendChild');
        spyOn(player, '__setProperty__');
    });

    it('should exist', function() {
        expect(player).toEqual(jasmine.any(ThirdPartyPlayer));
    });

    it('should implement the PlayerInterface', function() {
        expect(player).toImplement(PlayerInterface);
    });

    it('should set the api name', function() {
        expect(player.__api__.name).toBe('JWPlayer');
    });

    describe('the loadPlayer function', function() {
        let iframe, div, style, script, api;
        let appendToFrameBodySpy, appendToFrameHeadSpy, appendToDivSpy, setAttributeSpy, addEventListenerSpy;

        beforeEach(function(done) {
            appendToFrameHeadSpy = jasmine.createSpy('appendToFrameHeadSpy()');
            appendToFrameBodySpy = jasmine.createSpy('appendChild()');
            appendToDivSpy = jasmine.createSpy('appendChild()');
            setAttributeSpy = jasmine.createSpy('setAttribute()');
            addEventListenerSpy = jasmine.createSpy('addEventListener()').and.callFake((name, callback) => {
                callback();
            });
            iframe = {
                addEventListener: jasmine.createSpy('iframe.addEventListener()'),
                contentDocument: {
                    head: {
                        appendChild: appendToFrameHeadSpy
                    },
                    body: {
                        appendChild: appendToFrameBodySpy
                    }
                },
                contentWindow: {
                    jwplayer: () => {
                        return mockApi;
                    }
                }
            };
            div = {
                appendChild: appendToDivSpy
            };
            script = {
                setAttribute: setAttributeSpy,
                addEventListener: addEventListenerSpy
            };
            style = {
                innerHTML: ''
            };
            spyOn(document, 'createElement').and.callFake(element => {
                switch(element) {
                case 'iframe':
                    return iframe;
                case 'div':
                    return div;
                case 'script':
                    return script;
                case 'style':
                    return style;
                }
            });
            Runner.run(() => {
                player.__api__.loadPlayer('abc-123').then(result => {
                    api = result;
                    process.nextTick(done);
                });
            });
        });

        it('should configure the iframe', function() {
            expect(document.createElement).toHaveBeenCalledWith('iframe');
            expect(player.element.appendChild).toHaveBeenCalledWith(iframe);
            expect(appendToFrameBodySpy).not.toHaveBeenCalledWith(div);
            expect(appendToFrameHeadSpy).not.toHaveBeenCalledWith(style);
            expect(iframe.addEventListener).toHaveBeenCalledWith('load', jasmine.any(Function), false);
            expect(iframe.addEventListener.calls.count()).toBe(1);
        });

        it('should create some styles to fix JWPlayer\'s annoying rendering', function() {
            expect(document.createElement).toHaveBeenCalledWith('style');
            expect(style.innerHTML.replace(/\n|\s/g, '')).toBe(`
                div#${div.id} {
                    width: 100% !important; height: 100% !important;
                }
            `.replace(/\n|\s/g, ''));
            expect(appendToFrameHeadSpy).not.toHaveBeenCalledWith(style);
        });

        it('should configure the div', function() {
            expect(document.createElement).toHaveBeenCalledWith('div');
            expect(div.id).toBe('botr_abc_123_div');
            expect(appendToDivSpy).toHaveBeenCalledWith(script);
        });

        it('should configure the script', function() {
            expect(document.createElement).toHaveBeenCalledWith('script');
            expect(setAttributeSpy).toHaveBeenCalledWith('type', 'application/javascript');
            expect(setAttributeSpy).toHaveBeenCalledWith('src', '//content.jwplatform.com/players/abc-123.js');
            expect(addEventListenerSpy).toHaveBeenCalledWith('load', jasmine.any(Function));
        });

        it('should resolve with the api when the player is ready', function() {
            expect(api).toBe(mockApi);
        });

        describe('when the <iframe> is loaded', function() {
            beforeEach(function() {
                iframe.addEventListener.calls.mostRecent().args[1]();
            });

            it('should append the <div> and <style>', function() {
                expect(appendToFrameHeadSpy).toHaveBeenCalledWith(style);
                expect(appendToFrameBodySpy).toHaveBeenCalledWith(div);
            });
        });
    });

    describe('the set api methods', function() {
        it('should implement unload', function() {
            player.element.innerHTML = 'not empty';
            Runner.run(() => {
                player.__api__.methods.unload(mockApi);
            });
            expect(mockApi.stop).toHaveBeenCalled();
            expect(mockApi.remove).toHaveBeenCalled();
            expect(player.element.innerHTML).toBe('');
        });

        describe('play', function() {
            it('should resolve on the playing event', function(done) {
                player.__private__.state.set('paused', true);
                player.__api__.methods.play(mockApi).then(() => {
                    expect(mockApi.play).toHaveBeenCalledWith(true);
                    process.nextTick(done);
                });
                player.emit('playing');
            });

            it('should reject without the playing event', function(done) {
                player.__private__.state.set('paused', true);
                player.__api__.methods.play(mockApi).catch(error => {
                    expect(mockApi.play).toHaveBeenCalledWith(true);
                    expect(error).toBe('failed to confirm play');
                    process.nextTick(done);
                });
            });

            it('should resolve and not call play if already playing', function(done) {
                player.__private__.state.set('paused', false);
                player.__api__.methods.play(mockApi).then(() => {
                    expect(mockApi.play).not.toHaveBeenCalled();
                    process.nextTick(done);
                });
            });
        });

        it('should implement pause', function() {
            player.__api__.methods.pause(mockApi);
            expect(mockApi.pause).toHaveBeenCalledWith(true);
        });

        describe('seek', function() {
            it('should resolve on the seeked event', function(done) {
                player.__api__.methods.seek(mockApi, 123).then(() => {
                    expect(mockApi.seek).toHaveBeenCalledWith(123);
                    process.nextTick(done);
                });
                player.emit('seeked');
            });

            it('should reject without the seeked event', function(done) {
                player.__api__.methods.seek(mockApi, 123).catch(error => {
                    expect(mockApi.seek).toHaveBeenCalledWith(123);
                    expect(error).toBe('failed to confirm seek');
                    process.nextTick(done);
                });
            });
        });

        it('should implement volume', function() {
            player.__api__.methods.volume(mockApi, 123);
            expect(mockApi.setVolume).toHaveBeenCalledWith(123);
        });

        it('should implement addEventListener', function() {
            const handler = jasmine.createSpy('handler()');
            player.__api__.methods.addEventListener(mockApi, 'foo', handler);
            expect(mockApi.on).toHaveBeenCalledWith('foo', jasmine.any(Function));
        });

        it('should implement removeEventListener', function() {
            player.__api__.methods.removeEventListener(mockApi, 'foo');
            expect(mockApi.off).toHaveBeenCalledWith('foo');
        });
    });

    describe('the implemented api events', function() {
        it('should handle the time event', function() {
            player.__api__.events.time({
                duration: 321,
                position: 123
            });
            expect(player.__setProperty__).toHaveBeenCalledWith('duration', 321);
            expect(player.__setProperty__).toHaveBeenCalledWith('currentTime', 123);
        });

        it('should handle the seek event', function() {
            player.__api__.events.seek();
            expect(player.__setProperty__).toHaveBeenCalledWith('seeking', true);
        });

        it('should handle the seeked event', function() {
            player.__api__.events.seeked();
            expect(player.__setProperty__).toHaveBeenCalledWith('seeking', false);
        });

        it('should handle the setupError event', function() {
            player.__api__.events.setupError({message: 'epic fail'});
            expect(player.__setProperty__).toHaveBeenCalledWith('error', 'epic fail');
        });

        it('should handle the play event', function() {
            player.__api__.events.play();
            expect(player.__setProperty__).toHaveBeenCalledWith('paused', false);
            expect(player.__setProperty__).toHaveBeenCalledWith('ended', false);
        });

        it('should handle the pause event', function() {
            player.__api__.events.pause();
            expect(player.__setProperty__).toHaveBeenCalledWith('paused', true);
        });

        it('should handle the complete event', function() {
            player.__api__.events.complete();
            expect(player.__setProperty__).toHaveBeenCalledWith('ended', true);
            expect(player.__setProperty__).toHaveBeenCalledWith('paused', true);
        });

        it('should handle the error event', function() {
            player.__api__.events.error({message: 'epic fail'});
            expect(player.__setProperty__).toHaveBeenCalledWith('error', 'epic fail');
        });

        it('should handle the mute event', function() {
            player.__api__.events.mute({mute: true});
            expect(player.__setProperty__).toHaveBeenCalledWith('muted', true);
        });

        it('should handle the volume event', function() {
            player.__api__.events.volume({volume: 123});
            expect(player.__setProperty__).toHaveBeenCalledWith('volume', 123);
        });
    });
});
