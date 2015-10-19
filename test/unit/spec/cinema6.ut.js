import cinema6 from '../../../src/services/cinema6.js';
import { EventEmitter } from 'events';
import RunnerPromise from '../../../lib/RunnerPromise.js';
import postMessage from '../../../src/services/post_message.js';
import global from '../../../lib/global.js';
import resource from '../../../src/services/resource.js';
import browser from '../../../src/services/browser.js';
import environment from '../../../src/environment.js';
import Runner from '../../../lib/Runner.js';
import {
    defer,
    extend
} from '../../../lib/utils.js';

describe('cinema6', function() {
    let _private,
        session,
        requestPromise,
        requestPromiseSuccessHandler;

    beforeEach(function() {
        postMessage.constructor();
        cinema6.constructor();

        _private = cinema6.__private__;

        requestPromise = {
            then: function(handler) {
                requestPromiseSuccessHandler = handler;
            }
        };

        session = new EventEmitter();
        session.request = jasmine.createSpy('session request').and.returnValue(requestPromise);
        session.ping = jasmine.createSpy('session ping');

        spyOn(postMessage, 'createSession').and.returnValue(session);
    });

    it('should exist', function() {
        expect(cinema6).toEqual(jasmine.any(EventEmitter));
    });

    it('should start with ready false', function() {
        expect(cinema6.ready).toBe(false);
    });

    describe('@public methods', function() {
        describe('init(config)', function() {
            let initResult,
                config,
                handshakeData;

            beforeEach(function() {
                config = {};
                initResult = cinema6.init(config);
                handshakeData = {
                    success: true,
                    appData: {
                        experience: { id: 'e-82y93r8e34', data: { deck: [] } },
                        standalone: true,
                        interstitial: false
                    }
                };
            });

            it('should create a session for the cinema6 window', function() {
                expect(postMessage.createSession).toHaveBeenCalledWith(global.parent);
            });

            it('should request a handshake from cinema6', function() {
                expect(session.request).toHaveBeenCalledWith('handshake');
            });

            it('should return the session', function() {
                expect(initResult).toBe(session);
            });

            it('should keep a reference to the config', function() {
                expect(_private.options).toBe(config);
            });

            it('should create an options hash if no config is provided', function() {
                cinema6.init();

                expect(_private.options).toBeDefined();
            });

            describe('when cinema6 responds to the handshake', function() {
                let initConfig, done;

                beforeEach(function(_done) {
                    done = jasmine.createSpy('done()').and.callFake(_done);

                    spyOn(cinema6, 'emit').and.callThrough();
                    spyOn(session, 'emit').and.callThrough();

                    Promise.resolve(_private.appData.promise).then(done);

                    requestPromiseSuccessHandler(handshakeData);
                });

                it('should set ready to true', function() {
                    expect(cinema6.ready).toBe(true);
                });

                it('should emit the ready event', function() {
                    expect(cinema6.emit).toHaveBeenCalledWith('ready', true);
                    expect(session.emit).toHaveBeenCalledWith('ready', true);
                });

                it('should send a ping to tell cinema6 it is ready', function() {
                    expect(session.ping).toHaveBeenCalledWith('ready', true);
                });

                it('should resolve the appData promise', function() {
                    expect(done).toHaveBeenCalledWith(extend(handshakeData.appData, { autoLaunch: false }));
                });

                describe('if a setup method is configured', function() {
                    beforeEach(function() {
                        cinema6.constructor();
                        cinema6.emit.calls.reset();
                        session.ping.calls.reset();
                    });

                    describe('if the setup method doesn\'t return a promise', function() {
                        beforeEach(function() {
                            initConfig = {
                                setup: jasmine.createSpy('cinema6 setup (no promise)').and.returnValue(true)
                            };

                            cinema6.init(initConfig);
                            requestPromiseSuccessHandler(handshakeData);
                        });

                        it('should call the setup method with the appData', function() {
                            expect(initConfig.setup).toHaveBeenCalledWith(extend(handshakeData.appData, { autoLaunch: false }));
                        });
                    });

                    describe('if the setup method returns a promise', function() {
                        let sessionSpy,
                            deferred;

                        beforeEach(function() {
                            sessionSpy = jasmine.createSpy('session spy');

                            Promise.resolve(_private.session.promise).then(sessionSpy);

                            deferred = defer(Promise);

                            initConfig = {
                                setup: jasmine.createSpy('cinema6 setup (promise)').and.returnValue(deferred.promise)
                            };

                            cinema6.once('ready', () => Runner.schedule('render', null, () => {}));

                            cinema6.init(initConfig);
                            requestPromiseSuccessHandler(handshakeData);
                        });

                        it('should not complete the setup', function() {
                            expect(cinema6.ready).toBe(false);
                            expect(cinema6.emit).not.toHaveBeenCalledWith('ready', true);
                            expect(session.ping).not.toHaveBeenCalledWith('ready', true);
                            expect(sessionSpy).not.toHaveBeenCalledWith(session);
                        });

                        describe('when the promise resolves', function() {
                            beforeEach(function(done) {
                                deferred.fulfill();

                                Promise.all([deferred.promise, _private.session.promise]).then(done);
                            });

                            it('should complete the setup', function() {
                                expect(cinema6.ready).toBe(true);
                                expect(cinema6.emit).toHaveBeenCalledWith('ready', true);
                                expect(session.ping).toHaveBeenCalledWith('ready', true);
                                expect(sessionSpy).toHaveBeenCalledWith(session);
                            });
                        });
                    });
                });
            });
        });

        describe('getSession()', function() {
            it('should return the session promise', function() {
                expect(cinema6.getSession()).toBe(_private.session.promise);
            });
        });

        describe('getAppData()', function() {
            let resources;
            let appData;
            let profile;
            let success, failure;

            beforeEach(function(done) {
                appData = {
                    experience: { id: 'e-dhf8934yr843', data: { deck: [] } },
                    profile: { flash: true },
                    standalone: false
                };
                _private.appData.fulfill(appData);

                profile = {
                    flash: false
                };
                spyOn(browser, 'getProfile').and.returnValue(RunnerPromise.resolve(profile));

                environment.params = {
                    standalone: false,
                    interstitial: true,
                    autoLaunch: false,
                    container: 'pocketmath',
                    campaign: 'cam-h8394rh834'
                };

                resources = {
                    experience: { id: 'e-hu837ry4738ry', data: { deck: [] } }
                };
                spyOn(resource, 'get').and.callFake(src => {
                    const resource = resources[src];

                    if (resource) {
                        return RunnerPromise.resolve(resource);
                    } else {
                        return RunnerPromise.reject(new Error('Not found.'));
                    }
                });

                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');

                cinema6.getAppData().then(success, failure).then(done);
            });

            it('should return appData that is formulated from the environment and the experience resource', function() {
                expect(success).toHaveBeenCalledWith({
                    experience: resources.experience,
                    standalone: environment.params.standalone,
                    interstitial: environment.params.interstitial,
                    autoLaunch: environment.params.autoLaunch,
                    profile: profile
                });
            });

            describe('if there is no autoLaunch param', function() {
                beforeEach(function(done) {
                    success.calls.reset();
                    failure.calls.reset();
                    delete environment.params.autoLaunch;

                    cinema6.getAppData().then(success, failure).then(done);
                });

                it('should make autoLaunch true', function() {
                    expect(success).toHaveBeenCalledWith(jasmine.objectContaining({
                        autoLaunch: true
                    }));
                });
            });

            describe('if there is no experience resource', function() {
                beforeEach(function(done) {
                    delete resources.experience;
                    success.calls.reset();
                    failure.calls.reset();

                    cinema6.getAppData().then(success, failure).then(done);
                });

                it('should fulfill with the appData from the session', function() {
                    expect(success).toHaveBeenCalledWith(appData);
                });
            });
        });

        describe('fullscreen(bool)', function() {
            function fullscreen(bool) {
                return cinema6.fullscreen(bool);
            }

            beforeEach(function(done) {
                _private.session.fulfill(session);
                Promise.resolve(_private.session.promise).then(done);
            });

            it('should ping cinema6 with a boolean form of the provided value', function(done) {
                Promise.all([
                    fullscreen({}).then(function() {
                        expect(session.ping).toHaveBeenCalledWith('fullscreenMode', true);
                    }),

                    fullscreen().then(function() {
                        expect(session.ping).toHaveBeenCalledWith('fullscreenMode', false);
                    })
                ]).then(done);
            });
        });
    });

    describe('@private methods', function() {
        describe('_private()', function() {
            it('should return a reference to the private variables', function() {
                expect(_private).toBeDefined();
            });
        });
    });

    describe('@private properties', function() {
        describe('session', function() {
            it('should be a deferred object', function() {
                expect(_private.session.promise).toEqual(jasmine.any(RunnerPromise));
            });
        });

        describe('appData', function() {
            it('should be a deferred object', function() {
                expect(_private.appData.promise).toEqual(jasmine.any(RunnerPromise));
            });
        });
    });
});
