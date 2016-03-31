import PlayerInterface from '../../../src/interfaces/PlayerInterface.js';
import Runner from '../../../lib/Runner.js';
import ThirdPartyPlayer from '../../../src/players/ThirdPartyPlayer.js';
import {noop, extend} from '../../../lib/utils.js';

const proxyquire = require('proxyquireify')(require);

describe('Facebook Player', function() {
    let player, mockApi, mockFacebook, codeLoader, timer;

    beforeEach(function() {
        mockApi = {
            subscribe: jasmine.createSpy('subscribe()'),
            seek: jasmine.createSpy('seek()'),
            play: jasmine.createSpy('play'),
            pause: jasmine.createSpy('pause()'),
            getDuration: jasmine.createSpy('getDuration()'),
            getCurrentPosition: jasmine.createSpy('getCurrentPosition()'),
            getVolume: jasmine.createSpy('getVolume')
        };
        mockFacebook = {
            XFBML: {
                parse: jasmine.createSpy('parse()')
            },
            Event: {
                subscribe: jasmine.createSpy('subscribe'),
                unsubscribe: jasmine.createSpy('unsubscribe')
            }
        };
        spyOn(Runner, 'schedule');
        spyOn(global, 'focus').and.callThrough();
        spyOn(global, 'addEventListener').and.callThrough();
        spyOn(global, 'removeEventListener').and.callThrough();
        spyOn(global, 'setTimeout').and.callThrough();
        spyOn(global, 'clearTimeout').and.callThrough();
        spyOn(document, 'hasFocus');
        codeLoader = {
            load: jasmine.createSpy('load()'),
            configure: jasmine.createSpy('configure()')
        };
        timer = {
            cancel: jasmine.createSpy('cancel()'),
            interval: jasmine.createSpy('interval()')
        };
        const FacebookPlayer = proxyquire('../../../src/players/FacebookPlayer.js', {
            '../services/code_loader.js': {
                __esModule: true,
                '@noCallThru': true,
                default: codeLoader
            },
            '../../lib/Runner.js': {
                __esModule: true,
                '@noCallThru': true,
                default: Runner
            },
            '../../lib/timer.js': {
                __esModule: true,
                '@noCallThru': true,
                default: timer
            },
            '../../lib/utils.js': {
                __esModule: true,
                '@noCallThru': true,
                noop: noop,
                extend: extend
            },
            './ThirdPartyPlayer.js': {
                __esModule: true,
                '@noCallThru': true,
                default: ThirdPartyPlayer
            }
        }).default;
        player = new FacebookPlayer();
        spyOn(player.__private__, 'waitForFocus');
        spyOn(player.__private__, 'waitForPlayer');
        spyOn(player, '__setProperty__');
        spyOn(player, 'reload');
        Runner.run(() => player.create());
    });

    it('should exist', function() {
        expect(player).toEqual(jasmine.any(ThirdPartyPlayer));
    });

    it('should implement the PlayerInterface', function() {
        expect(player).toImplement(PlayerInterface);
    });

    it('should set the api name', function() {
        expect(player.__api__.name).toBe('FacebookPlayer');
    });

    it('should configure the codeLoader', function() {
        const afterFn = codeLoader.configure.calls.mostRecent().args[1].after;
        const initSpy = jasmine.createSpy('init');
        expect(codeLoader.configure).toHaveBeenCalledWith('facebook', {
            src: 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.5',
            after: jasmine.any(Function)
        });
        global.FB = {
            init: initSpy
        };
        afterFn();
        expect(initSpy).toHaveBeenCalledWith({
            appId: jasmine.any(String),
            version: 'v2.5'
        });
    });

    describe('private functions', function() {
        describe('waitForFocus', function() {
            beforeEach(function() {
                player.__private__.waitForFocus.and.callThrough();
            });

            it('should attempt to focus the window', function() {
                player.__private__.waitForFocus();
                expect(global.focus).toHaveBeenCalledWith();
            });

            it('resolve immediately if the document has focus', function(done) {
                document.hasFocus.and.returnValue(true);
                player.__private__.waitForFocus().then(() => process.nextTick(done), done.fail);
            });

            it('should wait for the document to get focus', function(done) {
                document.hasFocus.and.returnValue(false);
                global.addEventListener.and.callFake((event, handler) => {
                    if(event === 'focus') {
                        handler();
                    }
                });
                player.__private__.waitForFocus().then(() => {
                    const fn = global.addEventListener.calls.mostRecent().args[1];
                    expect(global.addEventListener).toHaveBeenCalledWith('focus', jasmine.any(Function), false);
                    expect(global.removeEventListener).toHaveBeenCalledWith('focus', fn, false);
                }).then(() => process.nextTick(done), done.fail);
            });
        });

        describe('waitForPlayer', function() {
            beforeEach(function() {
                player.__private__.waitForPlayer.and.callThrough();
            });

            it('should timeout when the video load poll has not begun', function(done) {
                global.setTimeout.and.callFake(fn => {
                    fn();
                });
                player.__private__.waitForPlayer('id', mockFacebook).then(done.fail).catch(error => {
                    expect(global.setTimeout).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Number));
                    expect(timer.cancel).not.toHaveBeenCalled();
                    expect(mockFacebook.Event.unsubscribe).toHaveBeenCalledWith('xfbml.ready');
                    expect(error).toBeDefined();
                }).then(() => process.nextTick(done), done.fail);
            });

            it('should timeout when the video load poll has begun', function(done) {
                timer.interval.and.returnValue('interval');
                mockFacebook.Event.subscribe.and.callFake((event, handler) => {
                    handler({
                        type: 'video',
                        id: 'id'
                    });
                    const fn = global.setTimeout.calls.mostRecent().args[0];
                    fn();
                });
                player.__private__.waitForPlayer('id', mockFacebook).then(done.fail).catch(error => {
                    expect(global.setTimeout).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Number));
                    expect(timer.cancel).toHaveBeenCalledWith('interval');
                    expect(mockFacebook.Event.unsubscribe).toHaveBeenCalledWith('xfbml.ready');
                    expect(error).toBeDefined();
                }).then(() => process.nextTick(done), done.fail);
            });

            it('should wait for the video to be available', function(done) {
                global.setTimeout.and.returnValue('timeout');
                mockFacebook.Event.subscribe.and.callFake((event, handler) => {
                    handler({
                        type: 'video',
                        id: 'id',
                        instance: mockApi
                    });
                });
                timer.interval.and.callFake(fn => {
                    process.nextTick(fn);
                    return 'interval';
                });
                mockApi.getDuration.and.returnValue(123);
                player.__private__.waitForPlayer('id', mockFacebook).then(api => {
                    expect(mockFacebook.Event.subscribe).toHaveBeenCalledWith('xfbml.ready', jasmine.any(Function));
                    expect(timer.interval).toHaveBeenCalledWith(jasmine.any(Function), 250);
                    expect(mockApi.getDuration).toHaveBeenCalledWith();
                    expect(global.clearTimeout).toHaveBeenCalledWith('timeout');
                    expect(timer.cancel).toHaveBeenCalledWith('interval');
                    expect(mockFacebook.Event.unsubscribe).toHaveBeenCalledWith('xfbml.ready');
                    expect(api).toBe(mockApi);
                }).then(() => process.nextTick(done), done.fail);
            });
        });
    });

    describe('the loadPlayer function', function() {
        beforeEach(function(done) {
            codeLoader.load.and.returnValue({
                then: fn => Runner.run(() => fn(mockFacebook))
            });
            player.__private__.waitForFocus.and.returnValue(Promise.resolve());
            codeLoader.load.and.returnValue(mockFacebook);
            player.__api__.loadPlayer('https://facebook.com/facebook/videos/123').then(done, done.fail);
        });

        it('should wait for focus', function() {
            expect(player.__private__.waitForFocus).toHaveBeenCalledWith();
        });

        it('embed the player in an afterRender queue', function() {
            const fn = Runner.schedule.calls.mostRecent().args[2];
            expect(Runner.schedule).toHaveBeenCalledWith('afterRender', player, jasmine.any(Function));
            fn();
            expect(player.element.innerHTML).toContain('fb-video-123');
            expect(player.element.innerHTML).toContain('https://facebook.com/facebook/videos/123');
        });

        it('should load the facebook sdk', function() {
            expect(codeLoader.load).toHaveBeenCalledWith('facebook', document.body, 'insertBefore', document.body.firstChild);
        });

        it('should look re-render facebook plugins', function() {
            expect(mockFacebook.XFBML.parse).toHaveBeenCalledWith(player.element);
        });

        it('should wait for the player to be loaded', function() {
            expect(player.__private__.waitForPlayer).toHaveBeenCalledWith('fb-video-123', mockFacebook);
        });
    });

    describe('the api methods', function() {
        it('should implement addEventListener', function() {
            const fn = jasmine.createSpy('fn()');
            player.__api__.methods.addEventListener(mockApi, 'foo', fn);
            expect(mockApi.subscribe).toHaveBeenCalledWith('foo', jasmine.any(Function));
            const handler = mockApi.subscribe.calls.mostRecent().args[1];
            handler('arg');
            expect(fn).toHaveBeenCalledWith('arg');
        });

        it('should implement removeEventListener', function() {
            expect(player.__api__.methods.removeEventListener).toBe(noop);
        });

        it('should implement play', function() {
            player.__api__.methods.play(mockApi);
            expect(mockApi.play).toHaveBeenCalledWith();
        });

        it('should implement pause', function() {
            player.__api__.methods.pause(mockApi);
            expect(mockApi.pause).toHaveBeenCalledWith();
        });

        it('should implement unload', function() {
            player.__api__.methods.unload(mockApi);
            expect(Runner.schedule).toHaveBeenCalledWith('afterRender', player.element, 'removeChild', [player.element.firstChild]);
        });

        it('should implement seek', function() {
            player.__api__.methods.seek(mockApi, 123);
            expect(mockApi.seek).toHaveBeenCalledWith(123);
        });
    });

    describe('the implemented api events', function() {
        it('should handle the startedPlaying event', function() {
            player.__api__.events.startedPlaying();
            expect(player.__setProperty__).toHaveBeenCalledWith('ended', false);
            expect(player.__setProperty__).toHaveBeenCalledWith('paused', false);
        });

        it('should handle the paused event', function() {
            player.__api__.events.paused();
            expect(player.__setProperty__).toHaveBeenCalledWith('paused', true);
        });

        it('should handle the finishedPlaying event', function() {
            player.__api__.events.finishedPlaying();
            expect(player.__setProperty__).toHaveBeenCalledWith('ended', true);
            expect(player.__setProperty__).toHaveBeenCalledWith('paused', true);
        });

        it('should handle the error event', function() {
            player.__api__.events.error('epic fail');
            expect(player.__setProperty__).toHaveBeenCalledWith('error', 'epic fail');
        });
    });

    describe('the onReady callback', function() {
        beforeEach(function() {
            const div = document.createElement('div');
            player.element.appendChild(div);
        });

        it('should set the duration', function() {
            mockApi.getDuration.and.returnValue(123);
            player.__api__.onReady(mockApi);
            expect(mockApi.getDuration).toHaveBeenCalledWith();
            expect(player.__setProperty__).toHaveBeenCalledWith('duration', 123);
        });

        it('should set the background color', function() {
            player.__api__.onReady(mockApi);
            expect(player.element.firstChild.style['background-color']).not.toBe('');
        });
    });

    describe('polling', function() {
        it('should set the polling delay', function() {
            expect(player.__api__.pollingDelay).toBe(250);
        });

        it('should poll for the current time', function() {
            mockApi.getCurrentPosition.and.returnValue(123);
            player.__api__.onPoll(mockApi);
            expect(mockApi.getCurrentPosition).toHaveBeenCalledWith();
            expect(player.__setProperty__).toHaveBeenCalledWith('currentTime', 123);
        });

        it('should poll for the volume', function() {
            mockApi.getVolume.and.returnValue(1);
            player.__api__.onPoll(mockApi);
            expect(mockApi.getVolume).toHaveBeenCalledWith();
            expect(player.__setProperty__).toHaveBeenCalledWith('volume', 1);
        });

        it('should poll for muted', function() {
            mockApi.getVolume.and.returnValue(0.5);
            player.__api__.onPoll(mockApi);
            expect(mockApi.getVolume).toHaveBeenCalledWith();
            expect(player.__setProperty__).toHaveBeenCalledWith('muted', false);
            mockApi.getVolume.calls.reset();
            player.__setProperty__.calls.reset();
            mockApi.getVolume.and.returnValue(0);
            player.__api__.onPoll(mockApi);
            expect(mockApi.getVolume).toHaveBeenCalledWith();
            expect(player.__setProperty__).toHaveBeenCalledWith('muted', true);
        });
    });
});
