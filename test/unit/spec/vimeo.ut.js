import vimeo from '../../../src/services/vimeo.js';
import Runner from '../../../lib/Runner.js';
import RunnerPromise from '../../../lib/RunnerPromise.js';

describe('vimeo', function() {
    let iframes,
        iframe;

    let handlers;

    function IFrame(src) {
        iframe = document.createElement('iframe');
        iframe.src = src;
        document.body.appendChild(iframe);

        spyOn(iframe.contentWindow, 'postMessage');

        iframes.push(iframe);

        return iframe;
    }

    function trigger(event, data) {
        const bucket = handlers[event] || [];

        bucket.forEach(function(handler) {
            handler(data);
        });
    }

    beforeEach(function() {
        iframes = [];

        handlers = {};

        spyOn(global, 'addEventListener').and.callFake((event, handler) => {
            const bucket = handlers[event] || (handlers[event] = []);

            bucket.push(handler);
        });

        vimeo.constructor();
    });

    afterEach(function() {
        iframes.forEach(iframe => document.body.removeChild(iframe));
    });

    afterAll(function() {
        vimeo.constructor();
    });

    it('should exist', function() {
        expect(vimeo).toEqual(jasmine.any(Object));
    });

    it('should ignore messages not intended for it', function() {
        expect(function() {
            trigger('message', { origin: 'foo.com', data: null });
        }).not.toThrow();

        expect(function() {
            trigger('message', { origin: 'cinema6.com', data: 'test' });
        }).not.toThrow();
    });

    describe('properties', function() {
        describe('Player($iframe)', function() {
            it('should add itself to the players hash', function() {
                let player = new vimeo.Player(new IFrame('http://player.vimeo.com/video/27855315?api=1&player_id=rc-1&foo=bar'));

                expect(vimeo.players['rc-1']).toBe(player);
            });

            it('should throw an error if the iframe provided has no player_id', function() {
                expect(function() {
                    new vimeo.Player(new IFrame('http://player.vimeo.com/video/27855315?api=1'));
                }).toThrow(new Error('Provided iFrame has no player_id specified in the search params.'));
            });

            describe('event handling', function() {
                let player,
                    emitCount = 1;

                function isEven(number) {
                    let remainder = (number % 2);

                    return !!remainder;
                }

                function emit(event, data, id) {
                    trigger('message', {
                        origin: 'http' + (isEven(emitCount++) ? 's' : '') + '://player.vimeo.com',
                        data: JSON.stringify({
                            /* jshint camelcase:false */
                            player_id: id || 'rc-2',
                            /* jshint camelcase:true */
                            event: event,
                            data: data
                        })
                    });
                }

                beforeEach(function() {
                    player = new vimeo.Player(new IFrame('http://player.vimeo.com/video/27855315?api=1&player_id=rc-2'));

                    spyOn(player, 'call').and.callThrough();
                });

                it('should call the "addEventListener" method when a non-c6EventEmitter or ready event listener is added', function() {
                    player.on('ready', function() {});
                    expect(player.call).not.toHaveBeenCalled();

                    player.on('removeListener', function() {});
                    expect(player.call).not.toHaveBeenCalled();

                    player.on('loadProgress', function() {});
                    expect(player.call).toHaveBeenCalledWith('addEventListener', 'loadProgress');

                    player.on('play', function() {});
                    expect(player.call).toHaveBeenCalledWith('addEventListener', 'play');
                });

                it('should emit events that come via postMessage', function() {
                    let ready = jasmine.createSpy('ready'),
                        play = jasmine.createSpy('play'),
                        playProgress = jasmine.createSpy('playProgress')
                            .and.callFake(() => Runner.schedule('afterRender', null, () => {}));

                    player.on('ready', ready)
                        .on('play', play)
                        .on('playProgress', playProgress);

                    expect(ready).not.toHaveBeenCalled();
                    expect(play).not.toHaveBeenCalled();
                    expect(playProgress).not.toHaveBeenCalled();

                    emit('ready', undefined, 'rc-5');
                    expect(ready).not.toHaveBeenCalled();

                    emit('ready');
                    expect(ready).toHaveBeenCalled();

                    emit('play', undefined, 'rc-8rh49f');
                    expect(play).not.toHaveBeenCalled();

                    emit('play');
                    expect(play).toHaveBeenCalled();

                    emit('playProgress', {
                        seconds: '4.308',
                        percent: '0.012',
                        duration: '359.000'
                    });
                    expect(playProgress).toHaveBeenCalledWith({
                        seconds: '4.308',
                        percent: '0.012',
                        duration: '359.000'
                    });
                });
            });

            describe('properties:', function() {
                let player;

                beforeEach(function() {
                    player = new vimeo.Player(new IFrame('http://player.vimeo.com/video/27855315?api=1&player_id=rc-7'));
                });

                describe('id', function() {
                    it('should be the id provided in the query params', function() {
                        expect(player.id).toBe('rc-7');
                    });
                });
            });

            describe('methods:', function() {
                let player;

                beforeEach(function() {
                    player = new vimeo.Player(new IFrame('http://player.vimeo.com/video/27855315?api=1&player_id=rc-1'));
                });

                describe('destroy()', function() {
                    beforeEach(function() {
                        spyOn(player, 'removeAllListeners').and.callThrough();
                        player.destroy();
                    });

                    it('should remove all event listeners', function() {
                        expect(player.removeAllListeners).toHaveBeenCalled();
                    });

                    it('should remove the player from the service\'s players object', function() {
                        expect(vimeo.players['rc-1']).not.toBeDefined();
                    });
                });

                describe('call(method, data)', function() {
                    it('should return a RunnerPromise', function() {
                        expect(player.call('play')).toEqual(jasmine.any(RunnerPromise));
                    });

                    describe('if the iframe has been destroyed', function() {
                        let success, failure;

                        beforeEach(function(done) {
                            failure = jasmine.createSpy('failure()');
                            success = jasmine.createSpy('success()');

                            iframes.forEach(iframe => document.body.removeChild(iframe));
                            iframes.length = 0;

                            player.call('pause').then(success, failure).then(done, done);
                        });

                        it('should reject with an error', function() {
                            expect(failure).toHaveBeenCalledWith(new Error(`Cannot call pause() on VimeoPlayer [${player.id}] because it is destroyed.`));
                        });
                    });

                    describe('without data', function() {
                        it('should send a message to the iframe', function() {
                            player.call('play');
                            expect(iframe.contentWindow.postMessage).toHaveBeenCalledWith(JSON.stringify({
                                method: 'play'
                            }), '*');

                            player.call('pause');
                            expect(iframe.contentWindow.postMessage).toHaveBeenCalledWith(JSON.stringify({
                                method: 'pause'
                            }), '*');
                        });
                    });

                    describe('with data', function() {
                        it('should send a message to the iframe', function() {
                            player.call('seekTo', 30);
                            expect(iframe.contentWindow.postMessage).toHaveBeenCalledWith(JSON.stringify({
                                method: 'seekTo',
                                value: 30
                            }), '*');
                        });
                    });

                    describe('methods that don\'t return a value', function() {
                        it('should return a promise that resolves to undefined', function(done) {
                            const play = jasmine.createSpy('play');
                            const pause = jasmine.createSpy('pause');
                            const seekTo = jasmine.createSpy('seekTo');
                            const unload = jasmine.createSpy('unload');
                            const setColor = jasmine.createSpy('setColor');
                            const setLoop = jasmine.createSpy('setLoop');
                            const setVolume = jasmine.createSpy('setVolume');

                            Promise.all([
                                player.call('play').then(play),
                                player.call('pause').then(pause),
                                player.call('seekTo').then(seekTo),
                                player.call('unload').then(unload),
                                player.call('setColor').then(setColor),
                                player.call('setLoop').then(setLoop),
                                player.call('setVolume').then(setVolume)
                            ]).then(() => {
                                expect(play).toHaveBeenCalledWith(undefined);
                                expect(pause).toHaveBeenCalledWith(undefined);
                                expect(seekTo).toHaveBeenCalledWith(undefined);
                                expect(unload).toHaveBeenCalledWith(undefined);
                                expect(setColor).toHaveBeenCalledWith(undefined);
                                expect(setLoop).toHaveBeenCalledWith(undefined);
                                expect(setVolume).toHaveBeenCalledWith(undefined);
                            }).then(done, done);
                        });
                    });

                    describe('methods that return a value', function() {
                        function postMessage(method, value, id) {
                            trigger('message', {
                                origin: 'http://player.vimeo.com',
                                data: JSON.stringify({
                                    /* jshint camelcase:false */
                                    player_id: id || 'rc-1',
                                    /* jshint camelcase:true */
                                    method: method,
                                    value: value
                                })
                            });
                        }

                        it('should return a promise that resolves to the value of the response', function(done) {
                            const paused = jasmine.createSpy('paused');
                            const getCurrentTime = jasmine.createSpy('getCurrentTime');
                            const getDuration = jasmine.createSpy('getDuration');
                            const getVideoEmbedCode = jasmine.createSpy('getVideoEmbedCode');
                            const getVideoHeight = jasmine.createSpy('getVideoHeight');
                            const getVideoWidth = jasmine.createSpy('getVideoWidth');
                            const getVideoUrl = jasmine.createSpy('getVideoUrl');
                            const getColor = jasmine.createSpy('getColor');
                            const getVolume = jasmine.createSpy('getVolume');

                            player.call('paused').then(paused);
                            player.call('getCurrentTime').then(getCurrentTime);
                            player.call('getDuration').then(getDuration);
                            player.call('getVideoEmbedCode').then(getVideoEmbedCode);
                            player.call('getVideoHeight').then(getVideoHeight);
                            player.call('getVideoWidth').then(getVideoWidth);
                            player.call('getVideoUrl').then(getVideoUrl);
                            player.call('getColor').then(getColor);
                            player.call('getVolume').then(getVolume);

                            Promise.resolve(postMessage('paused', false, '48yfh9')).then(() => {
                                expect(paused).not.toHaveBeenCalled();
                            })

                            .then(() => {
                                postMessage('paused', false);
                            }).then(() => {
                                expect(paused).toHaveBeenCalledWith(false);
                            })

                            .then(() => {
                                postMessage('getCurrentTime', 12.2, '489rhf439');
                            }).then(() => {
                                expect(getCurrentTime).not.toHaveBeenCalled();
                            })

                            .then(() => {
                                postMessage('getCurrentTime', 10);
                            }).then(() => {
                                expect(getCurrentTime).toHaveBeenCalledWith(10);
                            })

                            .then(() => {
                                postMessage('getDuration', 60);
                            }).then(() => {
                                expect(getDuration).toHaveBeenCalledWith(60);
                            })

                            .then(() => {
                                postMessage('getVideoEmbedCode', 'f7438fh4');
                            }).then(() => {
                                expect(getVideoEmbedCode).toHaveBeenCalledWith('f7438fh4');
                            })

                            .then(() => {
                                postMessage('getVideoHeight', 400, '4938h4');
                            }).then(() => {
                                expect(getVideoHeight).not.toHaveBeenCalled();
                            })

                            .then(() => {
                                postMessage('getVideoHeight', 400);
                            }).then(() => {
                                expect(getVideoHeight).toHaveBeenCalledWith(400);
                            })

                            .then(() => {
                                postMessage('getVideoWidth', 800);
                            }).then(() => {
                                expect(getVideoWidth).toHaveBeenCalledWith(800);
                            })

                            .then(() => {
                                postMessage('getVideoUrl', 'http://foo.com/');
                            }).then(() => {
                                expect(getVideoUrl).toHaveBeenCalledWith('http://foo.com/');
                            })

                            .then(() => {
                                postMessage('getColor', 'red');
                            }).then(() => {
                                expect(getColor).toHaveBeenCalledWith('red');
                            })

                            .then(() => {
                                postMessage('getVolume', 0.75, 'rc-2');
                            }).then(() => {
                                expect(getVolume).not.toHaveBeenCalled();
                            })

                            .then(() => {
                                postMessage('getVolume', 0);
                            }).then(() => {
                                expect(getVolume).toHaveBeenCalledWith(0);
                            })

                            .then(done, done);
                        });

                        it('should reuse deferreds when possible', function(done) {
                            const paused = jasmine.createSpy('paused');
                            const paused2 = jasmine.createSpy('paused2');
                            const promise = player.call('paused');
                            const promise2 = player.call('paused');

                            expect(promise).toBe(promise2);

                            promise.then(paused);
                            promise2.then(paused2);

                            Promise.resolve(postMessage('paused', false)).then(() => {
                                expect(paused).toHaveBeenCalledWith(false);
                                expect(paused2).toHaveBeenCalledWith(false);
                            })

                            .then(() => {
                                paused.calls.reset();
                            })

                            .then(() => {
                                player.call('paused').then(paused);
                            })

                            .then(() => {
                                postMessage('paused', true);
                            }).then(() => {
                                expect(paused).toHaveBeenCalledWith(true);
                            })

                            .then(done, done);
                        });
                    });
                });
            });
        });
    });
});
