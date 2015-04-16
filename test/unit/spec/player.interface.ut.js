describe('PlayerInterface', function() {
    import PlayerInterface from '../../../src/interfaces/PlayerInterface.js';
    let iface;

    beforeEach(function() {
        iface = new PlayerInterface();
    });

    describe('properties:', function() {
        describe('currentTime', function() {
            it('should be Number', function() {
                expect(iface.currentTime).toBe(Number);
            });
        });

        describe('duration', function() {
            it('should be Number', function() {
                expect(iface.duration).toBe(Number);
            });
        });

        describe('ended', function() {
            it('should be Boolean', function() {
                expect(iface.ended).toBe(Boolean);
            });
        });

        describe('paused', function() {
            it('should be Boolean', function() {
                expect(iface.paused).toBe(Boolean);
            });
        });

        describe('muted', function() {
            it('should be Boolean', function() {
                expect(iface.muted).toBe(Boolean);
            });
        });

        describe('volume', function() {
            it('should be Number', function() {
                expect(iface.volume).toBe(Number);
            });
        });

        describe('readyState', function() {
            it('should be Number', function() {
                expect(iface.readyState).toBe(Number);
            });
        });

        describe('seeking', function() {
            it('should be Boolean', function() {
                expect(iface.seeking).toBe(Boolean);
            });
        });

        describe('src', function() {
            it('should be null', function() {
                expect(iface.src).toBe(null);
            });
        });

        describe('error', function() {
            it('should be null', function() {
                expect(iface.error).toBe(null);
            });
        });

        describe('poster', function() {
            it('should be null', function() {
                expect(iface.poster).toBe(null);
            });
        });
    });

    describe('methods:', function() {
        describe('pause()', function() {
            it('should exist', function() {
                expect(iface.pause).toEqual(jasmine.any(Function));
            });
        });

        describe('play()', function() {
            it('should exist', function() {
                expect(iface.play).toEqual(jasmine.any(Function));
            });
        });

        describe('load()', function() {
            it('should exist', function() {
                expect(iface.load).toEqual(jasmine.any(Function));
            });
        });

        describe('unload()', function() {
            it('should exist', function() {
                expect(iface.unload).toEqual(jasmine.any(Function));
            });
        });

        describe('reload()', function() {
            it('should exist', function() {
                expect(iface.reload).toEqual(jasmine.any(Function));
            });
        });

        describe('minimize()', function() {
            it('should exist', function() {
                expect(iface.minimize).toEqual(jasmine.any(Function));
            });
        });
    });
});
