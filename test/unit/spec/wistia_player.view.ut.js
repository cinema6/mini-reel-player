import WistiaPlayer from '../../../src/players/WistiaPlayer.js';
import ThirdPartyPlayer from '../../../src/players/ThirdPartyPlayer.js';
import Runner from '../../../lib/Runner.js';
import PlayerInterface from '../../../src/interfaces/PlayerInterface.js';
import codeLoader from '../../../src/services/code_loader.js';
import browser from '../../../src/services/browser.js';
import RunnerPromise from '../../../lib/RunnerPromise.js';

describe('WistiaPlayer', function() {
    let player, mockApi, globalWistia;

    beforeEach(function() {
        player = new WistiaPlayer();
        mockApi = {
            play: jasmine.createSpy('play()'),
            pause: jasmine.createSpy('pause()'),
            time: jasmine.createSpy('time()'),
            volume: jasmine.createSpy('volume()'),
            bind: jasmine.createSpy('on()').and.callFake((name, callback) => {
                switch(name) {
                case 'ready':
                    callback();
                }
            }),
            unbind: jasmine.createSpy('off()'),
            ready: jasmine.createSpy('ready()').and.callFake(callback => {
                callback();
            }),
            duration: jasmine.createSpy('duration()')
        };
        globalWistia = {
            reinitialize: jasmine.createSpy('reinitialize()')
        };
        Runner.run(() => {
            player.create();
        });
        spyOn(player.element, 'appendChild');
        spyOn(player, '__setProperty__');
        spyOn(player.element, 'removeChild').and.callThrough();
        spyOn(browser, 'test');
    });

    it('should exist', function() {
        expect(player).toEqual(jasmine.any(ThirdPartyPlayer));
    });

    it('should implement the PlayerInterface', function() {
        expect(player).toImplement(PlayerInterface);
    });

    it('should set the api name', function() {
        expect(player.__api__.name).toBe('WistiaPlayer');
    });

    describe('the loadPlayer function', function() {
        let mockDiv, mockFrame;

        beforeEach(function() {
            mockFrame = {
                addEventListener: jasmine.createSpy('addEventListener()').and.callFake((name, callback) => {
                    callback();
                }),
                wistiaApi: mockApi
            };
            mockDiv = {
                firstChild: mockFrame,
                innerHTML: ''
            };
           spyOn(codeLoader, 'load').and.returnValue(Promise.resolve(globalWistia));
           spyOn(document, 'createElement').and.callFake(name => {
               if(name === 'div') {
                   return mockDiv;
               }
           });
           browser.test.and.returnValue(RunnerPromise.resolve(false));
        });

        describe('appending the iframe', function() {
            it('should happen', function(done) {
                player.__api__.loadPlayer('some src').then(() => {
                    expect(player.element.appendChild).toHaveBeenCalled();
                    process.nextTick(done);
                }, done.fail);
            });
            
            it('should be given the correct embed params on desktop', function(done) {
                browser.test.and.returnValue(RunnerPromise.resolve(false));
                player.__api__.loadPlayer('some src').then(() => {
                    expect(mockDiv.innerHTML).toContain('?playerPreference=html5&volume=1&videoQuality=auto');
                    process.nextTick(done);
                }, done.fail);
            });
            
            it('should be given the correct embed params on mobile', function(done) {
                browser.test.and.returnValue(RunnerPromise.resolve(true));
                player.__api__.loadPlayer('some src').then(() => {
                    expect(mockDiv.innerHTML).toContain('?playerPreference=html5&volume=1&videoQuality=sd-only');
                    process.nextTick(done);
                }, done.fail);
            });
        });

        describe('when the iframe loads', function() {
            let api;
            
            beforeEach(function(done) {
                player.__api__.loadPlayer('some src').then(result => {
                    api = result;
                    process.nextTick(done);
                }, done.fail);
            });
            
            it('should call the codeLoader', function() {
                expect(codeLoader.load).toHaveBeenCalled();
            });

            it('should reinitialize in case there are new iframes', function() {
                expect(globalWistia.reinitialize).toHaveBeenCalled();
            });

            it('should resolve with the api', function() {
                expect(api).toEqual(mockApi);
            });

            it('should wait for the player to be ready', function() {
                expect(mockApi.ready).toHaveBeenCalled();
            });
        });
    });

    describe('the set api methods', function() {
        it('should implement unload', function() {
            player.element.innerHTML = '<div></div>';
            Runner.run(() => {
                player.__api__.methods.unload(mockApi);
            });
            expect(player.element.innerHTML).toBe('');
            expect(player.element.removeChild).toHaveBeenCalled();
        });

        it('should inplement play', function() {
            player.__api__.methods.play(mockApi);
            expect(mockApi.play).toHaveBeenCalled();
        });

        it('should implement pause', function() {
            player.__api__.methods.pause(mockApi);
            expect(mockApi.pause).toHaveBeenCalled();
        });


        it('should implement seek', function() {
            player.__api__.methods.seek(mockApi, 123);
            expect(mockApi.time).toHaveBeenCalledWith(123);
        });

        it('should implement volume', function() {
            player.__api__.methods.volume(mockApi, 123);
            expect(mockApi.volume).toHaveBeenCalledWith(123);
        });

        it('should implement addEventListener', function() {
            const handler = jasmine.createSpy('handler()');
            player.__api__.methods.addEventListener(mockApi, 'foo', handler);
            expect(mockApi.bind).toHaveBeenCalledWith('foo', jasmine.any(Function));
        });

        it('should implement removeEventListener', function() {
            player.__api__.methods.removeEventListener(mockApi, 'foo');
            expect(mockApi.unbind).toHaveBeenCalledWith('foo');
        });
    });

    describe('the implemented api events', function() {
        it('should handle the end event', function() {
            player.__api__.events.end();
            expect(player.__setProperty__).toHaveBeenCalledWith('ended', true);
            expect(player.__setProperty__).toHaveBeenCalledWith('paused', true);
        });

        it('should handle the pause event', function() {
            player.__api__.events.pause();
            expect(player.__setProperty__).toHaveBeenCalledWith('paused', true);
        });

        it('should handle the play event', function() {
            player.__api__.events.play();
            expect(player.__setProperty__).toHaveBeenCalledWith('paused', false);
            expect(player.__setProperty__).toHaveBeenCalledWith('ended', false);
        });

        it('should handle the seek event', function() {
            player.__api__.events.seek();
            expect(player.__setProperty__).toHaveBeenCalledWith('seeking', true);
            expect(player.__setProperty__).toHaveBeenCalledWith('seeking', false);
        });

        it('should handle the timechange event', function() {
            player.__api__.events.timechange(123);
            expect(player.__setProperty__).toHaveBeenCalledWith('currentTime', 123);
        });

        it('should handle the volumechange event', function() {
            player.__api__.events.volumechange(123);
            expect(player.__setProperty__).toHaveBeenCalledWith('volume', 123);
        });

        it('should handle the widthchange event', function() {
            player.__api__.events.widthchange(123);
            expect(player.__setProperty__).toHaveBeenCalledWith('width', 123);
        });

        it('should handle the heightchange event', function() {
            player.__api__.events.heightchange(123);
            expect(player.__setProperty__).toHaveBeenCalledWith('height', 123);
        });
    });

    describe('the api onReady callback', function() {
        it('should set the duration', function() {
            mockApi.duration.and.returnValue(123);
            player.__api__.onReady(mockApi);
            expect(mockApi.duration).toHaveBeenCalled();
            expect(player.__setProperty__).toHaveBeenCalledWith('duration', 123);
        });
    });
});
