import dailymotion from '../../../src/services/dailymotion.js';
import Runner from '../../../lib/Runner.js';
import $ from 'jquery';

describe('dailymotion', function() {
    beforeEach(function() {
        spyOn(global, 'addEventListener').and.callThrough();
        dailymotion.constructor();
    });

    afterAll(function() {
        dailymotion.constructor();
    });

    afterEach(function() {
        global.addEventListener.calls.all().forEach(function(call) {
            global.removeEventListener.apply(global, call.args);
        });
    });

    it('should exist', function() {
        expect(dailymotion).toEqual(jasmine.any(Object));
    });

    describe('constructors', function() {
        describe('Player($iframe)', function() {
            let $iframe, contentWindow, postMessage,
                player;

            beforeEach(function() {
                $iframe = $('<iframe src="http://www.dailymotion.com/embed/video/x23h8sn?api=postMessage&html&id=foo23"></iframe>');
                player = new dailymotion.Player($iframe[0]);

                $('body').append($iframe);
                contentWindow = $iframe.prop('contentWindow');
                postMessage = spyOn(contentWindow, 'postMessage');
            });

            afterEach(function() {
                $iframe.remove();
            });

            describe('initialization', function() {
                describe('if no id is in the src', function() {
                    beforeEach(function() {
                        $iframe = $('<iframe src="http://www.dailymotion.com/embed/video/x23h8sn?api=postMessage&html"></iframe>');
                    });

                    it('should throw an error', function() {
                        expect(function() {
                            player = new dailymotion.Player($iframe[0]);
                        }).toThrow(new Error('Provided iFrame has no id specified in the search params.'));
                    });
                });

                ['fragment', 'location'].forEach(function(apiMode) {
                    describe('if api is set to ' + apiMode, function() {
                        beforeEach(function() {
                            $iframe = $('<iframe src="http://www.dailymotion.com/embed/video/x23h8sn?api=' + apiMode + '&html&id=foo23"></iframe>');
                        });

                        it('should throw an error', function() {
                            expect(function() {
                                player = new dailymotion.Player($iframe[0]);
                            }).toThrow(new Error('Provided iFrame must have "api" set to "postMessage" in the search params.'));
                        });
                    });
                });
            });

            describe('methods', function() {
                describe('call(method, data)', function() {
                    describe('if called with no data', function() {
                        beforeEach(function() {
                            player.call('play');
                        });

                        it('should post a message to the iframe', function() {
                            expect(postMessage).toHaveBeenCalledWith('play', '*');
                        });
                    });

                    describe('if called with data', function() {
                        beforeEach(function() {
                            player.call('seek', 1.34);
                        });

                        it('should post a message with data to the iframe', function() {
                            expect(postMessage).toHaveBeenCalledWith('seek=1.34', '*');
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

                    it('should not hold references to the player anymore', function() {
                        expect(function() {
                            messageHandler({
                                origin: 'http://www.dailymotion.com',
                                data: 'id=foo23&event=play'
                            });
                        }).toThrow();
                    });

                    it('should remove all of the player\'s listeners', function() {
                        expect(player.removeAllListeners).toHaveBeenCalledWith();
                    });
                });
            });

            describe('events', function() {
                let apireadySpy, playSpy, timeupdateSpy, volumechangeSpy;

                function trigger(data) {
                    const event = document.createEvent('Event');
                    event.initEvent('message');

                    event.origin = 'http://www.dailymotion.com';
                    event.data = Object.keys(data)
                        .map(function(key) {
                            return [key, data[key]]
                                .map(encodeURIComponent)
                                .join('=');
                        })
                        .join('&');

                    global.dispatchEvent(event);
                }

                beforeEach(function() {
                    apireadySpy = jasmine.createSpy('apiready');
                    playSpy = jasmine.createSpy('play');
                    timeupdateSpy = jasmine.createSpy('timeupdate');
                    volumechangeSpy = jasmine.createSpy('volumechange');

                    player.on('apiready', apireadySpy)
                        .on('play', playSpy)
                        .on('timeupdate', timeupdateSpy)
                        .on('volumechange', volumechangeSpy);
                });

                it('should ignore messages not from dailymotion', function() {
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
                    player.on('apiready', () => Runner.schedule('render', null, () => {}));

                    expect(() => trigger({
                        id: 'foo23',
                        event: 'apiready'
                    })).not.toThrow();
                });

                it('should make the player emit the event', function() {
                    trigger({
                        id: 'foo23',
                        event: 'apiready'
                    });
                    expect(apireadySpy).toHaveBeenCalledWith({});

                    trigger({
                        id: 'foo23',
                        event: 'play'
                    });
                    expect(playSpy).toHaveBeenCalledWith({});

                    trigger({
                        id: 'foo23',
                        event: 'timeupdate',
                        time: '3.14'
                    });
                    expect(timeupdateSpy).toHaveBeenCalledWith({
                        time: 3.14
                    });

                    trigger({
                        id: 'foo23',
                        event: 'timeupdate',
                        time: '5'
                    });
                    expect(timeupdateSpy).toHaveBeenCalledWith({
                        time: 5
                    });

                    trigger({
                        id: 'foo23',
                        event: 'volumechange',
                        volume: '0.75',
                        muted: 'false'
                    });
                    expect(volumechangeSpy).toHaveBeenCalledWith({
                        volume: 0.75,
                        muted: false
                    });

                    trigger({
                        id: 'foo23',
                        event: 'volumechange',
                        volume: '0',
                        muted: 'true'
                    });
                    expect(volumechangeSpy).toHaveBeenCalledWith({
                        volume: 0,
                        muted: true
                    });
                });

                describe('with multiple players', function() {
                    let $iframe2,
                        player2,
                        playSpy2;

                    beforeEach(function() {
                        $iframe2 = $('<iframe src="http://www.dailymotion.com/embed/video/x23h8sn?api=postMessage&html&id=bar"></iframe>');
                        player2 = new dailymotion.Player($iframe2[0]);
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
