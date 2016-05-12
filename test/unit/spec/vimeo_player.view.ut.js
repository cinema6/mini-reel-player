import VimeoPlayer from '../../../src/players/VimeoPlayer.js';
import vimeo from '../../../src/services/vimeo.js';
import Runner from '../../../lib/Runner.js';
import urlParser from '../../../src/services/url_parser.js';
import ThirdPartyPlayer from '../../../src/players/ThirdPartyPlayer.js';
import {noop} from '../../../lib/utils.js';

describe('VimeoPlayer', function() {
    var player;
    var mockApi;

    beforeEach(function() {
        spyOn(Runner, 'schedule').and.callThrough();
        spyOn(vimeo, 'Player');
        mockApi = {
            once: jasmine.createSpy('once()'),
            call: jasmine.createSpy('call()'),
            on: jasmine.createSpy('on()')
        };
        player = new VimeoPlayer();
        spyOn(player, '__setProperty__');
        Runner.run(() => player.create());
    });

    it('should be a ThirdPartyPlayer', function() {
        expect(player).toEqual(jasmine.any(ThirdPartyPlayer));
    });

    it('should have a name', function() {
        expect(player.__api__.name).toBe('VimeoPlayer');
    });

    describe('the loadPlayer function', function() {
        var api;

        beforeEach(function(done) {
            vimeo.Player.and.returnValue(mockApi);
            mockApi.once.and.callFake((name, handler) => {
                handler();
            });
            Runner.run(() => {
                player.__api__.loadPlayer('123').then(result => {
                    api = result;
                    process.nextTick(done);
                }).catch(done.fail);
            });
        });

        it('should create an iframe and append it to the player', function() {
            expect(Runner.schedule).toHaveBeenCalled();

            const args = Runner.schedule.calls.mostRecent().args;
            expect(args[0]).toBe('afterRender');
            expect(args[1]).toBe(player.element);
            expect(args[2]).toBe('appendChild');

            const iframe = args[3][0];
            expect(iframe).toBeDefined();
            expect(iframe.getAttribute('src')).toBe(urlParser.parse(`//player.vimeo.com/video/123?api=1&player_id=${player.id}`).href);
            expect(iframe.getAttribute('width')).toBe('100%');
            expect(iframe.getAttribute('height')).toBe('100%');
            expect(iframe.getAttribute('frameborder')).toBe('0');
            expect(iframe.getAttribute('webkitAllowFullScreen')).toBe('');
            expect(iframe.getAttribute('mozallowfullscreen')).toBe('');
            expect(iframe.getAttribute('allowFullScreen')).toBe('');
            expect(vimeo.Player).toHaveBeenCalledWith(iframe);
        });

        it('should resolve once the vimeo player is ready', function() {
            expect(mockApi.once).toHaveBeenCalledWith('ready', jasmine.any(Function));
            expect(api).toBe(mockApi);
        });
    });

    describe('api methods', function() {
        describe('pause', function() {
            beforeEach(function() {
                player.__api__.methods.pause(mockApi);
            });

            it('should instruct the api to pause', function() {
                expect(mockApi.call).toHaveBeenCalledWith('pause');
            });
        });

        describe('seek', function() {
            beforeEach(function() {
                player.__api__.methods.seek(mockApi, 123);
            });

            it('should instruct the api to seek', function() {
                expect(mockApi.call).toHaveBeenCalledWith('seekTo', 123);
            });
        });

        describe('play', function() {
            beforeEach(function() {
                player.__api__.methods.play(mockApi);
            });

            it('should instruct the api to play', function() {
                expect(mockApi.call).toHaveBeenCalledWith('play');
            });
        });

        describe('unload', function() {
            beforeEach(function() {
                player.element.innerHTML = 'hello world';
                Runner.run(() => player.__api__.methods.unload());
            });

            it('should empty the player', function() {
                expect(Runner.schedule).toHaveBeenCalledWith('afterRender', null, jasmine.any(Function));
                expect(player.element.innerHTML).toBe('');
            });
        });

        describe('volume', function() {
            beforeEach(function() {
                player.__api__.methods.volume(mockApi, 0.5);
            });

            it('should instruct the api to set the volume', function() {
                expect(mockApi.call).toHaveBeenCalledWith('setVolume', 0.5);
            });
        });

        describe('addEventListener', function() {
            var handler;

            beforeEach(function() {
                handler = jasmine.createSpy('handler()');
                player.__api__.methods.addEventListener(mockApi, 'name', handler);
            });

            it('should add an event listener', function() {
                expect(mockApi.on).toHaveBeenCalledWith('name', jasmine.any(Function));
            });
        });

        describe('remove event listener', function() {
            it('should be a noop', function() {
                expect(player.__api__.methods.removeEventListener).toBe(noop);
            });
        });
    });

    describe('the implemented api events', function() {
        it('should handle loadProgress', function() {
            player.__api__.events.loadProgress({ percent: '0' });
            expect(player.__setProperty__).not.toHaveBeenCalled();

            player.__setProperty__.calls.reset();
            player.__api__.events.loadProgress({ percent: '0.25' });
            expect(player.__setProperty__).toHaveBeenCalledWith('readyState', 4);

            player.__setProperty__.calls.reset();
            player.__api__.events.loadProgress({ percent: '0.5' });
            expect(player.__setProperty__).toHaveBeenCalledWith('readyState', 4);
        });

        it('should handle finish', function() {
            player.__api__.events.finish();
            expect(player.__setProperty__).toHaveBeenCalledWith('ended', true);
        });

        it('should handle pause', function() {
            player.__api__.events.pause();
            expect(player.__setProperty__).toHaveBeenCalledWith('paused', true);
        });

        it('should handle play', function() {
            player.__api__.events.play();
            expect(player.__setProperty__).toHaveBeenCalledWith('paused', false);
            expect(player.__setProperty__).toHaveBeenCalledWith('ended', false);
        });

        it('should handle seek', function() {
            player.__api__.events.seek();
            expect(player.__setProperty__).toHaveBeenCalledWith('seeking', true);
            expect(player.__setProperty__).toHaveBeenCalledWith('seeking', false);
        });

        it('should handle playProgress', function() {
            player.__api__.events.playProgress({ seconds: '123' });
            expect(player.__setProperty__).toHaveBeenCalledWith('currentTime', 123);
        });
    });

    describe('the api onReady callback', function() {
        it('should get the duration', function(done) {
            mockApi.call.and.returnValue(Promise.resolve(123));
            player.__api__.onReady(mockApi).then(() => {
                expect(mockApi.call).toHaveBeenCalledWith('getDuration');
                expect(player.__setProperty__).toHaveBeenCalledWith('duration', 123);
            }).then(done, done.fail);
        });
    });

    describe('api polling', function() {
        it('should have the correct polling interval', function() {
            expect(player.__api__.pollingDelay).toBe(250);
        });

        it('should poll for volume', function(done) {
            mockApi.call.and.returnValue(Promise.resolve(0.5));
            player.__api__.onPoll(mockApi).then(() => {
                expect(player.__setProperty__).toHaveBeenCalledWith('volume', 0.5);
            }).then(done, done.fail);
        });

        it('should poll for muted', function(done) {
            mockApi.call.and.returnValue(Promise.resolve(0));
            player.__api__.onPoll(mockApi).then(() => {
                expect(player.__setProperty__).toHaveBeenCalledWith('muted', true);
                player.__setProperty__.calls.reset();
                mockApi.call.and.returnValue(Promise.resolve(0.5));
                return player.__api__.onPoll(mockApi);
            }).then(() => {
                expect(player.__setProperty__).toHaveBeenCalledWith('muted', false);
            }).then(done, done.fail);
        });
    });
});
