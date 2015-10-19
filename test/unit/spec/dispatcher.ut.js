import dispatcher from '../../../src/services/dispatcher.js';
import {EventEmitter} from 'events';

describe('dispatcher', function() {
    beforeEach(function() {
        dispatcher.constructor();
    });

    afterAll(function() {
        dispatcher.constructor();
    });

    it('should exist', function() {
        expect(dispatcher).toEqual(jasmine.any(Object));
    });

    describe('methods:', function() {
        describe('addClient(Module, ...args)', function() {
            let register;
            let mod;
            let args;
            let argumentsSpy;

            class Module {
                constructor(_register_, ...args) {
                    register = _register_;
                    argumentsSpy(...args);
                    mod = this;
                }
            }

            beforeEach(function() {
                args = ['arg1', 'arg2', 'arg3'];
                argumentsSpy = jasmine.createSpy('argumentsSpy()');

                dispatcher.addClient(Module, ...args);
            });

            it('should create an instance of the Module', function() {
                expect(mod).toEqual(jasmine.any(Module));
            });

            it('should pass a register function into the Module', function() {
                expect(register).toEqual(jasmine.any(Function));
            });

            it('should initialize the module with the rest of the supplied arguments', function() {
                expect(argumentsSpy).toHaveBeenCalledWith(...args);
            });
        });

        describe('removeClient(Module)', function() {
            let register1, register2;
            let handler1, handler2;
            let emitter;

            class Module1 {
                constructor(_register_) {
                    register1 = _register_;
                }
            }

            class Module2 {
                constructor(_register_) {
                    register2 = _register_;
                }
            }

            beforeEach(function() {
                dispatcher.addClient(Module1);
                dispatcher.addClient(Module2);

                handler1 = jasmine.createSpy('handler1()');
                handler2 = jasmine.createSpy('handler2()');

                register1(handler1, 'meta', 'foo');
                register2(handler2, 'meta', 'foo');

                emitter = new EventEmitter();

                dispatcher.addSource('meta', emitter, ['foo']);

                dispatcher.removeClient(Module1);

                emitter.emit('foo');
            });

            it('should not call the handler for the removed module', function() {
                expect(handler2).toHaveBeenCalled();
                expect(handler1).not.toHaveBeenCalled();
            });

            describe('if the removed module\'s register function is called', function() {
                beforeEach(function() {
                    register1(handler1, 'meta', 'foo');

                    emitter.emit('foo');
                });

                it('should yield no effect', function() {
                    expect(handler1).not.toHaveBeenCalled();
                });
            });
        });

        describe('addSource(type, emitter, events, data)', function() {
            let register;
            let emitter1, emitter2;
            let data;

            let addVideoSource, addNavigationSource;

            class Module {
                constructor(_register_) {
                    register = _register_;
                }
            }
            class Source extends EventEmitter {}

            beforeEach(function() {
                emitter1 = new Source();
                emitter2 = new Source();

                data = {
                    sponsored: true,
                    title: 'Foo'
                };

                addVideoSource = jasmine.createSpy('addVideoSource()');
                addNavigationSource = jasmine.createSpy('addNavigationSource()');

                dispatcher.addClient(Module);

                register(addVideoSource, 'video', '@addSource');
                register(addNavigationSource, 'navigation', '@addSource');

                dispatcher.addSource('video', emitter1, ['play', 'pause', 'timeupdate'], data);
                dispatcher.addSource('navigation', emitter2, ['play', 'move', 'launch']);
            });

            it('should trigger the @addSource event', function() {
                expect(addVideoSource).toHaveBeenCalledWith({ type: 'video', name: '@addSource', target: emitter1, data: data });
                expect(addVideoSource.calls.count()).toBe(1);

                expect(addNavigationSource).toHaveBeenCalledWith({ type: 'navigation', name: '@addSource', target: emitter2, data: {} });
                expect(addNavigationSource.calls.count()).toBe(1);
            });

            describe('the register function', function() {
                let handler1, handler2;
                let arg1, arg2;

                beforeEach(function() {
                    handler1 = jasmine.createSpy('handler1()');
                    handler2 = jasmine.createSpy('handler2()');

                    arg1 = {
                        data: 'foo'
                    };
                    arg2 = {
                        data: 'bar'
                    };

                    register(handler1, 'video', 'play', 'pause');
                    register(handler2, 'navigation', 'play', 'launch');
                });

                it('should proxy events to the handler', function() {
                    emitter1.emit('play', arg1, arg2);
                    expect(handler1).toHaveBeenCalledWith(jasmine.any(Object), arg1, arg2);
                    expect(handler2).not.toHaveBeenCalled();
                    handler1.calls.reset();

                    emitter1.emit('pause');
                    expect(handler1).toHaveBeenCalledWith(jasmine.any(Object));
                    expect(handler2).not.toHaveBeenCalled();
                    handler1.calls.reset();

                    emitter2.emit('play', arg2);
                    expect(handler2).toHaveBeenCalledWith(jasmine.any(Object), arg2);
                    expect(handler1).not.toHaveBeenCalled();
                    handler2.calls.reset();

                    emitter2.emit('launch', arg1);
                    expect(handler2).toHaveBeenCalledWith(jasmine.any(Object), arg1);
                    expect(handler1).not.toHaveBeenCalled();
                    handler2.calls.reset();

                    emitter1.emit('timeupdate', arg1);
                    expect(handler1).not.toHaveBeenCalled();
                    expect(handler2).not.toHaveBeenCalled();

                    emitter2.emit('move');
                    expect(handler1).not.toHaveBeenCalled();
                    expect(handler2).not.toHaveBeenCalled();
                });

                describe('the event object', function() {
                    let evt;

                    beforeEach(function() {
                        emitter2.emit('play');
                        evt = handler2.calls.mostRecent().args[0];
                    });

                    it('should contain data about the event', function() {
                        expect(evt).toEqual({
                            type: 'navigation',
                            name: 'play',
                            target: emitter2,
                            data: {}
                        });
                    });

                    describe('if data was passed in', function() {
                        beforeEach(function() {
                            emitter1.emit('pause');
                            evt = handler1.calls.mostRecent().args[0];
                        });

                        it('should include the data', function() {
                            expect(evt.data).toBe(data);
                        });
                    });
                });

                describe('if there are no handlers for a type', function() {
                    let emitter3;

                    beforeEach(function() {
                        emitter3 = new Source();

                        dispatcher.addSource('foo', emitter3, ['bar']);
                    });

                    it('should not cause any problems', function() {
                        expect(function() {
                            emitter3.emit('bar');
                        }).not.toThrow();
                    });
                });

                describe('if the same source is added again', function() {
                    let differentData;
                    let handler3;

                    beforeEach(function() {
                        differentData = { bar: 'foo' };
                        handler3 = jasmine.createSpy('handler3()');

                        dispatcher.addSource('video', emitter1, ['play', 'complete'], differentData);
                        register(handler3, 'video', 'complete');
                    });

                    describe('when the event is emitted', function() {
                        beforeEach(function() {
                            emitter1.emit('play');
                            emitter1.emit('complete');
                        });

                        it('should call the handlers multiple times for each time the source was added', function() {
                            expect(handler1).toHaveBeenCalledWith(jasmine.objectContaining({ data }));
                            expect(handler1).toHaveBeenCalledWith(jasmine.objectContaining({ data: differentData }));
                            expect(handler1.calls.count()).toBe(2);

                            expect(handler3).toHaveBeenCalledWith(jasmine.objectContaining({ data: differentData }));
                            expect(handler3.calls.count()).toBe(1);
                        });
                    });

                    describe('when the emitter is removed', function() {
                        beforeEach(function() {
                            dispatcher.removeSource(emitter1);

                            emitter1.emit('play');
                            emitter1.emit('complete');
                        });

                        it('should remove all event listeners', function() {
                            expect(handler1).not.toHaveBeenCalled();
                            expect(handler3).not.toHaveBeenCalled();
                        });
                    });
                });
            });
        });

        describe('removeSource(emitter)', function() {
            let emitter1, emitter2,
                handler,
                register;

            class Module {
                constructor(_register_) {
                    register = _register_;
                }
            }

            beforeEach(function() {
                emitter1 = new EventEmitter();
                emitter2 = new EventEmitter();

                handler = jasmine.createSpy('handler()');

                dispatcher.addClient(Module);

                register(handler, 'video', 'play');

                dispatcher.addSource('video', emitter1, ['play'], { foo: 'bar' });
                dispatcher.addSource('video', emitter2, ['play']);

                dispatcher.removeSource(emitter1);

                emitter2.emit('play');
                expect(handler).toHaveBeenCalled();
                handler.calls.reset();

                emitter1.emit('play');
            });

            it('should stop forwarding events from the emitter', function() {
                expect(handler).not.toHaveBeenCalled();
            });

            describe('if the emitter was never registered', function() {
                beforeEach(function() {
                    emitter1 = new EventEmitter();
                });

                it('should do nothing', function() {
                    expect(function() {
                        dispatcher.removeSource(emitter1);
                    }).not.toThrow();
                });
            });
        });
    });
});
