import PostMessageHandler from '../../../src/handlers/PostMessageHandler.js';
import BillingHandler from '../../../src/handlers/BillingHandler.js';
import dispatcher from '../../../src/services/dispatcher.js';
import { EventEmitter } from 'events';
import CorePlayer from '../../../src/players/CorePlayer.js';

describe('PostMessageHandler', function() {
    let handler;
    let minireel;
    let card;
    let player;
    let postMessage;

    class MockHandler extends PostMessageHandler {
        constructor() {
            super(...arguments);

            handler = this;
        }
    }

    beforeEach(function() {
        postMessage = jasmine.createSpy('postMessage()');

        dispatcher.constructor();
        dispatcher.addClient(MockHandler, postMessage);

        minireel = new EventEmitter();
        minireel.deck = [];
        card = new EventEmitter();

        player = new CorePlayer();

        dispatcher.addSource('navigation', minireel, ['launch']);
        dispatcher.addSource('video', player, ['ended'], card);
    });

    afterEach(function() {
        dispatcher.constructor();
    });

    it('should exist', function() {
        expect(handler).toEqual(jasmine.any(BillingHandler));
    });

    describe('minireel events:', function() {
        describe('launch', function() {
            beforeEach(function() {
                card.sponsor = null;
                card.data = {
                    autoplay: true
                };

                minireel.deck = [card];
            });

            describe('if the first card is sponsored', function() {
                beforeEach(function() {
                    card.sponsor = 'Diageo North America';

                    minireel.emit('launch');
                });

                it('should send a postMessage with isSponsored: true', function() {
                    expect(postMessage).toHaveBeenCalledWith(jasmine.any(String), '*');
                    const message = JSON.parse(postMessage.calls.mostRecent().args[0]);
                    expect(message).toEqual({
                        event: 'launch',
                        isSponsored: true,
                        isClickToPlay: jasmine.any(Boolean)
                    });
                });
            });

            describe('if the first card is not sponsored', function() {
                beforeEach(function() {
                    card.sponsor = null;

                    minireel.emit('launch');
                });

                it('should send a postMessage with isSponsored: false', function() {
                    expect(postMessage).toHaveBeenCalledWith(jasmine.any(String), '*');
                    const message = JSON.parse(postMessage.calls.mostRecent().args[0]);
                    expect(message).toEqual({
                        event: 'launch',
                        isSponsored: false,
                        isClickToPlay: jasmine.any(Boolean)
                    });
                });
            });

            describe('if the first card is set to autoplay', function() {
                beforeEach(function() {
                    card.data.autoplay = true;

                    minireel.emit('launch');
                });

                it('should send a postMessage with isClickToPlay: false', function() {
                    expect(postMessage).toHaveBeenCalledWith(jasmine.any(String), '*');
                    const message = JSON.parse(postMessage.calls.mostRecent().args[0]);
                    expect(message).toEqual({
                        event: 'launch',
                        isSponsored: jasmine.any(Boolean),
                        isClickToPlay: false
                    });
                });
            });

            describe('if the first card is not set to autoplay', function() {
                beforeEach(function() {
                    card.data.autoplay = false;

                    minireel.emit('launch');
                });

                it('should send a postMessage with isClickToPlay: true', function() {
                    expect(postMessage).toHaveBeenCalledWith(jasmine.any(String), '*');
                    const message = JSON.parse(postMessage.calls.mostRecent().args[0]);
                    expect(message).toEqual({
                        event: 'launch',
                        isSponsored: jasmine.any(Boolean),
                        isClickToPlay: true
                    });
                });
            });
        });
    });

    describe('video events:', function() {
        describe('ended', function() {
            describe('if the card is sponsored', function() {
                beforeEach(function() {
                    card.sponsor = 'Target';

                    player.emit('ended');
                });

                it('should send a postMessage', function() {
                    expect(postMessage).toHaveBeenCalledWith(jasmine.any(String), '*');
                    const message = JSON.parse(postMessage.calls.mostRecent().args[0]);
                    expect(message).toEqual({
                        event: 'adEnded'
                    });
                });
            });

            describe('if the card is not sponsored', function() {
                beforeEach(function() {
                    card.sponsor = null;

                    player.emit('ended');
                });

                it('should not send a postMessage', function() {
                    expect(postMessage).not.toHaveBeenCalled();
                });
            });
        });
    });

    describe('when the AdStart event is fired', function() {
        beforeEach(function() {
            handler.emit('AdStart', card);
        });

        it('should call postMessage()', function() {
            expect(postMessage).toHaveBeenCalledWith(JSON.stringify({
                event: 'adStart'
            }), '*');
        });
    });

    describe('when the AdCount event is fired', function() {
        beforeEach(function() {
            handler.emit('AdCount', card);
        });

        it('should call postMessage()', function() {
            expect(postMessage).toHaveBeenCalledWith(JSON.stringify({
                event: 'adCount'
            }), '*');
        });
    });
});
