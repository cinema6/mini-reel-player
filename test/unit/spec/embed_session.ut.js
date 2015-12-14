import EmbedSession from '../../../src/utils/EmbedSession.js';
import PostMessageSession from 'rc-post-message-session';
import RunnerPromise from '../../../lib/RunnerPromise.js';
import { defer } from '../../../lib/utils.js';

describe('EmbedSession', function() {
    let session;

    beforeEach(function() {
        session = new EmbedSession();
    });

    it('should be a PostMessageSession', function() {
        expect(session).toEqual(jasmine.any(PostMessageSession));
    });

    describe('when the session becomes ready', function() {
        let ids;

        beforeEach(function() {
            session.request('handshake', {});

            ids = [
                session.post('ping', 'responsiveStyles', { color: 'red' }),
                session.post('ping', 'fullscreen', true),
                session.post('request', 'foo')
            ];

            spyOn(session, 'post');

            session.emit('ready');
        });

        it('should post() all the pending messages', function() {
            expect(session.post.calls.count()).toBe(3);

            expect(session.post.calls.argsFor(0)).toEqual(['ping', 'responsiveStyles', { color: 'red' }, ids[0]]);
            expect(session.post.calls.argsFor(1)).toEqual(['ping', 'fullscreen', true, ids[1]]);
            expect(session.post.calls.argsFor(2)).toEqual(['request', 'foo', undefined, ids[2]]);
        });

        describe('if the session is ready again', function() {
            beforeEach(function() {
                session.post.calls.reset();

                session.emit('ready');
            });

            it('should not post anything', function() {
                expect(session.post).not.toHaveBeenCalled();
            });
        });
    });

    describe('properties:', function() {
        describe('window', function() {
            it('should be the parent window', function() {
                expect(session.window).toBe(window.parent);
            });
        });

        describe('ready', function() {
            it('should be false', function() {
                expect(session.ready).toBe(false);
            });
        });

        describe('data', function() {
            it('should be null', function() {
                expect(session.data).toBeNull();
            });
        });

        describe('experience', function() {
            it('should be null', function() {
                expect(session.experience).toBeNull();
            });
        });
    });

    describe('methods:', function() {
        describe('post(type, event, data, id)', function() {
            let type, evt, data, id;
            let result;

            beforeEach(function() {
                data = { data: true };
                id = EmbedSession.getID();

                spyOn(EmbedSession, 'getID').and.callThrough();
                spyOn(PostMessageSession.prototype, 'post').and.callFake(() => EmbedSession.getID());
            });

            describe('if the type is ping', function() {
                beforeEach(function() {
                    type = 'ping';
                });

                describe('and the event is ready', function() {
                    beforeEach(function() {
                        evt = 'ready';

                        result = session.post(type, evt, data, id);
                    });

                    it('should call super()', function() {
                        expect(PostMessageSession.prototype.post).toHaveBeenCalledWith(type, evt, data, id);
                        expect(result).toBe(PostMessageSession.prototype.post.calls.mostRecent().returnValue);
                    });
                });

                ['handshake', 'foo', 'bar', 'responsiveStyles', 'fullscreen'].forEach(name => {
                    describe(`and the event is ${name}`, function() {
                        beforeEach(function() {
                            evt = name;

                            result = session.post(type, evt, data, id);
                        });

                        it('should not call super()', function() {
                            expect(PostMessageSession.prototype.post).not.toHaveBeenCalled();
                        });

                        it('should return the id', function() {
                            expect(result).toBe(id);
                        });

                        describe('if an id is not specified', function() {
                            beforeEach(function() {
                                EmbedSession.getID.calls.reset();

                                result = session.post(type, evt, data);
                            });

                            it('should generate an id and return it', function() {
                                expect(EmbedSession.getID).toHaveBeenCalled();
                                expect(result).toBe(EmbedSession.getID.calls.mostRecent().returnValue);
                            });
                        });

                        describe('if the session is ready', function() {
                            beforeEach(function() {
                                PostMessageSession.prototype.post.calls.reset();

                                session.ready = true;
                                result = session.post(type, evt, data, id);
                            });

                            it('should call super()', function() {
                                expect(PostMessageSession.prototype.post).toHaveBeenCalledWith(type, evt, data, id);
                                expect(result).toBe(PostMessageSession.prototype.post.calls.mostRecent().returnValue);
                            });
                        });
                    });
                });
            });

            describe('if the type is request', function() {
                beforeEach(function() {
                    type = 'request';
                });

                describe('and the event is handshake', function() {
                    beforeEach(function() {
                        evt = 'handshake';

                        result = session.post(type, evt, data, id);
                    });

                    it('should call super()', function() {
                        expect(PostMessageSession.prototype.post).toHaveBeenCalledWith(type, evt, data, id);
                        expect(result).toBe(PostMessageSession.prototype.post.calls.mostRecent().returnValue);
                    });
                });

                ['ready', 'foo', 'bar', 'responsiveStyles', 'fullscreen'].forEach(name => {
                    describe(`and the event is ${name}`, function() {
                        beforeEach(function() {
                            evt = name;

                            result = session.post(type, evt, data, id);
                        });

                        it('should not call super()', function() {
                            expect(PostMessageSession.prototype.post).not.toHaveBeenCalled();
                        });

                        it('should return the id', function() {
                            expect(result).toBe(id);
                        });

                        describe('if an id is not specified', function() {
                            beforeEach(function() {
                                EmbedSession.getID.calls.reset();

                                result = session.post(type, evt, data);
                            });

                            it('should generate an id and return it', function() {
                                expect(EmbedSession.getID).toHaveBeenCalled();
                                expect(result).toBe(EmbedSession.getID.calls.mostRecent().returnValue);
                            });
                        });

                        describe('if the session is ready', function() {
                            beforeEach(function() {
                                PostMessageSession.prototype.post.calls.reset();

                                session.ready = true;
                                result = session.post(type, evt, data, id);
                            });

                            it('should call super()', function() {
                                expect(PostMessageSession.prototype.post).toHaveBeenCalledWith(type, evt, data, id);
                                expect(result).toBe(PostMessageSession.prototype.post.calls.mostRecent().returnValue);
                            });
                        });
                    });
                });
            });

            describe('if the type is response', function() {
                beforeEach(function() {
                    type = 'response';
                });

                ['handshake', 'ready', 'foo', 'bar', 'responsiveStyles', 'fullscreen'].forEach(name => {
                    describe(`and the event is ${name}`, function() {
                        beforeEach(function() {
                            evt = name;

                            result = session.post(type, evt, data, id);
                        });

                        it('should call super()', function() {
                            expect(PostMessageSession.prototype.post).toHaveBeenCalledWith(type, evt, data, id);
                            expect(result).toBe(PostMessageSession.prototype.post.calls.mostRecent().returnValue);
                        });
                    });

                    describe('if the session is ready', function() {
                        beforeEach(function() {
                            PostMessageSession.prototype.post.calls.reset();

                            session.ready = true;
                            result = session.post(type, evt, data, id);
                        });

                        it('should call super()', function() {
                            expect(PostMessageSession.prototype.post).toHaveBeenCalledWith(type, evt, data, id);
                            expect(result).toBe(PostMessageSession.prototype.post.calls.mostRecent().returnValue);
                        });
                    });
                });
            });
        });

        describe('request(event, data)', function() {
            let evt, data;
            let result;

            beforeEach(function() {
                evt = 'handshake';
                data = { data: true };

                spyOn(RunnerPromise, 'resolve').and.callThrough();
                spyOn(PostMessageSession.prototype, 'request').and.returnValue(Promise.resolve());

                result = session.request(evt, data);
            });

            it('should call super()', function() {
                expect(PostMessageSession.prototype.request).toHaveBeenCalledWith(evt, data);
            });

            it('should return a RunnerPromise', function() {
                expect(RunnerPromise.resolve).toHaveBeenCalledWith(PostMessageSession.prototype.request.calls.mostRecent().returnValue);
                expect(result).toEqual(jasmine.any(RunnerPromise));
            });
        });

        describe('init(data)', function() {
            let data;
            let requestDeferred;
            let success, failure;

            beforeEach(function(done) {
                data = { data: true };

                requestDeferred = defer(RunnerPromise);
                spyOn(session, 'request').and.returnValue(requestDeferred.promise);

                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');

                session.init(data).then(success, failure);
                process.nextTick(done);
            });

            it('should not fulfill the Promise', function() {
                expect(success).not.toHaveBeenCalled();
            });

            it('should request a handshake', function() {
                expect(session.request).toHaveBeenCalledWith('handshake', data);
            });

            describe('when the embed responds', function() {
                let appData, experience;
                let dataSpy;

                beforeEach(function(done) {
                    experience = { id: 'e-7he3lk84sp90bg', data: { deck: [] } };
                    appData = { experience };

                    dataSpy = jasmine.createSpy('data()').and.callFake(() => {
                        expect(session.data).not.toBeNull();
                        expect(session.experience).not.toBeNull();
                    });
                    session.on('data', dataSpy);

                    requestDeferred.fulfill({ appData });
                    setTimeout(done, 10);
                });

                it('should set data to the appData', function() {
                    expect(session.data).toBe(appData);
                });

                it('should set experience to the experience', function() {
                    expect(session.experience).toBe(experience);
                });

                it('should emit data', function() {
                    expect(dataSpy).toHaveBeenCalledWith(appData);
                });

                it('should fulfill the promise with a function', function() {
                    expect(success).toHaveBeenCalledWith(jasmine.any(Function));
                });

                describe('if there is no experience', function() {
                    beforeEach(function(done) {
                        appData = {};
                        session.request.and.returnValue(RunnerPromise.resolve({ appData }));
                        dataSpy.and.stub();

                        session.init(data).then(done, done.fail);
                    });

                    it('should keep experience as null', function() {
                        expect(session.experience).toBeNull();
                    });
                });

                describe('when the function is called', function() {
                    let fn;
                    let ready;

                    beforeEach(function() {
                        fn = success.calls.mostRecent().args[0];

                        ready = jasmine.createSpy('ready()').and.callFake(() => expect(session.ping).toHaveBeenCalled());
                        session.on('ready', ready);

                        spyOn(session, 'ping');

                        fn();
                    });

                    it('should set ready to true', function() {
                        expect(session.ready).toBe(true);
                    });

                    it('should emit ready', function() {
                        expect(ready).toHaveBeenCalled();
                    });

                    it('should ping ready', function() {
                        expect(session.ping).toHaveBeenCalledWith('ready');
                    });
                });
            });
        });

        describe('getData()', function() {
            let success, failure;

            beforeEach(function() {
                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');
            });

            describe('if there is data', function() {
                beforeEach(function(done) {
                    session.data = { data: true };

                    session.getData().then(success, failure).then(done);
                });

                it('should fulfill with the data', function() {
                    expect(success).toHaveBeenCalledWith(session.data);
                });
            });

            describe('if there is no data', function() {
                let data;

                beforeEach(function(done) {
                    data = { data: true };

                    session.data = null;
                    session.getData().then(success, failure).then(done);

                    process.nextTick(() => {
                        session.data = data;
                        session.emit('data', data);
                    });
                });

                it('should fulfill with the data when it is set', function() {
                    expect(success).toHaveBeenCalledWith(data);
                });
            });
        });

        describe('getExperience()', function() {
            let experience;
            let success, failure;

            beforeEach(function() {
                experience = { id: 'e-7he3lk84sp90bg', data: { deck: [] } };

                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');
            });

            describe('if there is an experience', function() {
                beforeEach(function(done) {
                    session.data = { experience };
                    session.experience = experience;

                    session.getExperience().then(success, failure).then(done);
                });

                it('should fulfill with the experience', function() {
                    expect(success).toHaveBeenCalledWith(experience);
                });
            });

            describe('if there is no experience', function() {
                describe('but there is data', function() {
                    beforeEach(function(done) {
                        session.data = {};

                        session.getExperience().then(success, failure).then(done);
                    });

                    it('should reject', function() {
                        expect(failure).toHaveBeenCalledWith(new Error('No experience was provided.'));
                    });
                });

                describe('but one is added', function() {
                    beforeEach(function(done) {
                        session.getExperience().then(success, failure).then(done);

                        process.nextTick(() => {
                            session.data = { experience };
                            session.experience = experience;
                            session.emit('data', session.data);
                        });
                    });

                    it('should fulfill with the experience', function() {
                        expect(success).toHaveBeenCalledWith(experience);
                    });
                });

                describe('and one is not added', function() {
                    beforeEach(function(done) {
                        session.getExperience().then(success, failure).then(done);

                        process.nextTick(() => {
                            session.data = {};
                            session.emit('data', session.data);
                        });
                    });

                    it('should reject', function() {
                        expect(failure).toHaveBeenCalledWith(new Error('No experience was provided.'));
                    });
                });
            });
        });

        describe('setStyles(styles)', function() {
            let styles;

            beforeEach(function() {
                styles = { color: 'black', padding: '2px' };
                spyOn(session, 'ping').and.returnValue(session);

                session.setStyles(styles);
            });

            it('should ping responsiveStyles', function() {
                expect(session.ping).toHaveBeenCalledWith('responsiveStyles', styles);
            });
        });
    });
});
