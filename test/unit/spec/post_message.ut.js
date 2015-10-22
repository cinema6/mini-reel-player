describe('postMessage', function() {
    import postMessage from '../../../src/services/post_message.js';
    import global from '../../../lib/global.js';
    import {
        noop
    } from '../../../lib/utils.js';
    import RunnerPromise from '../../../lib/RunnerPromise.js';
    import Runner from '../../../lib/Runner.js';
    let _private;

    beforeEach(function() {
        spyOn(global, 'addEventListener');

        postMessage.constructor();
        _private = postMessage.__private__;
    });

    it('should exist', function() {
        expect(postMessage).toEqual(jasmine.any(Object));
    });

    it('should have the window listen for the message event and use the _private.handleMessage() function', function() {
        expect(global.addEventListener).toHaveBeenCalledWith('message', jasmine.any(Function), false);
    });

    describe('when a message is received', function() {
        let evt;

        beforeEach(function() {
            evt = {
                data: 'I am data!'
            };

            spyOn(_private, 'handleMessage');

            global.addEventListener.calls.mostRecent().args[1](evt);
        });

        it('should call _private.handleMessage()', function() {
            expect(_private.handleMessage).toHaveBeenCalledWith(evt);
        });
    });

    describe('@private', function() {
        describe('methods', function() {
            describe('ping(win, event, type, data)', function() {
                let data,
                    win;

                beforeEach(function() {
                    data = {};
                    win = {
                        postMessage: jasmine.createSpy('window postMessage')
                    };

                    _private.ping(win, 'test', 'request', data);
                });

                it('should send a message to the window', function() {
                    expect(win.postMessage).toHaveBeenCalled();
                });

                it('should format the data sent into a transferable format', function() {
                    let args = win.postMessage.calls.mostRecent().args,
                        message = args[0];

                    expect(typeof message).toBe('string');

                    message = JSON.parse(message);

                    expect(message.__c6__).toBeDefined();
                    expect(message.__c6__.event).toBe('test');
                    expect(message.__c6__.data).toEqual(data);
                    expect(message.__c6__.type).toBe('request');
                    expect(message.__c6__.id).toBeUndefined();
                });

                it('should add an id when the message has an id', function() {
                    let message;

                    win.postMessage.calls.reset();
                    _private.ping(win, 'my-event', 'request:33', { foo: 'bar' });
                    message = JSON.parse(win.postMessage.calls.mostRecent().args[0]);
                    expect(message.__c6__.id).toBe(33);

                    win.postMessage.calls.reset();
                    _private.ping(win, 'my-event', 'request:0', { foo: 'bar' });
                    message = JSON.parse(win.postMessage.calls.mostRecent().args[0]);
                    expect(message.__c6__.id).toBe(0);
                });
            });

            describe('newMessageId', function() {
                let sessions;

                beforeEach(function() {
                    sessions = {
                        0: {
                            _pending: {}
                        },
                        1: {
                            _pending: {}
                        },
                        2: {
                            _pending: {}
                        }
                    };
                });

                it('should use the first unused id starting at 0', function() {
                    expect(_private.newMessageId(sessions[0])).toBe(0);
                });

                it('should not use an id if a session already has a request with that id', function() {
                    sessions[0]._pending[0] = {};
                    sessions[0]._pending[1] = {};

                    expect(_private.newMessageId(sessions[0])).toBe(2);
                });

                it('should still use an id even if there is an id with a higher value', function() {
                    sessions[2]._pending[0] = {};
                    sessions[2]._pending[1] = {};
                    sessions[2]._pending[2] = {};
                    sessions[2]._pending[5] = {};

                    expect(_private.newMessageId(sessions[2])).toBe(3);
                });
            });

            describe('getSessionByWindow(win)', function() {
                let window1,
                    window2,
                    window3,
                    session1,
                    session2,
                    session3;

                beforeEach(function() {
                    window1 = {};
                    window2 = {};
                    window3 = {};

                    session1 = postMessage.createSession(window1);
                    session2 = postMessage.createSession(window2);
                    session3 = postMessage.createSession(window3);
                });

                it('should find the session with the corresponding window', function() {
                    expect(_private.getSessionByWindow(window1)).toBe(session1);
                    expect(_private.getSessionByWindow(window2)).toBe(session2);
                    expect(_private.getSessionByWindow(window3)).toBe(session3);
                });
            });

            describe('handleMessage(event)', function() {
                let data,
                    session,
                    args,
                    win,
                    C6Event;

                function Event(data) {
                    this.data = JSON.stringify(data);
                }

                beforeEach(function() {
                    win = {};

                    session = postMessage.createSession(win);

                    data = {
                        __c6__: {
                            event: 'test',
                            data: {},
                            type: null
                        }
                    };

                    C6Event = function(data) {
                        this.source = win;

                        this.data = JSON.stringify(data);
                    };

                    spyOn(session, 'emit').and.callThrough();
                    session.on('test', () => Runner.schedule('render', null, () => {}));
                });

                it('should do nothing when a non-cinema6 event comes in', function() {
                    expect(function() {
                        _private.handleMessage(new Event({ facebook: 'hello' }));
                    }).not.toThrow();

                    expect(function() {
                        _private.handleMessage(new Event('hello'));
                    }).not.toThrow();

                    expect(function() {
                        _private.handleMessage(new Event(undefined));
                    }).not.toThrow();

                    expect(function() {
                        _private.handleMessage(new Event(null));
                    }).not.toThrow();

                    expect(function() {
                        _private.handleMessage(new Event(22));
                    }).not.toThrow();
                });

                describe('request', function() {
                    beforeEach(function() {
                        data.__c6__.type = 'request:0';

                        _private.handleMessage(new C6Event(data));

                        args = session.emit.calls.mostRecent().args;
                    });

                    it('should emit the received event', function() {
                        expect(session.emit).toHaveBeenCalledWith('test', {}, jasmine.any(Function));
                    });

                    describe('the done() function', function() {
                        let done;

                        beforeEach(function() {
                            done = args[2];
                            spyOn(_private, 'ping');
                        });

                        it('should ping the window with the provided response', function() {
                            let data = {};

                            done(data);

                            expect(_private.ping).toHaveBeenCalledWith(win, 'test', 'response:0', data);
                        });
                    });
                });

                describe('response', function() {
                    beforeEach(function() {
                        data.__c6__.type = 'response:0';

                        session._pending[0] = {
                            fulfill: jasmine.createSpy('session pending fulfill')
                        };

                        _private.handleMessage(new C6Event(data));
                    });

                    it('should fulfill the promise for the pending request with the provided data', function() {
                        expect(session._pending[0].fulfill).toHaveBeenCalledWith(data.__c6__.data);
                    });
                });

                describe('ping', function() {
                    beforeEach(function() {
                        data.__c6__.type = 'ping';

                        _private.handleMessage(new C6Event(data));

                        args = session.emit.calls.mostRecent().args;
                    });

                    it('should emit the event with the data and the angular.noop function', function() {
                        expect(session.emit).toHaveBeenCalledWith('test', data.__c6__.data, jasmine.any(Function));
                    });
                });
            });
        });
    });

    describe('@public', function() {
        describe('methods', function() {
            let session,
                win;

            beforeEach(function() {
                win = {};

                session = postMessage.createSession(win);
            });

            describe('createSession(win)', function() {
                it('should create a session', function() {
                    expect(session).toEqual(jasmine.any(Object));
                });

                describe('the session', function() {
                    it('should have a reference to the window', function() {
                        expect(session.window).toBe(win);
                    });

                    it('should have a unique id', function() {
                        expect(session.id).toBe(0);

                        expect(postMessage.createSession({}).id).toBe(1);
                        expect(postMessage.createSession({}).id).toBe(2);
                    });
                });
            });

            describe('destroySession(id)', function() {
                beforeEach(function() {
                    postMessage.destroySession(0);
                });

                it('should make all the properties undefined and the functions angular.noop', function() {
                    for (let prop in session) {
                        let value = session[prop];

                        if (typeof value === 'function') {
                            expect(value).toBe(noop);
                        } else {
                            expect(value).not.toBeDefined();
                        }
                    }
                });
            });

            describe('getSession(id)', function() {
                let foundSession;

                beforeEach(function() {
                    foundSession = postMessage.getSession(0);
                });

                it('should get the session with the provided id', function() {
                    expect(foundSession).toBe(session);
                });
            });

            describe('session methods', function() {
                beforeEach(function() {
                    spyOn(_private, 'ping');
                });

                describe('ping(event, data)', function() {
                    beforeEach(function() {
                        session.ping('test', 'hello');
                    });

                    it('should ping the correct window', function() {
                        expect(_private.ping).toHaveBeenCalledWith(session.window, 'test', 'ping', 'hello');
                    });
                });

                describe('request', function() {
                    let promise;

                    beforeEach(function() {
                        promise = session.request('test', 'okay');
                    });

                    it('should return a promise', function() {
                        expect(promise).toEqual(jasmine.any(RunnerPromise));
                    });

                    it('should add the deferred object to the pending requests', function() {
                        expect(session._pending[0].fulfill).toEqual(jasmine.any(Function));
                    });

                    it('should ping the correct window with the request', function() {
                        expect(_private.ping).toHaveBeenCalledWith(session.window, 'test', 'request:0', 'okay');
                    });
                });
            });
        });
    });
});
