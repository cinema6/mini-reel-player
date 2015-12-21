import BrightcovePlayer from '../../../src/players/BrightcovePlayer.js';
import ThirdPartyPlayer from '../../../src/players/ThirdPartyPlayer.js';
import Runner from '../../../lib/Runner.js';
import PlayerInterface from '../../../src/interfaces/PlayerInterface.js';

describe('Brightcove Player', function() {
    let player, mockApi;

    beforeEach(function() {
        player = new BrightcovePlayer();
        mockApi = {
            one: jasmine.createSpy('one()'),
            ready: jasmine.createSpy('ready()'),
            duration: jasmine.createSpy('duration()'),
            play: jasmine.createSpy('play()'),
            pause: jasmine.createSpy('pause()'),
            unload: jasmine.createSpy('unload()'),
            currentTime: jasmine.createSpy('currentTime()'),
            volume: jasmine.createSpy('volume()'),
            exitFullscreen: jasmine.createSpy('exitFullscreen()'),
            on: jasmine.createSpy('on()'),
            off: jasmine.createSpy('off()'),
            error: jasmine.createSpy('error()'),
            ended: jasmine.createSpy('ended()'),
            isFullscreen: jasmine.createSpy('isFullscreen()'),
            paused: jasmine.createSpy('paused()'),
            width: jasmine.createSpy('width()'),
            height: jasmine.createSpy('height()')
        };
        spyOn(player, '__setProperty__');
        Runner.run(() => {
            player.create();
        });
    });

    it('should exist', function() {
        expect(player).toEqual(jasmine.any(ThirdPartyPlayer));
    });

    it('should implement the PlayerInterface', function() {
        expect(player).toImplement(PlayerInterface);
    });

    it('should set the api name', function() {
        expect(player.__api__.name).toBe('BrightcovePlayer');
    });

    describe('the loadPlayer function', function() {
        var mockIframe, mockVideo, mockScript;
        var success, failure;
        
        beforeEach(function() {
            mockIframe = document.createElement('div');
            mockVideo = document.createElement('div');
            mockScript = document.createElement('div');
            success = jasmine.createSpy('success()');
            failure = jasmine.createSpy('failure()');
            spyOn(mockIframe, 'addEventListener');
            spyOn(mockScript, 'addEventListener');
            spyOn(document, 'createElement').and.callFake(function(tagName) {
                switch(tagName) {
                case 'iframe':
                    return mockIframe;
                case 'video':
                    return mockVideo;
                case 'script':
                    return mockScript;
                }
            });
            spyOn(player.element, 'appendChild');
            Runner.run(() => player.__api__.loadPlayer(JSON.stringify({
                videoid: 'video-123',
                playerid: 'player-123',
                accountid: 'account-123',
                embedid: 'embed-123'
            })).then(success, failure));
        });
        
        describe('before anything loads', function() {
            it('should create an iframe', function() {
                expect(document.createElement).toHaveBeenCalledWith('iframe');
                expect(mockIframe.getAttribute('src')).toBe('blank.html');
            });
            
            it('should create a video', function() {
                expect(document.createElement).toHaveBeenCalledWith('video');
                expect(mockVideo.getAttribute('id')).toBe('video-123');
                expect(mockVideo.getAttribute('data-video-id')).toBe('video-123');
                expect(mockVideo.getAttribute('data-account')).toBe('account-123');
                expect(mockVideo.getAttribute('data-player')).toBe('player-123');
                expect(mockVideo.getAttribute('data-embed')).toBe('embed-123');
                expect(mockVideo.getAttribute('class')).toBe('video-js');
                expect(mockVideo.style.cssText).toContain('width: 100%');
                expect(mockVideo.style.cssText).toContain('height: 100%');
                expect(mockVideo.style.cssText).toContain('position: absolute');
                expect(mockVideo.style.cssText).toContain('top: 0px');
                expect(mockVideo.style.cssText).toContain('bottom: 0px');
                expect(mockVideo.style.cssText).toContain('left: 0px');
                expect(mockVideo.style.cssText).toContain('right: 0px');
            });
            
            it('should create a script', function() {
                expect(document.createElement).toHaveBeenCalledWith('script');
                expect(mockScript.getAttribute('src')).toBe('https://players.brightcove.net/account-123/player-123_embed-123/index.min.js');
            });
            
            it('should wait for the iframe to load', function() {
                expect(mockIframe.addEventListener).toHaveBeenCalledWith('load', jasmine.any(Function), false);
            });
            
            it('should wait for the script to load', function() {
                expect(mockScript.addEventListener).toHaveBeenCalledWith('load', jasmine.any(Function), false);
            });
            
            it('should append the iframe', function() {
                expect(player.element.appendChild).toHaveBeenCalledWith(mockIframe);
            });
            
            it('should not resolve', function() {
                expect(success).not.toHaveBeenCalled();
                expect(failure).not.toHaveBeenCalled();
            });
        });
        
        describe('when the iframe loads', function() {
            beforeEach(function() {
                var handlerFn = mockIframe.addEventListener.calls.mostRecent().args[1];
                mockIframe.contentDocument = {
                    body: {
                        appendChild: jasmine.createSpy('appendChild()')
                    }
                };
                handlerFn();
            });
            
            it('should append the video and script elements', function() {
                expect(mockIframe.contentDocument.body.appendChild).toHaveBeenCalledWith(mockVideo);
                expect(mockIframe.contentDocument.body.appendChild).toHaveBeenCalledWith(mockScript);
            });
            
            it('should not resolve', function() {
                expect(success).not.toHaveBeenCalled();
                expect(failure).not.toHaveBeenCalled();
            });
        });
        
        describe('when the script loads', function() {
            beforeEach(function() {
                var handlerFn = mockScript.addEventListener.calls.mostRecent().args[1];
                mockIframe.contentWindow = {
                    videojs: jasmine.createSpy('videojs()').and.returnValue(mockApi)
                };
                handlerFn();
            });
            
            it('should initialize the video', function() {
                expect(mockIframe.contentWindow.videojs).toHaveBeenCalledWith('video-123');
            });
            
            it('should wait for metadata to be loaded', function() {
                expect(mockApi.one).toHaveBeenCalledWith('loadedmetadata', jasmine.any(Function));
            });
            
            it('should wait for the video to be ready', function() {
                expect(mockApi.ready).toHaveBeenCalledWith(jasmine.any(Function));
            });
            
            describe('when metadata is loaded', function() {
                beforeEach(function() {
                    var handlerFn = mockApi.one.calls.mostRecent().args[1];
                    mockApi.duration.and.returnValue(123);
                    handlerFn();
                });
                
                it('should set the duration property', function() {
                    expect(mockApi.duration).toHaveBeenCalledWith();
                    expect(player.__setProperty__).toHaveBeenCalledWith('duration', 123);
                });
            
                it('should not resolve', function() {
                    expect(success).not.toHaveBeenCalled();
                    expect(failure).not.toHaveBeenCalled();
                });
            });
        });
    });

    describe('the api methods', function() {
        it('should implement play', function() {
            player.__api__.methods.play(mockApi);
            expect(mockApi.play).toHaveBeenCalledWith();
        });

        it('should implement pause', function() {
            player.__api__.methods.pause(mockApi);
            expect(mockApi.pause).toHaveBeenCalledWith();
        });

        it('should implement unload', function() {
            player.element.innerHTML = 'not empty';
            Runner.run(() => player.__api__.methods.unload(mockApi));
            expect(player.element.innerHTML).toBe('');
        });

        it('should implement seek', function() {
            player.__api__.methods.seek(mockApi, 123);
            expect(mockApi.currentTime).toHaveBeenCalledWith(123);
        });

        it('should implement volume', function() {
            player.__api__.methods.volume(mockApi, 0.5);
            expect(mockApi.volume).toHaveBeenCalledWith(0.5);
        });
        
        it('should implement minimize', function() {
            player.__api__.methods.minimize(mockApi);
            expect(mockApi.exitFullscreen).toHaveBeenCalledWith();
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
        it('should handle the bc-catalog-error event', function() {
            mockApi.error.and.returnValue('epic fail');
            player.__api__.events['bc-catalog-error'](mockApi);
            expect(mockApi.error).toHaveBeenCalledWith();
            expect(player.__setProperty__).toHaveBeenCalledWith('error', 'epic fail');
        });
        
        it('should handle the durationchange event', function() {
            mockApi.duration.and.returnValue(123);
            player.__api__.events.durationchange(mockApi);
            expect(mockApi.duration).toHaveBeenCalledWith();
            expect(player.__setProperty__).toHaveBeenCalledWith('duration', 123);
        });
        
        it('should handle the ended event', function() {
            mockApi.ended.and.returnValue(true);
            player.__api__.events.ended(mockApi);
            expect(mockApi.ended).toHaveBeenCalledWith();
            expect(player.__setProperty__).toHaveBeenCalledWith('ended', true);
        });
        
        it('should handle the error event', function() {
            mockApi.error.and.returnValue('epic fail');
            player.__api__.events.error(mockApi);
            expect(mockApi.error).toHaveBeenCalledWith();
            expect(player.__setProperty__).toHaveBeenCalledWith('error', 'epic fail');
        });
        
        it('should handle the fullscreenchange event', function() {
            mockApi.isFullscreen.and.returnValue(true);
            player.__api__.events.fullscreenchange(mockApi);
            expect(mockApi.isFullscreen).toHaveBeenCalledWith();
            expect(player.__setProperty__).toHaveBeenCalledWith('minimized', false);
        });
        
        it('should handle the pause event', function() {
            mockApi.paused.and.returnValue(false);
            player.__api__.events.pause(mockApi);
            expect(mockApi.paused).toHaveBeenCalledWith();
            expect(player.__setProperty__).toHaveBeenCalledWith('paused', false);
        });
        
        it('should handle the play event', function() {
            mockApi.paused.and.returnValue(false);
            player.__api__.events.play(mockApi);
            expect(mockApi.paused).toHaveBeenCalledWith();
            expect(player.__setProperty__).toHaveBeenCalledWith('paused', false);
        });
        
        it('should handle the timeupdate event', function() {
            mockApi.currentTime.and.returnValue(123);
            player.__api__.events.timeupdate(mockApi);
            expect(mockApi.currentTime).toHaveBeenCalledWith();
            expect(player.__setProperty__).toHaveBeenCalledWith('currentTime', 123);
        });
        
        it('should handle the volumechange event', function() {
            mockApi.volume.and.returnValue(0.5);
            player.__api__.events.volumechange(mockApi);
            expect(mockApi.volume).toHaveBeenCalledWith();
            expect(player.__setProperty__).toHaveBeenCalledWith('volume', 0.5);
        });
        
        it('should handle the resize event', function() {
            mockApi.width.and.returnValue(123);
            mockApi.height.and.returnValue(321);
            player.__api__.events.resize(mockApi);
            expect(mockApi.width).toHaveBeenCalledWith();
            expect(mockApi.height).toHaveBeenCalledWith();
            expect(player.__setProperty__).toHaveBeenCalledWith('width', 123);
            expect(player.__setProperty__).toHaveBeenCalledWith('height', 321);
        });
    });
});
