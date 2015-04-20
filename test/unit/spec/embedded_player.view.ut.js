import EmbeddedPlayer from '../../../src/players/EmbeddedPlayer.js';
import CorePlayer from '../../../src/players/CorePlayer.js';
import Runner from '../../../lib/Runner.js';
import PlayerInterface from '../../../src/interfaces/PlayerInterface.js';

describe('EmbeddedPlayer', function() {
    let player;

    beforeEach(function() {
        player = new EmbeddedPlayer();
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
        ['play', 'pause', 'minimize'].forEach(method => {
            describe(`${method}()`, function() {
                it('should return an Error', function() {
                    expect(player[method]()).toEqual(new Error(`EmbeddedPlayer cannot ${method}.`));
                });
            });
        });

        describe('load()', function() {
            beforeEach(function() {
                spyOn(player, 'create').and.callThrough();
                spyOn(player, 'unload').and.callThrough();
                player.src = '<p>Hello world!</p><p>What\'s up?!</p>';

                Runner.run(() => player.load());
            });

            it('should create the element', function() {
                expect(player.create).toHaveBeenCalled();
            });

            it('should call unload()', function() {
                expect(player.unload).toHaveBeenCalled();
            });

            it('should innerHTML the src', function() {
                expect(player.element.innerHTML).toContain(player.src);
            });

            describe('if called again with the same src', function() {
                let oldChildren, newChildren;

                beforeEach(function() {
                    player.create.calls.reset();
                    player.unload.calls.reset();
                    oldChildren = Array.prototype.slice.call(player.element.childNodes);

                    Runner.run(() => player.load());
                    newChildren = Array.prototype.slice.call(player.element.childNodes);
                });

                it('should not create the element', function() {
                    expect(player.create).not.toHaveBeenCalled();
                });

                it('should not unload the player', function() {
                    expect(player.unload).not.toHaveBeenCalled();
                });

                it('should not replace the contents', function() {
                    expect(newChildren).toEqual(oldChildren);
                    oldChildren.forEach((oldChild, index) => expect(newChildren[index]).toBe(oldChild));
                });
            });

            describe('if called again with a different src', function() {
                let poster;

                beforeEach(function() {
                    player.create.calls.reset();
                    player.unload.calls.reset();
                    player.src = '<span>Hello!</span>';
                    poster = player.element.querySelector('.c6-view');

                    Runner.run(() => player.load());
                });

                it('should not create the element', function() {
                    expect(player.create).not.toHaveBeenCalled();
                });

                it('should unload() the player', function() {
                    expect(player.unload).toHaveBeenCalled();
                });

                it('should replace the contents', function() {
                    expect(player.element.innerHTML).toContain(player.src);
                });

                it('should not re-create its poster', function() {
                    expect(player.element.querySelector('.c6-view')).toBe(poster);
                });
            });

            describe('if the src has a script in in', function() {
                let script;

                beforeEach(function() {
                    const createElement = document.createElement;
                    player.src = '<div style=\"text-align:center\">\n    <script src=\"http://pshared.5min.com/Scripts/PlayerSeed.js?sid=281&width=560&height=450&playList=517914408\"><\/script>\n    <br/>\n<\/div>';
                    spyOn(document, 'createElement').and.callFake(type => (script = createElement.call(document, type)));

                    Runner.run(() => player.load());
                });

                it('should create a new script', function() {
                    expect(document.createElement).toHaveBeenCalledWith('script');
                });

                it('should copy the script\'s attributes to the new element', function() {
                    expect(script.src).toBe('http://pshared.5min.com/Scripts/PlayerSeed.js?sid=281&width=560&height=450&playList=517914408');
                });

                it('should inject its script into the player', function() {
                    expect(player.element.querySelector('script')).toBe(script);
                });
            });
        });

        describe('unload()', function() {
            describe('if load() has not been called yet', function() {
                it('should do nothing', function() {
                    expect(() => Runner.run(() => player.unload())).not.toThrow();
                });
            });

            describe('if load() has been called', function() {
                let embedCode;
                let poster;
                let children;

                beforeEach(function() {
                    player.src = '<p id="code">The embed code.</p>';
                    Runner.run(() => player.load());

                    embedCode = player.element.querySelector('#code');
                    poster = player.element.querySelector('.c6-view');

                    Runner.run(() => player.unload());
                    children = Array.prototype.slice.call(player.element.childNodes);
                });

                it('should remove the embed code', function() {
                    expect(children).not.toContain(embedCode);
                });

                it('should not remove the poster', function() {
                    expect(children).toContain(poster);
                });

                it('should make load() do something again', function() {
                    Runner.run(() => player.load());

                    expect(player.element.innerHTML).toContain(player.src);
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
