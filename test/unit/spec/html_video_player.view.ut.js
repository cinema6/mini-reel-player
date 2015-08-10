import HtmlVideoPlayer from '../../../src/players/HtmlVideoPlayer.js';
import CorePlayer from '../../../src/players/CorePlayer.js';
import Runner from '../../../lib/Runner.js';
import PlayerInterface from '../../../src/interfaces/PlayerInterface.js';
import {EventEmitter} from 'events';

describe('HtmlVideoPlayer', function() {
    let player, video;

    function Video() {
        EventEmitter.call(this);
        for (var method in EventEmitter.prototype) {
            this[method] = EventEmitter.prototype[method];
        }

        this.play = jasmine.createSpy('Runner.run(() => player.play());');
        this.pause = jasmine.createSpy('player.pause()');
        this.load = jasmine.createSpy('Runner.run(() => player.load());');
        this.webkitExitFullscreen = jasmine.createSpy('player.webkitExitFullscreen()');
        this.currentTime = 0;
        this.ended = false;
        this.duration = NaN;
        this.volume = 0;
        this.paused = true;
        this.muted = false;
        this.src = null;
        this.readyState = 0;

        /* constants */
        this.HAVE_NOTHING = 0;
        this.HAVE_METADATA = 1;
        this.HAVE_CURRENT_DATA = 2;
        this.HAVE_FUTURE_DATA = 3;
        this.HAVE_ENOUGH_DATA = 4;

        this.addEventListener = this.on;
        this.removeEventListener = this.removeListener;

        return this;
    }

    beforeEach(function() {
        player = new HtmlVideoPlayer();
        const createElement = document.createElement;
        spyOn(document, 'createElement').and.callFake(type => {
            switch (type.toLowerCase()) {
            case 'video':
                return (video = Video.call(createElement.call(document, 'span')));
            default:
                return createElement.apply(document, arguments);
            }
        });
    });

    it('should exist', function() {
        expect(player).toEqual(jasmine.any(CorePlayer));
    });

    it('should implement the PlayerInterface', function() {
        expect(player).toImplement(PlayerInterface);
    });

    describe('properties:', function() {
        describe('src', function() {
            it('should be null', function() {
                expect(player.src).toBeNull();
            });
        });

        describe('loop', function() {
            it('should be false', function() {
                expect(player.loop).toBe(false);
            });
        });

        describe('htmlVideo', function() {
            it('should be null', function() {
                expect(player.__private__.htmlVideo).toBeNull();
            });
        });

        describe('currentTime', function() {
            it('should be 0', () => expect(player.currentTime).toBe(0));
            it('should be settable', () => expect(player.currentTime = 5).toBe(5));
        });

        describe('duration', function() {
            beforeEach(() => {
                Runner.run(() => player.load());
                video.duration = 5;
            });

            it('should get the duration from the html video', () => expect(player.duration).toBe(5));
            it('should not be settable', () => expect(() => player.duration = 5).toThrow());
        });

        describe('ended', function() {
            beforeEach(() => {
                Runner.run(() => player.load());
            });

            it('should be false', () => expect(player.ended).toBe(false));
            it('should not be settable', () => expect(() => player.ended = true).toThrow());
        });

        describe('paused', function() {
            beforeEach(() => {
                Runner.run(() => player.load());
            });

            it('should be true', () => expect(player.paused).toBe(true));
            it('should not be settable', () => expect(() => player.paused = false).toThrow());
        });

        describe('muted', function() {
            beforeEach(() => {
                Runner.run(() => player.load());
            });

            it('should be false', () => expect(player.muted).toBe(false));
            it('should not be settable', () => expect(() => player.muted = true).toThrow());
        });

        describe('volume', function() {
            beforeEach(() => {
                Runner.run(() => player.load());
                video.volume = 1;
            });

            it('should be 1', () => expect(player.volume).toBe(1));
            it('should not be settable', () => expect(() => player.volume = 0).toThrow());
        });

        describe('readyState', function() {
            beforeEach(() => {
                Runner.run(() => player.load());
            });

            it('should be 0', () => expect(player.readyState).toBe(0));
            it('should not be settable', () => expect(() => player.readyState = 3).toThrow());
        });

        describe('seeking', function() {
            beforeEach(function() {
                Runner.run(() => player.load());
                video.seeking = true;
            });

            it('should be false', () => {
                expect(player.seeking).toEqual(true);
            });

            it('should not be settable', () => expect(() => player.seeking = true).toThrow());
        });

        describe('error', function() {
            beforeEach(function() {
                Runner.run(() => player.load());
                video.error = 'some error';
            });
            it('should be set', function() {
                expect(player.error).toBe('some error');
            });
            it('should not be settable', () => expect(() => player.error = new Error()).toThrow());
        });
    });

    describe('methods:', function() {
        describe('play', function() {
            beforeEach(function() {
                const video = document.createElement('video');
                video.play = jasmine.createSpy('play');
                player.__private__.htmlVideo = video;
                player.play();
            });

            it('should call play on the video', function() {
                expect(player.__private__.htmlVideo.play).toHaveBeenCalled();
            });
        });

        describe('pause', function() {
            beforeEach(function() {
                const video = document.createElement('video');
                video.pause = jasmine.createSpy('pause');
                player.__private__.htmlVideo = video;
                player.pause();
            });

            it('should call pause on the video', function() {
                expect(player.__private__.htmlVideo.pause).toHaveBeenCalled();
            });
        });

        describe('minimize()', function() {
            beforeEach(function() {
                Runner.run(() => player.load());
                player.minimize();
            });

            it('should exit fullscreen mode', function() {
                expect(video.webkitExitFullscreen).toHaveBeenCalled();
            });
        });

        describe('load()', function() {
        });

        describe('unload()', function() {
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

    describe('events', () => {
        let spy;

        beforeEach(() => {
            Runner.run(() => player.load());
            spy = jasmine.createSpy('spy');
        });


        ['loadedmetadata', 'canplay', 'play', 'pause', 'error', 'ended', 'timeupdate'].forEach(event => {
            describe(event + ' proxy', () => {
                beforeEach(() => {
                    player.on(event, spy);
                    video.emit(event);
                });

                it('should proxy the event', () => {
                    expect(spy).toHaveBeenCalled();
                });
            });
        });

        describe('canplay', () => {
            beforeEach(() => {
                spyOn(player.element, 'appendChild');
            });

            it('should append the video', () => {
                video.emit('canplay');
                expect(player.element.appendChild).toHaveBeenCalled();
            });
        });
    });
});
