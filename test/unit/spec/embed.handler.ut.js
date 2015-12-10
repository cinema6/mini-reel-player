import EmbedHandler from '../../../src/handlers/EmbedHandler.js';
import dispatcher from '../../../src/services/dispatcher.js';
import { EventEmitter } from 'events';

class MockSession extends EventEmitter {
    ping() {}
}

class MockCard extends EventEmitter {
    constructor() {
        super();
        this.id = 'rc-wuehf4389ry4';
    }
}

class MockMiniReel extends EventEmitter {
    constructor() {
        super();

        this.embed = new MockSession();
    }

    moveToIndex() {}
    moveTo() {}
    close() {}
}

describe('EmbedHandler', function() {
    let handler;
    let minireel, session, card;

    class MyHandler extends EmbedHandler {
        constructor() {
            super(...arguments);
            handler = this;
        }
    }

    beforeEach(function() {
        minireel = new MockMiniReel();
        session = minireel.embed;
        card = new MockCard();

        spyOn(dispatcher, 'addSource').and.callThrough();

        dispatcher.addClient(MyHandler, minireel);
        dispatcher.addSource('navigation', minireel, ['init', 'error', 'launch', 'close']);
        dispatcher.addSource('card', card, ['complete'], new EventEmitter());
    });

    afterEach(function() {
        dispatcher.removeClient(MyHandler);
    });

    it('should add the session as a source', function() {
        expect(dispatcher.addSource).toHaveBeenCalledWith('session', minireel.embed, ['ready', 'show', 'hide', 'showCard', 'vpaid:pauseAd', 'vpaid:resumeAd']);
    });

    describe('events:', function() {
        describe('navigation:', function() {
            describe('launch', function() {
                beforeEach(function() {
                    spyOn(minireel.embed, 'ping');
                    minireel.emit('launch');
                });

                it('should ping open', function() {
                    expect(minireel.embed.ping).toHaveBeenCalledWith('open');
                });
            });

            describe('close', function() {
                beforeEach(function() {
                    spyOn(minireel.embed, 'ping');
                    minireel.emit('close');
                });

                it('should ping close', function() {
                    expect(minireel.embed.ping).toHaveBeenCalledWith('close');
                });
            });

            describe('error', function() {
                let error;

                beforeEach(function() {
                    error = new Error('I failed!');
                    spyOn(minireel.embed, 'ping');
                    minireel.emit('error', error);
                });

                it('should ping error', function() {
                    expect(minireel.embed.ping).toHaveBeenCalledWith('error', error.message);
                });
            });
        });

        describe('card:', function() {
            describe('complete', function() {
                beforeEach(function() {
                    spyOn(minireel.embed, 'ping');
                    card.emit('complete');
                });

                it('should ping cardComplete', function() {
                    expect(minireel.embed.ping).toHaveBeenCalledWith('cardComplete', card.id);
                });
            });
        });

        describe('session:', function() {
            describe('show', function() {
                beforeEach(function() {
                    spyOn(minireel, 'moveToIndex');

                    session.emit('show');
                });

                it('should launch the MiniReel', function() {
                    expect(minireel.moveToIndex).toHaveBeenCalledWith(0);
                });
            });

            describe('hide', function() {
                beforeEach(function() {
                    spyOn(minireel, 'close');

                    session.emit('hide');
                });

                it('should close the MiniReel', function() {
                    expect(minireel.close).toHaveBeenCalled();
                });
            });

            describe('showCard', function() {
                beforeEach(function() {
                    spyOn(minireel, 'moveTo');
                    minireel.deck = [
                        'rc-eb04b0224bcf98',
                        'rc-79b236a5c02466',
                        'rc-34d8720134e45a',
                        'rc-51e938453665d1',
                        'rc-be4e6debc764c9'
                    ].map(id => ({ id, data: {}, modules: [] }));

                    session.emit('showCard', minireel.deck[2].id);
                });

                it('should moveTo() the card', function() {
                    expect(minireel.moveTo).toHaveBeenCalledWith(minireel.deck[2]);
                });
            });
        });
    });
});
