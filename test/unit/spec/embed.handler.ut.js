import EmbedHandler from '../../../src/handlers/EmbedHandler.js';
import dispatcher from '../../../src/services/dispatcher.js';
import { EventEmitter } from 'events';
import cinema6 from '../../../src/services/cinema6.js';
import RunnerPromise from '../../../lib/RunnerPromise.js';

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
        session = new MockSession();
        card = new MockCard();

        spyOn(cinema6, 'init').and.returnValue(session);
        spyOn(cinema6, 'getSession').and.returnValue(RunnerPromise.resolve(session));
        spyOn(dispatcher, 'addSource').and.callThrough();

        dispatcher.addClient(MyHandler, minireel);
        dispatcher.addSource('navigation', minireel, ['init', 'error', 'launch', 'close']);
        dispatcher.addSource('card', card, ['complete'], new EventEmitter());
    });

    afterEach(function() {
        dispatcher.removeClient(MyHandler);
    });

    it('should add the session as a source', function() {
        expect(dispatcher.addSource).toHaveBeenCalledWith('session', handler.session, ['show', 'hide', 'showCard']);
    });

    describe('events:', function() {
        describe('navigation:', function() {
            describe('launch', function() {
                beforeEach(function() {
                    spyOn(handler, 'ping');
                    minireel.emit('launch');
                });

                it('should ping open', function() {
                    expect(handler.ping).toHaveBeenCalledWith('open');
                });
            });

            describe('close', function() {
                beforeEach(function() {
                    spyOn(handler, 'ping');
                    minireel.emit('close');
                });

                it('should ping close', function() {
                    expect(handler.ping).toHaveBeenCalledWith('close');
                });
            });

            describe('error', function() {
                let error;

                beforeEach(function() {
                    error = new Error('I failed!');
                    spyOn(handler, 'ping');
                    minireel.emit('error', error);
                });

                it('should ping error', function() {
                    expect(handler.ping).toHaveBeenCalledWith('error', error.message);
                });
            });
        });

        describe('card:', function() {
            describe('complete', function() {
                beforeEach(function() {
                    spyOn(handler, 'ping');
                    card.emit('complete');
                });

                it('should ping cardComplete', function() {
                    expect(handler.ping).toHaveBeenCalledWith('cardComplete', card.id);
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

    describe('properties:', function() {
        describe('session', function() {
            it('should be a cinema6 session', function() {
                expect(cinema6.init).toHaveBeenCalledWith({
                    setup: jasmine.any(Function)
                });
                expect(handler.session).toBe(session);
            });

            describe('the setup function', function() {
                let setup;
                let success, failure;

                beforeEach(function(done) {
                    setup = cinema6.init.calls.mostRecent().args[0].setup;

                    success = jasmine.createSpy('success()');
                    failure = jasmine.createSpy('failure()');

                    setup().then(success, failure);
                    setTimeout(done, 0);
                });

                it('should not returned a fulfilled promise', function() {
                    expect(success).not.toHaveBeenCalled();
                    expect(failure).not.toHaveBeenCalled();
                });

                describe('when the MiniReel is initialized', function() {
                    beforeEach(function(done) {
                        minireel.emit('init');
                        setTimeout(done, 0);
                    });

                    it('should fulfill the promise', function() {
                        expect(success).toHaveBeenCalled();
                    });
                });

                describe('if the minireel has an id (is already initialized)', function() {
                    beforeEach(function(done) {
                        success.calls.reset();
                        failure.calls.reset();
                        minireel.id = 'e-jfu9w3yr84';

                        setup().then(success, failure);
                        setTimeout(done, 0);
                    });

                    it('should fulfill the promise', function() {
                        expect(success).toHaveBeenCalled();
                    });
                });
            });
        });
    });

    describe('methods:', function() {
        describe('ping(event, data)', function() {
            let readySession;
            let evt, data;

            beforeEach(function(done) {
                evt = 'someEvent';
                data = { foo: 'bar' };

                readySession = new MockSession();
                spyOn(readySession, 'ping');
                cinema6.getSession.and.returnValue(RunnerPromise.resolve(readySession));

                handler.ping(evt, data);
                setTimeout(done, 0);
            });

            it('should ping the ready session', function() {
                expect(readySession.ping).toHaveBeenCalledWith(evt, data);
            });
        });

        describe('setStyles(styles)', function() {
            let styles;

            beforeEach(function() {
                styles = {
                    minWidth: '18.75em',
                    padding: '0 0 85% 0',
                    fontSize: '16px',
                    height: '0px',
                    overflow: 'hidden'
                };

                spyOn(handler, 'ping');
                handler.setStyles(styles);
            });

            it('should ping() with the styles', function() {
                expect(handler.ping).toHaveBeenCalledWith('responsiveStyles', styles);
            });
        });
    });
});
