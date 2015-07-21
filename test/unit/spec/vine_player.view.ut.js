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
        ['minimize'].forEach(method => {
            describe(`${method}()`, function() {
                it('should return an Error', function() {
                    expect(player[method]()).toEqual(new Error(`VinePlayer cannot ${method}.`));
                });
            });
        });

        describe('play', function() {
            beforeEach(function() {
                spyOn(player, 'loadSrc');
            });

            describe('if the src doesn\'t exist', function() {
                beforeEach(function() {
                    player.src = null;
                    player.play();
                });

                it('shouldn\'t load the src of the player', function() {
                    expect(player.loadSrc).not.toHaveBeenCalled();
                });
            });

            describe('if the src is invalid', function() {
                beforeEach(function() {
                    player.src = 'invalid src';
                    player.play();
                });

                it('shouldn\'t load the src of the player', function() {
                    expect(player.loadSrc).not.toHaveBeenCalled();
                });
            });

            describe('if the src is valid', function() {
                beforeEach(function() {
                    player.src = '<iframe src="https://vine.co/v/12345/embed/simple"></iframe>';
                    player.play();
                });

                it('should add the autoplay query param to the src of the player', function() {
                    expect(player.loadSrc).toHaveBeenCalledWith('<iframe src="https://vine.co/v/12345/embed/simple?audio=1"></iframe>');
                });
            });
        });

        describe('pause', function() {
            beforeEach(function() {
                spyOn(player, 'unload');
                player.pause();
            });

            it('should unload the player', function() {
                expect(player.unload).toHaveBeenCalled();
            });
        });

        describe('load', function() {
            beforeEach(function() {
                spyOn(player, 'loadSrc');
                player.src = '<p>Hello world!</p><p>What\'s up?!</p>';
                player.load();
            });

            it('should load the src of the player', function() {
                expect(player.loadSrc).toHaveBeenCalledWith('<p>Hello world!</p><p>What\'s up?!</p>');
            });
        });

        describe('loadSrc(src)', function() {
            let canplay;

            beforeEach(function() {
                canplay = jasmine.createSpy('canplay()');
                player.on('canplay', canplay);

                spyOn(player, 'create').and.callThrough();
                spyOn(player, 'unload').and.callThrough();
                player.src = '<p>Hello world!</p><p>What\'s up?!</p>';

                Runner.run(() => player.loadSrc(player.src));
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

            it('should emit "canplay"', function() {
                expect(canplay).toHaveBeenCalled();
            });

            it('should make the readyState 3', function() {
                expect(player.readyState).toBe(3);
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

            describe('if the src has a script in it', function() {
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
                    player.src = '<p id="code">The embed code.</p>';
                    Runner.run(() => player.load());

                    embedCode = player.element.querySelector('#code');

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
