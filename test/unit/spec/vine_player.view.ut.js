import VinePlayer from '../../../src/players/VinePlayer.js';
import CorePlayer from '../../../src/players/CorePlayer.js';
import Runner from '../../../lib/Runner.js';
import PlayerInterface from '../../../src/interfaces/PlayerInterface.js';

describe('VinePlayer', function() {
    let player;

    beforeEach(function() {
        player = new VinePlayer();
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

        describe('currentTime', function() {
            it('should be 0', () => expect(player.currentTime).toBe(0));
            it('should be settable', () => expect(player.currentTime = 5).toBe(5));
        });

        describe('duration', function() {
            it('should be 0', () => expect(player.duration).toBe(0));
            it('should not be settable', () => expect(() => player.duration = 5).toThrow());
        });

        describe('ended', function() {
            it('should be false', () => expect(player.ended).toBe(false));
            it('should not be settable', () => expect(() => player.ended = true).toThrow());
        });

        describe('paused', function() {
            it('should be true', () => expect(player.paused).toBe(true));
            it('should not be settable', () => expect(() => player.paused = false).toThrow());
        });

        describe('muted', function() {
            it('should be false', () => expect(player.muted).toBe(false));
            it('should not be settable', () => expect(() => player.muted = true).toThrow());
        });

        describe('volume', function() {
            it('should be 1', () => expect(player.volume).toBe(1));
            it('should not be settable', () => expect(() => player.volume = 0).toThrow());
        });

        describe('readyState', function() {
            it('should be 0', () => expect(player.readyState).toBe(0));
            it('should not be settable', () => expect(() => player.readyState = 3).toThrow());
        });

        describe('seeking', function() {
            it('should be false', () => expect(player.seeking).toBe(false));
            it('should not be settable', () => expect(() => player.seeking = true).toThrow());
        });

        describe('error', function() {
            it('should be null', () => expect(player.error).toBeNull());
            it('should not be settable', () => expect(() => player.error = new Error()).toThrow());
        });
    });

    describe('methods:', function() {

        describe('private', function() {
            describe('loadEmbed(id, audio)', function() {
                let canplay;
                let script;

                beforeEach(function() {
                    const createElement = document.createElement;

                    canplay = jasmine.createSpy('canplay()');
                    player.on('canplay', canplay);

                    spyOn(player, 'create').and.callThrough();
                    spyOn(player, 'unload').and.callThrough();
                    spyOn(document, 'createElement').and.callFake(type => (script = createElement.call(document, type)));

                    player.src = 'abc123';

                    Runner.run(() => player.__private__.loadEmbed(player.src, false));
                });

                it('should create the element', function() {
                    expect(player.create).toHaveBeenCalled();
                });

                it('should call unload()', function() {
                    expect(player.unload).toHaveBeenCalled();
                });

                it('should ultimately set the innerHTML to the Vine embed code', function() {
                    expect(player.element.innerHTML).toEqual(
                        '<iframe src="https://vine.co/v/abc123/embed/simple" ' +
                        'style="width:100%;height:100%" frameborder="0"></iframe>' +
                        '<script src="https://platform.vine.co/static/scripts/embed.js"></script>'
                    );
                });

                it('should emit "canplay"', function() {
                    expect(canplay).toHaveBeenCalled();
                });

                it('should make the readyState 3', function() {
                    expect(player.readyState).toBe(3);
                });

                it('should create a new script', function() {
                    expect(document.createElement).toHaveBeenCalledWith('script');
                });

                it('should copy the script\'s attributes to the new element', function() {
                    expect(script.src).toBe('https://platform.vine.co/static/scripts/embed.js');
                });

                it('should inject its script into the player', function() {
                    expect(player.element.querySelector('script')).toBe(script);
                });
            });
        });

        ['minimize'].forEach(method => {
            describe(`${method}()`, function() {
                it('should return an Error', function() {
                    expect(player[method]()).toEqual(new Error(`VinePlayer cannot ${method}.`));
                });
            });
        });

        describe('play', function() {
            beforeEach(function() {
                spyOn(player.__private__, 'loadEmbed');
                player.src = 'abc123';
                player.play();
            });

            it('should load the embed with audio', function() {
                expect(player.__private__.loadEmbed).toHaveBeenCalledWith('abc123', true);
            });
        });

        ['load', 'pause'].forEach(method => {
            describe(`${method}()`, function() {
                beforeEach(function() {
                    spyOn(player.__private__, 'loadEmbed');
                    player.src = 'abc123';
                    player[method]();
                });

                it('should load the embed without audio', function() {
                    expect(player.__private__.loadEmbed).toHaveBeenCalledWith('abc123', false);
                });
            });
        });

        describe('unload()', function() {
            beforeEach(function() {
                spyOn(CorePlayer.prototype, 'unload');
            });

            describe('if load() has not been called yet', function() {
                beforeEach(function() {
                    player.unload();
                });

                it('should call super()', function() {
                    expect(CorePlayer.prototype.unload).toHaveBeenCalled();
                });
            });

            describe('if load() has been called', function() {
                let embedCode;
                let children;

                beforeEach(function() {
                    player.src = 'abc123';
                    Runner.run(() => player.load());

                    embedCode = player.element.querySelector('iframe');

                    Runner.run(() => player.unload());
                    children = Array.prototype.slice.call(player.element.childNodes);
                });

                it('should call super()', function() {
                    expect(CorePlayer.prototype.unload).toHaveBeenCalled();
                });

                it('should make the readyState 0', function() {
                    expect(player.readyState).toBe(0);
                });

                it('should remove the embed code', function() {
                    expect(children).not.toContain(embedCode);
                });

                it('should make load() do something again', function() {
                    Runner.run(() => player.load());

                    expect(player.element.innerHTML).toEqual(
                        '<iframe src="https://vine.co/v/abc123/embed/simple" ' +
                        'style="width:100%;height:100%" frameborder="0"></iframe>' +
                        '<script src="https://platform.vine.co/static/scripts/embed.js"></script>'
                    );
                });
            });
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
});
