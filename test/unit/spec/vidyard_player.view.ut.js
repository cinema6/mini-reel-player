import VidyardPlayer from '../../../src/players/VidyardPlayer.js';
import ThirdPartyPlayer from '../../../src/players/ThirdPartyPlayer.js';
import Runner from '../../../lib/Runner.js';
import PlayerInterface from '../../../src/interfaces/PlayerInterface.js';
import codeLoader from '../../../src/services/code_loader.js';
import RunnerPromise from '../../../lib/RunnerPromise.js';

describe('Vidyard Player', function() {
    let player, MockApi;

    beforeEach(function() {
        player = new VidyardPlayer();
        MockApi = function() {
            this.metadata = {
                /* jshint camelcase:false */
                length_in_seconds: 123
                /* jshint camelcase:true */
            };
        };
        MockApi.prototype = {
            play: jasmine.createSpy('play()'),
            pause: jasmine.createSpy('pause()'),
            seek: jasmine.createSpy('seek()'),
            setVolume: jasmine.createSpy('setVolume()'),
            on: jasmine.createSpy('on()').and.callFake((name, callback) => {
                switch(name) {
                case 'ready':
                    callback();
                }
            }),
            off: jasmine.createSpy('off()')
        };
        Runner.run(() => {
            player.create();
        });
        spyOn(player.element, 'appendChild');
        spyOn(player, '__setProperty__');
        spyOn(player, 'addClass');
        spyOn(player, 'removeClass');
    });

    it('should exist', function() {
        expect(player).toEqual(jasmine.any(ThirdPartyPlayer));
    });

    it('should implement the PlayerInterface', function() {
        expect(player).toImplement(PlayerInterface);
    });

    it('should set the api name', function() {
        expect(player.__api__.name).toBe('Vidyard');
    });

    describe('the loadPlayer function', function() {
        let style, script, api;
        let appendToDivSpy, setAttributeSpy, addEventListenerSpy;

        beforeEach(function(done) {
            appendToDivSpy = jasmine.createSpy('appendChild()');
            setAttributeSpy = jasmine.createSpy('setAttribute()');
            addEventListenerSpy = jasmine.createSpy('addEventListener()').and.callFake((name, callback) => {
                callback();
            });
            script = {
                setAttribute: setAttributeSpy,
                addEventListener: addEventListenerSpy
            };
            style = {
                innerHTML: ''
            };
            spyOn(document, 'createElement').and.callFake(element => {
                switch(element) {
                case 'script':
                    return script;
                case 'style':
                    return style;
                }
            });
            spyOn(codeLoader, 'load').and.returnValue(RunnerPromise.resolve({
                player: MockApi
            }));
            Runner.run(() => {
                player.__api__.loadPlayer('abc_123').then(result => {
                    api = result;
                    process.nextTick(done);
                }).catch(error => {
                    expect(error).not.toBeDefined();
                });
            });
        });

        it('should create some styles to make Vidyard responsive', function() {
            expect(document.createElement).toHaveBeenCalledWith('style');
            expect(style.innerHTML.replace(/\n|\s/g, '')).toBe(`
                span#vidyard_span_abc_123 {
                    width: 100% !important; height: 100% !important;
                }
            `.replace(/\n|\s/g, ''));
            expect(player.element.appendChild).toHaveBeenCalledWith(style);
        });

        it('should configure the script', function() {
            expect(document.createElement).toHaveBeenCalledWith('script');
            expect(setAttributeSpy).toHaveBeenCalledWith('type', 'text/javascript');
            expect(setAttributeSpy).toHaveBeenCalledWith('id', 'vidyard_embed_code_abc_123');
            expect(setAttributeSpy).toHaveBeenCalledWith('src', '//play.vidyard.com/abc_123.js?v=3.1.1&type=inline');
            expect(addEventListenerSpy).toHaveBeenCalledWith('load', jasmine.any(Function), false);
            expect(player.element.appendChild).toHaveBeenCalledWith(script);
        });

        it('should use the codeLoader to resolve with the api', function() {
            expect(codeLoader.load).toHaveBeenCalledWith('vidyard');
            expect(MockApi.prototype.on).toHaveBeenCalledWith('ready', jasmine.any(Function));
            expect(api).toEqual(jasmine.any(MockApi));
        });

        it('should add the white bg class', function() {
            expect(player.addClass).toHaveBeenCalledWith('playerBox--whiteBg');
        });
    });

    describe('the set api methods', function() {
        describe('the play implementation', function() {
            it('should implement play', function(done) {
                player.__private__.state.set('paused', false);
                player.__api__.methods.play(new MockApi()).then(() => {
                    expect(MockApi.prototype.play).toHaveBeenCalled();
                    var callCount = MockApi.prototype.play.calls.count();
                    expect(callCount).toBe(1);
                    process.nextTick(done);
                });
            });

            it('should be able to retry the attempt to play the video', function(done) {
                player.__private__.state.set('paused', true);
                var callCount = 0;
                MockApi.prototype.play.and.callFake(() => {
                    callCount++;
                    if(callCount === 5) {
                        player.__private__.state.set('paused', false);
                    }
                });
                const startTime = Date.now();
                player.__api__.methods.play(new MockApi()).then(() => {
                    const elapsed = Date.now() - startTime;
                    expect(MockApi.prototype.play).toHaveBeenCalled();
                    var callCount = MockApi.prototype.play.calls.count();
                    expect(callCount).toBe(5);
                    expect(elapsed).toBeGreaterThan(2000);
                    process.nextTick(done);
                });
            });
        });

        it('should implement pause', function() {
            player.__api__.methods.pause(new MockApi());
            expect(MockApi.prototype.pause).toHaveBeenCalled();
        });

        describe('the unload implementation', function() {
            it('should implement unload', function() {
                player.element.innerHTML = 'not empty';
                Runner.run(() => {
                    player.__api__.methods.unload(new MockApi());
                });
                expect(player.element.innerHTML).toBe('');
            });

            it('should remove the white bg class', function() {
                player.element.innerHTML = 'not empty';
                Runner.run(() => {
                    player.__api__.methods.unload(new MockApi());
                });
                expect(player.removeClass).toHaveBeenCalledWith('playerBox--whiteBg');
            });
        });

        it('should implement seek', function() {
            player.__api__.methods.seek(new MockApi(), 123);
            expect(MockApi.prototype.seek).toHaveBeenCalledWith(123);
        });

        it('should implement volume', function() {
            player.__api__.methods.volume(new MockApi(), 123);
            expect(MockApi.prototype.setVolume).toHaveBeenCalledWith(123);
        });

        it('should implement addEventListener', function() {
            const handler = jasmine.createSpy('handler()');
            player.__api__.methods.addEventListener(new MockApi(), 'foo', handler);
            expect(MockApi.prototype.on).toHaveBeenCalledWith('foo', jasmine.any(Function));
        });

        it('should implement removeEventListener', function() {
            player.__api__.methods.removeEventListener(new MockApi(), 'foo');
            expect(MockApi.prototype.off).toHaveBeenCalledWith('foo');
        });
    });

    describe('the implemented api events', function() {
        it('should handle the play event', function() {
            player.__api__.events.play();
            expect(player.__setProperty__).toHaveBeenCalledWith('paused', false);
            expect(player.__setProperty__).toHaveBeenCalledWith('ended', false);
        });

        it('should handle the pause event', function() {
            player.__api__.events.pause();
            expect(player.__setProperty__).toHaveBeenCalledWith('paused', true);
        });

        it('should handle the beforeSeek event', function() {
            player.__api__.events.beforeSeek();
            expect(player.__setProperty__).toHaveBeenCalledWith('seeking', true);
        });

        it('should handle the seeked event', function() {
            player.__api__.events.seek();
            expect(player.__setProperty__).toHaveBeenCalledWith('seeking', false);
        });

        it('should handle the complete event', function() {
            player.__api__.events.playerComplete();
            expect(player.__setProperty__).toHaveBeenCalledWith('ended', true);
            expect(player.__setProperty__).toHaveBeenCalledWith('paused', true);
        });

        it('should handle the timeupdate event', function() {
            player.__api__.events.timeupdate(123);
            expect(player.__setProperty__).toHaveBeenCalledWith('currentTime', 123);
        });

        it('should handle the volume event', function() {
            player.__api__.events.volumeChange(123);
            expect(player.__setProperty__).toHaveBeenCalledWith('volume', 123);
        });
    });

    describe('the api onReady callback', function() {
        it('should set the duration', function() {
            player.__api__.onReady(new MockApi());
            expect(player.__setProperty__).toHaveBeenCalledWith('duration', 123);
        });
    });
});
