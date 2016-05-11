import HtmlVideoPlayer from '../../../src/players/HtmlVideoPlayer.js';
import ThirdPartyPlayer from '../../../src/players/ThirdPartyPlayer.js';
import Runner from '../../../lib/Runner.js';
import PlayerInterface from '../../../src/interfaces/PlayerInterface.js';

describe('HtmlVideoPlayer', function() {
    let player, mockApi;

    beforeEach(function() {
        player = new HtmlVideoPlayer();
        mockApi = {
            addEventListener: jasmine.createSpy('addEventListener()'),
            removeEventListener: jasmine.createSpy('removeEventListener()'),
            setAttribute: jasmine.createSpy('setAttribute()'),
            webkitExitFullscreen: jasmine.createSpy('exitFullscreen()'),
            play: jasmine.createSpy('play()'),
            pause: jasmine.createSpy('pause()')
        };
        Runner.run(() => {
            player.create();
        });
        spyOn(player.element, 'appendChild');
        spyOn(player.element, 'removeChild');
        spyOn(player, '__setProperty__');
    });

    it('should exist', function() {
        expect(player).toEqual(jasmine.any(ThirdPartyPlayer));
    });

    it('should implement the PlayerInterface', function() {
        expect(player).toImplement(PlayerInterface);
    });

    it('should set the api name', function() {
        expect(player.__api__.name).toBe('HtmlVideoPlayer');
    });

    describe('the loadPlayer function', function() {
        beforeEach(function() {
            spyOn(document, 'createElement').and.callFake(name => {
                if(name === 'video') {
                    return mockApi;
                }
            });
        });

        it('should create an html video element', function() {
            player.__api__.loadPlayer('john_cena.mp4', 'image.jpg');
            expect(document.createElement).toHaveBeenCalled();
            expect(mockApi.setAttribute).toHaveBeenCalledWith('src', 'john_cena.mp4');
            expect(mockApi.setAttribute).toHaveBeenCalledWith('poster', 'image.jpg');
            expect(mockApi.setAttribute).toHaveBeenCalledWith('webkit-playsinline', '');
            expect(mockApi.setAttribute).toHaveBeenCalledWith('preload', 'auto');
        });

        describe('setting the video controls', function() {
            beforeEach(function() {
                spyOn(player.__private__.state, 'get');
            });

            it('should set them to true if the players controls are true', function(done) {
                player.__private__.state.get.and.callFake(prop => {
                    return (prop === 'controls');
                });
                Runner.run(() => {
                    player.__api__.loadPlayer('john_cena.mp4', 'image.jpg').then(() => {
                        expect(mockApi.controls).toBe(true);
                        process.nextTick(done);
                    }, done.fail);
                });
            });

            it('should set them to false if the players controls are false', function(done) {
                player.__private__.state.get.and.callFake(prop => {
                    return (prop !== 'controls');
                });
                Runner.run(() => {
                    player.__api__.loadPlayer('john_cena.mp4', 'image.jpg').then(() => {
                        expect(mockApi.controls).toBe(false);
                        process.nextTick(done);
                    }, done.fail);
                });
            });
        });

        it('should append the video', function() {
            Runner.run(() => {
                player.__api__.loadPlayer('john_cena.mp4');
            });
            expect(player.element.appendChild).toHaveBeenCalledWith(mockApi);
        });

        it('should resolve', function(done) {
            Runner.run(() => {
                player.__api__.loadPlayer('john_cena.mp4').then(api => {
                    expect(api).toBe(mockApi);
                    process.nextTick(done);
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    process.nextTick(done);
                });
            });
        });

        it('should initially display video controls', function(done) {
            mockApi.addEventListener.and.callFake((name, handler) => {
                if(name === 'loadstart') {
                    handler();
                }
            });
            Runner.run(() => {
                player.__api__.loadPlayer('john_cena.mp4').then(() => {
                    expect(mockApi.controls).toBe(true);
                    process.nextTick(done);
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    process.nextTick(done);
                });
            });
        });
    });

    describe('the set api methods', function() {
        it('should implement seek', function() {
            player.__api__.methods.seek(mockApi, 123);
            expect(mockApi.currentTime).toBe(123);
        });

        it('should implement play', function() {
            player.__api__.methods.play(mockApi);
            expect(mockApi.play).toHaveBeenCalled();
        });

        it('should implement pause', function() {
            player.__api__.methods.pause(mockApi);
            expect(mockApi.pause).toHaveBeenCalled();
        });

        it('should implement minimize', function() {
            spyOn(document, 'webkitExitFullscreen');
            player.__api__.methods.minimize(mockApi);
            expect(document.webkitExitFullscreen).toHaveBeenCalled();
        });

        it('should impplement unload', function() {
            Runner.run(() => {
                player.__api__.methods.unload(mockApi);
            });
            expect(player.element.removeChild).toHaveBeenCalledWith(mockApi);
        });

        it('should implement controls', function() {
            player.__api__.methods.controls(mockApi, true);
            expect(mockApi.controls).toBe(true);
        });

        it('should implement addEventListener', function(done) {
            const handlerFn = jasmine.createSpy('handlerFn()');
            const result = player.__api__.methods.addEventListener(mockApi, 'name', handlerFn);
            expect(mockApi.addEventListener).toHaveBeenCalledWith('name', jasmine.any(Function), false);
            expect(result).toEqual(jasmine.any(Function));
            const fn = mockApi.addEventListener.calls.mostRecent().args[1];
            fn();
            process.nextTick(() => {
                expect(handlerFn).toHaveBeenCalled();
                done();
            });
        });

        it('should implement removeEventListener', function() {
            player.__api__.methods.removeEventListener(mockApi, 'name', 'handler');
            expect(mockApi.removeEventListener).toHaveBeenCalledWith('name', 'handler', false);
        });
    });

    describe('the implemented api events', function() {
        beforeEach(function() {
            player.__setProperty__.and.callThrough();
        });

        it('should handle the loadedmetadata event', function() {
            mockApi.duration = 123;
            mockApi.readyState = 0;
            player.__api__.events.loadedmetadata(mockApi);
            expect(player.duration).toBe(123);
            expect(player.readyState).toBe(1);
        });

        it('should handle the play event', function() {
            mockApi.paused = true;
            player.__api__.events.play(mockApi);
            expect(player.paused).toBe(true);
        });

        it('should handle the pause event', function() {
            mockApi.paused = false;
            player.__api__.events.pause(mockApi);
            expect(player.paused).toBe(false);
        });

        it('should handle the error event', function() {
            mockApi.error = 'epic fail';
            player.__api__.events.error(mockApi);
            expect(player.error).toBe('epic fail');
        });

        it('should handle the ended event', function() {
            mockApi.ended = false;
            player.__api__.events.ended(mockApi);
            expect(player.ended).toBe(false);
        });

        it('should handle the timeupdate event', function() {
            mockApi.currentTime = 123;
            player.__api__.events.timeupdate(mockApi);
            expect(player.currentTime).toBe(123);
        });

        it('should handle the volumechange event', function() {
            mockApi.muted = false;
            mockApi.volume = 0.5;
            player.__api__.events.volumechange(mockApi);
            expect(player.muted).toBe(false);
            expect(player.volume).toBe(0.5);
        });

        it('should handle the seeking event', function() {
            mockApi.seeking = true;
            player.__api__.events.seeking(mockApi);
            expect(player.seeking).toBe(true);
        });

        it('should handle the seeked event', function() {
            mockApi.seeking = false;
            player.__api__.events.seeked(mockApi);
            expect(player.seeking).toBe(false);
        });
    });
});
