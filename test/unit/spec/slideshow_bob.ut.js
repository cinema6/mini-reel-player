import bob from '../../../src/services/slideshow_bob.js';
import Runner from '../../../lib/Runner.js';
import environment from '../../../src/environment.js';
import $ from 'jquery';

describe('bob', function() {
    beforeEach(function() {
        spyOn(global, 'addEventListener').and.callThrough();
        bob.constructor();
        environment.constructor();
        environment.apiRoot = 'funkytown.com';
    });

    afterAll(function() {
        bob.constructor();
    });

    afterEach(function() {
        global.addEventListener.calls.all().forEach(function(call) {
            global.removeEventListener.apply(global, call.args);
        });
    });

    it('should exist', function() {
        expect(bob).toEqual(jasmine.any(Object));
    });
    
    describe('Player($iframe)', function() {
        let $iframe, contentWindow, postMessage,
            player;

        beforeEach(function() {
            $iframe = $('<iframe src="http://funkytown.com/slideshowbob/?id=foo23"></iframe>');
            player = new bob.Player($iframe[0]);

            $('body').append($iframe);
            contentWindow = $iframe.prop('contentWindow');
            postMessage = spyOn(contentWindow, 'postMessage');
        });

        afterEach(function() {
            $iframe.remove();
        });

        describe('initialization', function() {
            it('if id is in the src it should NOT throw an error', function() {
                $iframe = $('<iframe src="http://funkytown.com/slideshowbob/?id=123"></iframe>');
                expect(function() {
                    player = new bob.Player($iframe[0]);
                }).not.toThrow();
            });

            it('if no id is in the src it should throw an error', function() {
                $iframe = $('<iframe src="http://funkytown.com/slideshowbob/"></iframe>');
                expect(function() {
                    player = new bob.Player($iframe[0]);
                }).toThrow(new Error('Provided iFrame has no id specified in the search params.'));
            });
        });

        describe('methods', function() {
            describe('call(method, data)', function() {
                describe('if called with no data', function() {
                    beforeEach(function() {
                        player.call('play');
                    });

                    it('should post a message to the iframe', function() {
                        expect(postMessage).toHaveBeenCalledWith(JSON.stringify({
                            method: 'play',
                            args: []
                        }), '*');
                    });
                });

                describe('if called with data', function() {
                    beforeEach(function() {
                        player.call('seek', 1.34);
                    });

                    it('should post a message with data to the iframe', function() {
                        expect(postMessage).toHaveBeenCalledWith(JSON.stringify({
                            method: 'seek',
                            args: [1.34]
                        }), '*');
                    });
                });
            });

            describe('destroy()', function() {
                let messageHandler;

                beforeEach(function() {
                    messageHandler = global.addEventListener.calls.mostRecent().args[1];
                    spyOn(player, 'removeAllListeners').and.callThrough();
                    player.destroy();
                });

                it('should remove all of the player\'s listeners', function() {
                    expect(player.removeAllListeners).toHaveBeenCalledWith();
                });
            });

            describe('events', function() {
                let readySpy, playSpy ;

                function trigger(data) {
                    const event = document.createEvent('Event');
                    event.initEvent('message');

                    event.origin = 'http://funkytown.com';
                    event.data = JSON.stringify(data);

                    global.dispatchEvent(event);
                }

                beforeEach(function() {
                    readySpy = jasmine.createSpy('ready');
                    playSpy = jasmine.createSpy('play');

                    player.on('ready', readySpy)
                        .on('play', playSpy);
                });

                it('should ignore messages not from cinema6', function() {
                    function trigger(data, origin) {
                        const event = document.createEvent('Event');
                        event.initEvent('message');

                        event.origin = origin;
                        event.data = data;

                        global.dispatchEvent(event);
                    }

                    expect(function() {
                        trigger(3, 'https://www.youtube.com');
                        trigger('f39fnw', 'https://player.vimeo.com');
                    }).not.toThrow();
                });

                it('should spin up a Runner instance when an event is emitted', function() {
                    player.on('ready', () => Runner.schedule('render', null, () => {}));

                    expect(() => trigger({
                        id: 'foo23',
                        event: 'ready'
                    })).not.toThrow();
                });

                it('should make the player emit the event', function() {
                    trigger({
                        id: 'foo23',
                        event: 'ready',
                        data: {}
                    });
                    expect(readySpy).toHaveBeenCalledWith({});

                    trigger({
                        id: 'foo23',
                        event: 'play',
                        data: {}
                    });
                    expect(playSpy).toHaveBeenCalledWith({});
                });

                describe('with multiple players', function() {
                    let $iframe2,
                        player2,
                        playSpy2;

                    beforeEach(function() {
                        $iframe2 = $('<iframe src="http://funkytown.com/embed/video/x23h8sn?api=postMessage&html&id=bar"></iframe>');
                        player2 = new bob.Player($iframe2[0]);
                        $('body').append($iframe2);

                        playSpy2 = jasmine.createSpy('play2');

                        player2.on('play', playSpy2);
                    });

                    it('should delegate events', function() {
                        trigger({
                            id: 'foo23',
                            event: 'play'
                        });
                        expect(playSpy).toHaveBeenCalled();
                        expect(playSpy2).not.toHaveBeenCalled();

                        [playSpy, playSpy2].forEach(function(spy) {
                            spy.calls.reset();
                        });

                        trigger({
                            id: 'bar',
                            event: 'play'
                        });
                        expect(playSpy2).toHaveBeenCalled();
                        expect(playSpy).not.toHaveBeenCalled();
                    });
                });
            });
        });
    });
});
