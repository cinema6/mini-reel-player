import ThirdPartyPlayer from '../../../src/players/ThirdPartyPlayer.js';
import PlayerInterface from '../../../src/interfaces/PlayerInterface.js';
import RunnerPromise from '../../../lib/RunnerPromise.js';
import browser from '../../../src/services/browser.js';
import Observable from '../../../src/utils/Observable.js';
import PromiseSerializer from '../../../src/utils/PromiseSerializer.js';
import { noop, defer } from '../../../lib/utils.js';
import CorePlayer from '../../../src/players/CorePlayer.js';
import timer from '../../../lib/timer.js';

describe('ThirdPartyPlayer', function() {
    let player, success, failure, serialFn;

    beforeEach(function() {
        class MyPlayer extends ThirdPartyPlayer {}
        player = new MyPlayer();
        success = jasmine.createSpy('success');
        failure = jasmine.createSpy('failure');
        spyOn(player, 'emit');
        spyOn(player, 'load').and.callThrough();
        spyOn(player, 'unload').and.callThrough();
        spyOn(player.__private__.state, 'get').and.callThrough();
        spyOn(player.__private__, 'playerSeek').and.callThrough();
        spyOn(player.__private__, 'playerVolume').and.callThrough();
        spyOn(player.__private__, 'playerLoad').and.callThrough();
        spyOn(player.__private__, 'playerPlay').and.callThrough();
        spyOn(player.__private__, 'playerPause').and.callThrough();
        spyOn(player.__private__, 'playerUnload').and.callThrough();
        spyOn(player.__private__, 'playerMinimize').and.callThrough();
        spyOn(player.__private__, 'playerControls').and.callThrough();
        spyOn(player.__private__, 'startPolling').and.callThrough();
        spyOn(player.__private__, 'stopPolling').and.callThrough();
        spyOn(player.__private__, 'addEventListeners').and.callThrough();
        spyOn(player.__private__, 'removeEventListeners').and.callThrough();
        spyOn(player.__private__, 'callPlayerMethod').and.callThrough();
        spyOn(player.__private__, 'callLoadPlayerMethod').and.callThrough();
        spyOn(CorePlayer.prototype, 'unload');
        spyOn(browser, 'test').and.callThrough();
        spyOn(timer, 'interval');
        spyOn(timer, 'cancel');
        spyOn(player.__private__.serializer, 'call').and.callFake(promise => {
            serialFn = promise;
        });
    });

    it('should exist', function() {
        expect(player).toEqual(jasmine.any(ThirdPartyPlayer));
    });

    it('should implement the player interface', function() {
        expect(player).toImplement(PlayerInterface);
    });

    describe('private methods', function() {
        describe('callLoadPlayerMethod', function() {
            let loadSpy;

            beforeEach(function() {
                loadSpy = jasmine.createSpy('load').and.returnValue(RunnerPromise.resolve('the api'));
                player.__api__.loadPlayer = loadSpy;
                player.__private__.src = 'some src';
                player.poster = 'image.jpg';
            });

            it('should make the call to the defined load method', function(done) {
                player.__private__.callLoadPlayerMethod().then(() => {
                    expect(loadSpy).toHaveBeenCalledWith('some src', 'image.jpg');
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });

            it('should emit the loadstart event', function(done) {
                player.__private__.callLoadPlayerMethod().then(() => {
                    expect(player.emit).toHaveBeenCalledWith('loadstart');
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });
        });

        describe('callPlayerMethod', function() {
            it('should reject the promise if the method is not implemented', function(done) {
                player.__private__.callPlayerMethod('foo').then(success, failure).then(() => {
                    expect(success).not.toHaveBeenCalled();
                    expect(failure).toHaveBeenCalledWith('foo not implemented');
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });

            describe('when calling a player method that is not load', function() {
                let playSpy;

                beforeEach(function() {
                    playSpy = jasmine.createSpy('play').and.returnValue(RunnerPromise.resolve());
                    player.__api__.methods.play = playSpy;
                });

                it('should call the defined method with any provided arguments if there is an api', function(done) {
                    player.__private__.api = 'the api';
                    player.__private__.callPlayerMethod('play', ['arg1', 'arg2']).then(() => {
                        expect(playSpy).toHaveBeenCalledWith('the api', 'arg1', 'arg2');
                        done();
                    }).catch(error => {
                        expect(error).not.toBeDefined();
                        done();
                    });
                });

                it('should not call the defined method if there is not an api', function(done) {
                    player.__private__.callPlayerMethod('play', ['arg1', 'arg2']).then(() => {
                        expect(playSpy).not.toHaveBeenCalled();
                        done();
                    }).catch(error => {
                        expect(error).toBe('cannot call play as there is no api');
                        done();
                    });
                });

                it('should handle implemented methods that do not return promises', function(done) {
                    playSpy.and.returnValue('not a promise');
                    player.__private__.api = 'the api';
                    player.__private__.callPlayerMethod('play', ['arg1', 'arg2']).then(() => {
                        expect(playSpy).toHaveBeenCalledWith('the api', 'arg1', 'arg2');
                        done();
                    }).catch(error => {
                        expect(error).not.toBeDefined();
                        done();
                    });
                });
            });
        });

        describe('startPolling', function() {
            it('should do nothing if there is no delay set', function() {
                player.__private__.startPolling();
                expect(timer.interval).not.toHaveBeenCalled();
            });

            it('should do nothing if there is already a polling interval set', function() {
                player.__private__.pollingInterval = 'not null';
                player.__private__.startPolling();
                expect(timer.interval).not.toHaveBeenCalled();
            });

            it('should be able to set up a polling interval', function() {
                const pollSpy = jasmine.createSpy('onPoll()');
                player.__private__.api = 'the api';
                player.__api__.pollingDelay = 1000;
                player.__api__.onPoll = pollSpy;
                player.__private__.startPolling();
                expect(timer.interval).toHaveBeenCalledWith(jasmine.any(Function), 1000);
                expect(player.__private__.pollingInterval).not.toBeNull();
                const callback = timer.interval.calls.mostRecent().args[0];
                expect(pollSpy).not.toHaveBeenCalled();
                callback();
                expect(pollSpy).toHaveBeenCalledWith('the api');
            });
        });

        describe('stopPolling', function() {
            it('should do nothing is there is no polling interval', function() {
                player.__private__.stopPolling();
                expect(timer.cancel).not.toHaveBeenCalled();
            });

            it('should be able to cancel the polling interval', function() {
                player.__private__.pollingInterval = 'some interval';
                player.__private__.stopPolling();
                expect(timer.cancel).toHaveBeenCalledWith('some interval');
                expect(player.__private__.pollingInterval).toBeNull();
            });
        });

        describe('addEventListeners', function() {
            it('should set the private event listeners property', function(done) {
                player.__api__.methods.addEventListener = (api, name) => {
                    if(name !== 'event3') {
                        return name + ' handler';
                    }
                };
                player.__private__.api = 'the api';
                player.__api__.events = {
                    event1: 'event1 handler',
                    event2: 'event2 handler',
                    event3: 'event3 handler'
                };
                player.__private__.addEventListeners().then(() => {
                    expect(player.__private__.eventListeners).toEqual([{
                        name: 'event1',
                        handler: 'event1 handler'
                    }, {
                        name: 'event2',
                        handler: 'event2 handler'
                    }, {
                        name: 'event3',
                        handler: undefined
                    }]);
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });

            it('should call the player method addEventListener for each implemented event', function(done) {
                player.__api__.methods.addEventListener = () => {};
                player.__private__.api = 'the api';
                player.__api__.events = {
                    event1: 'event1 handler',
                    event2: 'event2 handler'
                };
                player.__private__.addEventListeners().then(() => {
                    expect(player.__private__.callPlayerMethod).toHaveBeenCalledWith('addEventListener', ['event1', 'event1 handler']);
                    expect(player.__private__.callPlayerMethod).toHaveBeenCalledWith('addEventListener', ['event2', 'event2 handler']);
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });
        });

        describe('removeEventListeners', function() {
            beforeEach(function() {
                player.__private__.eventListeners = [
                    {
                        name: 'event1',
                        handler: 'event1 handler'
                    },
                    {
                        name: 'event2',
                        handler: 'event2 handler'
                    }
                ];
                player.__api__.methods.removeEventListener = () => {};
                player.__private__.api = 'the api';
            });

            it('should call the player method removeEventListener for each event listener', function(done) {
                player.__private__.removeEventListeners().then(() => {
                    expect(player.__private__.callPlayerMethod).toHaveBeenCalledWith('removeEventListener', ['event1', 'event1 handler']);
                    expect(player.__private__.callPlayerMethod).toHaveBeenCalledWith('removeEventListener', ['event2', 'event2 handler']);
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });

            it('should set the event listeners on the player to be an empty array', function(done) {
                player.__private__.removeEventListeners().then(() => {
                    expect(player.__private__.eventListeners).toEqual([]);
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });
        });

        describe('playerLoad', function() {
            it('should call the load player method if there is a proper src', function(done) {
                player.__private__.callLoadPlayerMethod.and.returnValue(RunnerPromise.resolve('the api'));
                player.__private__.src = 'some src';
                player.__private__.playerLoad().then(() => {
                    expect(player.__private__.callLoadPlayerMethod).toHaveBeenCalled();
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });

            it('should set the api after calling the load method', function(done) {
                player.__private__.callLoadPlayerMethod.and.returnValue(RunnerPromise.resolve('the api'));
                player.__private__.src = 'some src';
                player.__private__.playerLoad().then(() => {
                    expect(player.__private__.api).toBe('the api');
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });

            describe('if the player is set to prebuffer', function() {
                let bufferDeferred;
                let success, failure;

                beforeEach(function(done) {
                    bufferDeferred = defer(RunnerPromise);
                    success = jasmine.createSpy('success()');
                    failure = jasmine.createSpy('failure()');

                    player.prebuffer = true;

                    spyOn(player.__private__, 'playerBuffer').and.returnValue(bufferDeferred.promise);
                    spyOn(player.__api__, 'onReady');

                    player.__private__.startPolling.calls.reset();
                    player.__private__.addEventListeners.calls.reset();

                    player.__private__.state.set('duration', 60);
                    player.__private__.callLoadPlayerMethod.and.returnValue(RunnerPromise.resolve('the api'));
                    player.__private__.src = 'some src';

                    player.__private__.playerLoad().then(success, failure);
                    setTimeout(done, 5);
                });

                it('should not call onReady()', function() {
                    expect(player.__api__.onReady).not.toHaveBeenCalled();
                });

                it('should start polling', function() {
                    expect(player.__private__.startPolling).toHaveBeenCalled();
                });

                it('should add the event listeners', function() {
                    expect(player.__private__.addEventListeners).toHaveBeenCalled();
                });

                it('should not change the readyState', function() {
                    expect(player.readyState).not.toBe(3);
                });

                it('should not fulfill the promise', function() {
                    expect(success).not.toHaveBeenCalled();
                });

                it('should call playerBuffer()', function() {
                    expect(player.__private__.playerBuffer).toHaveBeenCalled();
                });

                describe('when the player is buffered', function() {
                    beforeEach(function(done) {
                        bufferDeferred.fulfill();
                        setTimeout(done, 0);
                    });

                    it('should call onReady()', function() {
                        expect(player.__api__.onReady).toHaveBeenCalled();
                    });

                    it('should change the readyState', function() {
                        expect(player.readyState).toBe(3);
                    });

                    it('should fulfill the promise', function() {
                        expect(success).toHaveBeenCalled();
                    });
                });
            });

            describe('if the player is not set to prebuffer', function() {
                let success, failure;

                beforeEach(function(done) {
                    success = jasmine.createSpy('success()');
                    failure = jasmine.createSpy('failure()');

                    player.prebuffer = false;

                    spyOn(player.__private__, 'playerBuffer').and.returnValue(RunnerPromise.resolve());
                    spyOn(player.__api__, 'onReady');

                    player.__private__.startPolling.calls.reset();
                    player.__private__.addEventListeners.calls.reset();

                    player.__private__.state.set('duration', 60);
                    player.__private__.callLoadPlayerMethod.and.returnValue(RunnerPromise.resolve('the api'));
                    player.__private__.src = 'some src';

                    player.__private__.playerLoad().then(success, failure);
                    setTimeout(done, 5);
                });

                it('should not call playerBuffer()', function() {
                    expect(player.__private__.playerBuffer).not.toHaveBeenCalled();
                });

                it('should fulfill the promise', function() {
                    expect(success).toHaveBeenCalled();
                });
            });

            describe('if the video has a duration', function() {
                beforeEach(function(done) {
                    player.__private__.state.set('duration', 60);

                    player.__private__.callLoadPlayerMethod.and.returnValue(RunnerPromise.resolve('the api'));
                    player.__private__.src = 'some src';
                    player.__private__.playerLoad().then(done, done.fail);
                });

                it('should set the readyState after calling the load method', function() {
                    expect(player.__private__.state.get('readyState')).toBe(3);
                });
            });

            describe('if the video has no duration', function() {
                beforeEach(function(done) {
                    expect(player.duration).toBe(0);

                    player.__private__.callLoadPlayerMethod.and.returnValue(RunnerPromise.resolve('the api'));
                    player.__private__.src = 'some src';
                    player.__private__.playerLoad().then(done, done.fail);
                });

                it('should not set the readyState to 3', function() {
                    expect(player.readyState).toBe(0);
                });

                describe('when the duration is set', function() {
                    let loadedmetadata, canplay;

                    beforeEach(function() {
                        player.emit.and.callThrough();

                        loadedmetadata = jasmine.createSpy('loadedmetadata()').and.callFake(() => {
                            expect(canplay).not.toHaveBeenCalled();
                            expect(player.readyState).toBe(1);
                        });
                        canplay = jasmine.createSpy('canplay()').and.callFake(() => {
                            expect(loadedmetadata).toHaveBeenCalled();
                            expect(player.readyState).toBe(3);
                        });

                        player.on('loadedmetadata', loadedmetadata);
                        player.on('canplay', canplay);

                        player.__private__.state.set('duration', 30);
                    });

                    it('should emit loadedmetadata and canplay', function() {
                        expect(loadedmetadata).toHaveBeenCalled();
                        expect(canplay).toHaveBeenCalled();
                    });
                });
            });

            it('should call the api onReady callback', function(done) {
                const onReady = jasmine.createSpy('onReady()');
                player.__api__.onReady = onReady;
                player.__private__.callLoadPlayerMethod.and.returnValue(RunnerPromise.resolve('the api'));
                player.__private__.src = 'some src';
                player.__private__.playerLoad().then(() => {
                    expect(onReady).toHaveBeenCalledWith('the api');
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });

            it('should add any defined event listeners after calling the load method', function(done) {
                player.__private__.callLoadPlayerMethod.and.returnValue(RunnerPromise.resolve('the api'));
                player.__private__.src = 'some src';
                player.__private__.playerLoad().then(() => {
                    expect(player.__private__.addEventListeners).toHaveBeenCalled();
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });

            it('should resolve for an invalid src but not call load', function(done) {
                player.__private__.playerLoad().then(() => {
                    expect(player.__private__.callPlayerMethod).not.toHaveBeenCalled();
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });

            it('should not call load if there is already an api', function(done) {
                player.__private__.api = 'the api';
                player.__private__.playerLoad().then(() => {
                    expect(player.__private__.callPlayerMethod).not.toHaveBeenCalled();
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });

            it('should try to start polling', function(done) {
                player.__private__.callLoadPlayerMethod.and.returnValue(RunnerPromise.resolve('the api'));
                player.__private__.src = 'some src';
                player.__private__.playerLoad().then(() => {
                    expect(player.__private__.startPolling).toHaveBeenCalled();
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });
        });

        describe('playerPlay', function() {
            beforeEach(function() {
                player.__private__.callPlayerMethod.and.returnValue(RunnerPromise.resolve());
            });

            describe('when there is an api', function() {
                beforeEach(function() {
                    player.__private__.api = 'the api';
                });

                describe('if the video has never played', function() {
                    beforeEach(function() {
                        player.__private__.hasPlayed = false;
                    });

                    it('should test the browser for autoplay capability', function(done) {
                        browser.test.and.returnValue(RunnerPromise.resolve(true));
                        player.__private__.playerPlay().then(() => {
                            expect(browser.test).toHaveBeenCalledWith('autoplay');
                            done();
                        });
                    });

                    it('should not test autoplayability if configured not to do so', function(done) {
                        player.__api__.autoplayTest = false;
                        player.__private__.playerPlay().then(() => {
                            expect(browser.test).not.toHaveBeenCalledWith('autoplay');
                            done();
                        });
                    });

                    it('should call the player method play and emit an event if autoplayable', function(done) {
                        browser.test.and.returnValue(RunnerPromise.resolve(true));
                        player.__private__.playerPlay().then(() => {
                            expect(player.__private__.callPlayerMethod).toHaveBeenCalledWith('play');
                            expect(player.emit).toHaveBeenCalledWith('attemptPlay');
                            done();
                        }).catch(error => {
                            expect(error).not.toBeDefined();
                            done();
                        });
                    });

                    it('not call the player method play or emit if not autoplayable', function(done) {
                        browser.test.and.returnValue(RunnerPromise.resolve(false));
                        player.__private__.playerPlay().then(() => {
                            expect(player.__private__.callPlayerMethod).not.toHaveBeenCalledWith('play');
                            expect(player.emit).not.toHaveBeenCalledWith('attemptPlay');
                            done();
                        }).catch(error => {
                            expect(error).not.toBeDefined();
                            done();
                        });
                    });
                });

                describe('if the video has played before', function() {
                    beforeEach(function() {
                        player.__private__.hasPlayed = true;
                    });

                    it('should call the player method play and emit an event', function(done) {
                        player.__private__.playerPlay().then(() => {
                            expect(player.__private__.callPlayerMethod).toHaveBeenCalledWith('play');
                            expect(player.emit).toHaveBeenCalledWith('attemptPlay');
                            done();
                        }).catch(error => {
                            expect(error).not.toBeDefined();
                            done();
                        });
                    });
                });
            });

            describe('when there is no api', function() {
                it('should call playerLoad', function(done) {
                    player.__private__.hasPlayed = true;
                    player.__private__.playerPlay().then(() => {
                        expect(player.__private__.playerLoad).toHaveBeenCalled();
                        done();
                    });
                });

                describe('if the video has never played', function() {
                    beforeEach(function() {
                        player.__private__.hasPlayed = false;
                    });

                    it('should test the browser for autoplay capability', function(done) {
                        browser.test.and.returnValue(RunnerPromise.resolve(true));
                        player.__private__.playerPlay().then(() => {
                            expect(browser.test).toHaveBeenCalledWith('autoplay');
                            done();
                        });
                    });

                    it('should not test autoplayability if configured not to do so', function(done) {
                        player.__api__.autoplayTest = false;
                        player.__private__.playerPlay().then(() => {
                            expect(browser.test).not.toHaveBeenCalledWith('autoplay');
                            done();
                        });
                    });

                    it('should call the player method play and emit an event if autoplayable', function(done) {
                        browser.test.and.returnValue(RunnerPromise.resolve(true));
                        player.__private__.playerPlay().then(() => {
                            expect(player.__private__.callPlayerMethod).toHaveBeenCalledWith('play');
                            expect(player.emit).toHaveBeenCalledWith('attemptPlay');
                            done();
                        }).catch(error => {
                            expect(error).not.toBeDefined();
                            done();
                        });
                    });

                    it('not call the player method play or emit if not autoplayable', function(done) {
                        browser.test.and.returnValue(RunnerPromise.resolve(false));
                        player.__private__.playerPlay().then(() => {
                            expect(player.__private__.callPlayerMethod).not.toHaveBeenCalledWith('play');
                            expect(player.emit).not.toHaveBeenCalledWith('attemptPlay');
                            done();
                        }).catch(error => {
                            expect(error).not.toBeDefined();
                            done();
                        });
                    });
                });

                describe('if the video has played before', function() {
                    beforeEach(function() {
                        player.__private__.hasPlayed = true;
                    });

                    it('should call the player method play and emit an event', function(done) {
                        player.__private__.playerPlay().then(() => {
                            expect(player.__private__.callPlayerMethod).toHaveBeenCalledWith('play');
                            expect(player.emit).toHaveBeenCalledWith('attemptPlay');
                            done();
                        }).catch(error => {
                            expect(error).not.toBeDefined();
                            done();
                        });
                    });
                });
            });
        });

        describe('playerPause', function() {
            beforeEach(function() {
                player.__private__.callPlayerMethod.and.returnValue(RunnerPromise.resolve());
            });

            it('should call the player method pause if there is an api', function(done) {
                player.__private__.api = 'the api';
                player.__private__.playerPause().then(() => {
                    expect(player.__private__.callPlayerMethod).toHaveBeenCalledWith('pause');
                    expect(player.__private__.playerLoad).not.toHaveBeenCalled();
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });

            it('should call player load if there is not an api', function(done) {
                player.__private__.playerPause().then(() => {
                    expect(player.__private__.playerLoad).toHaveBeenCalled();
                    expect(player.__private__.callPlayerMethod).not.toHaveBeenCalled();
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });
        });

        describe('playerUnload', function() {
            beforeEach(function() {
                player.__private__.callPlayerMethod.and.returnValue(RunnerPromise.resolve());
                player.__private__.removeEventListeners.and.returnValue(RunnerPromise.resolve());
            });

            it('should resolve the promise and not call unload if there is no api', function(done) {
                player.__private__.playerUnload().then(() => {
                    expect(player.__private__.callPlayerMethod).not.toHaveBeenCalled();
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });

            it('should reset the approximate state if there is an api', function(done) {
                player.__private__.api = 'the api';
                spyOn(player.__private__.state, 'reset');
                player.__private__.playerUnload().then(() => {
                    expect(player.__private__.state.reset).toHaveBeenCalled();
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });

            it('should remove event listeners if there is an api', function(done) {
                player.__private__.api = 'the api';
                player.__private__.playerUnload().then(() => {
                    expect(player.__private__.removeEventListeners).toHaveBeenCalled();
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });

            it('should call the unload player method if there is an api', function(done) {
                player.__private__.api = 'the api';
                player.__private__.playerUnload().then(() => {
                    expect(player.__private__.callPlayerMethod).toHaveBeenCalledWith('unload');
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });

            it('should set the readyState to HAVE_NOTHING if there is an api', function(done) {
                player.__private__.api = 'the api';
                player.__private__.state.set('readyState', 3);
                player.__private__.playerUnload().then(() => {
                    expect(player.__private__.state.get('readyState')).toBe(0);
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });

            it('should try to stop the polling', function(done) {
                player.__private__.api = 'the api';
                player.__private__.playerUnload().then(() => {
                    expect(player.__private__.stopPolling).toHaveBeenCalled();
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });
        });

        describe('playerSeek', function() {
            beforeEach(function() {
                player.__private__.callPlayerMethod.and.returnValue(RunnerPromise.resolve());
            });

            it('should resolve the promise and not seek if there is no api', function(done) {
                player.__private__.playerSeek(123).then(() => {
                    expect(player.__private__.callPlayerMethod).not.toHaveBeenCalled();
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });

            it('should call the seek player method if there is an api', function(done) {
                player.__private__.api = 'the api';
                player.__private__.playerSeek(123).then(() => {
                    expect(player.__private__.callPlayerMethod).toHaveBeenCalledWith('seek', [123]);
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });

            it('should pause the player after seeking if it was paused pre-seek', function(done) {
                player.__private__.state.get.and.returnValue(true);
                player.__private__.api = 'the api';
                player.__private__.playerSeek(123).then(() => {
                    expect(player.__private__.playerPause).toHaveBeenCalled();
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });

            it('should play the player after seeking if it was playing pre-seek', function(done) {
                player.__private__.hasPlayed = true;
                player.__private__.state.get.and.returnValue(false);
                player.__private__.api = 'the api';
                player.__private__.playerSeek(123).then(() => {
                    expect(player.__private__.playerPlay).toHaveBeenCalled();
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });
        });

        describe('playerVolume', function() {
            it('should call the volume player method if there is an api', function(done) {
                player.__private__.callPlayerMethod.and.returnValue(RunnerPromise.resolve());
                player.__private__.api = 'the api';
                player.__private__.playerVolume(123).then(() => {
                    expect(player.__private__.callPlayerMethod).toHaveBeenCalledWith('volume', [123]);
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });

            it('should not change the volume if there is no api', function(done) {
                player.__private__.playerVolume(123).then(() => {
                    expect(player.__private__.callPlayerMethod).not.toHaveBeenCalled();
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });
        });

        describe('playerMinimize', function() {
            it('should call the minimize player method if there is an api', function(done) {
                player.__private__.callPlayerMethod.and.returnValue(RunnerPromise.resolve());
                player.__private__.api = 'the api';
                player.__private__.playerMinimize().then(() => {
                    expect(player.__private__.callPlayerMethod).toHaveBeenCalledWith('minimize');
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });

            it('should not change the volume if there is no api', function(done) {
                player.__private__.playerMinimize().then(() => {
                    expect(player.__private__.callPlayerMethod).not.toHaveBeenCalled();
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });
        });
        
        describe('playerControls', function() {
            it('should call the controls player method if there is an api', function(done) {
                player.__private__.callPlayerMethod.and.returnValue(RunnerPromise.resolve());
                player.__private__.api = 'the api';
                player.__private__.playerControls(true).then(() => {
                    expect(player.__private__.callPlayerMethod).toHaveBeenCalledWith('controls', [true]);
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });

            it('should not change the volume if there is no api', function(done) {
                player.__private__.playerControls().then(() => {
                    expect(player.__private__.callPlayerMethod).not.toHaveBeenCalled();
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });
        });

        describe('playerBuffer()', function() {
            let success, failure;
            let callDeferred;

            beforeEach(function(done) {
                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');

                callDeferred = defer(RunnerPromise);

                player.__private__.playerPlay.and.returnValue(RunnerPromise.resolve());

                player.__private__.callPlayerMethod.and.returnValue(callDeferred.promise);
                player.__private__.api = 'the api';

                player.__private__.playerBuffer().then(success, failure);
                setTimeout(done, 0);
            });

            it('should set buffering to true', function() {
                expect(player.buffering).toBe(true);
            });

            it('should call the buffer method', function() {
                expect(player.__private__.callPlayerMethod).toHaveBeenCalledWith('buffer');
            });

            it('should not make the state immutable', function() {
                expect(player.__private__.state.mutable()).toBe(true);
            });

            it('should not play the player', function() {
                expect(player.__private__.playerPlay).not.toHaveBeenCalled();
            });

            describe('when the player has buffered', function() {
                beforeEach(function(done) {
                    callDeferred.fulfill();
                    setTimeout(done, 1);
                });

                it('should set buffering to false', function() {
                    expect(player.buffering).toBe(false);
                });

                it('should fulfill the promise', function() {
                    expect(success).toHaveBeenCalled();
                });
            });

            describe('if there is no api', function() {
                beforeEach(function(done) {
                    success.calls.reset();
                    failure.calls.reset();

                    player.__private__.callPlayerMethod.calls.reset();
                    player.__private__.callPlayerMethod.and.returnValue(RunnerPromise.reject('No API!'));
                    player.__private__.api = null;

                    player.__private__.playerBuffer().then(success, failure).then(done, done.fail);
                });

                it('should not call callPlayerMethod()', function() {
                    expect(player.__private__.callPlayerMethod).not.toHaveBeenCalled();
                });

                it('should fulfill the promise', function() {
                    expect(success).toHaveBeenCalled();
                });
            });

            describe('if callPlayerMethod() fails', function() {
                let autoplayDeferred;

                beforeEach(function(done) {
                    success.calls.reset();
                    failure.calls.reset();

                    autoplayDeferred = defer(RunnerPromise);

                    player.__private__.callPlayerMethod.and.returnValue(RunnerPromise.reject('Method not implemented!'));
                    browser.test.and.returnValue(autoplayDeferred.promise);

                    player.__private__.playerPlay.and.returnValue(RunnerPromise.resolve());
                    player.__private__.playerPause.and.returnValue(RunnerPromise.resolve());
                    player.__private__.playerSeek.and.returnValue(RunnerPromise.resolve());
                    player.__private__.playerVolume.and.returnValue(RunnerPromise.resolve());

                    player.__private__.playerBuffer().then(success, failure);
                    setTimeout(done, 1);
                });

                it('should not resolve the promise', function() {
                    expect(success).not.toHaveBeenCalled();
                    expect(failure).not.toHaveBeenCalled();
                });

                it('should set buffering to true', function() {
                    expect(player.buffering).toBe(true);
                });

                it('should make the state immutable', function() {
                    expect(player.__private__.state.mutable()).toBe(false);
                });

                it('should check if the device can autoplay', function() {
                    expect(browser.test).toHaveBeenCalledWith('autoplay');
                });

                describe('if the device can autoplay', function() {
                    beforeEach(function(done) {
                        autoplayDeferred.fulfill(true);
                        setTimeout(done, 5);
                    });

                    it('should call playerPlay()', function() {
                        expect(player.__private__.playerPlay).toHaveBeenCalled();
                    });

                    it('should call playerVolume(0)', function() {
                        expect(player.__private__.playerVolume).toHaveBeenCalledWith(0);
                    });

                    it('should not call playerPause()', function() {
                        expect(player.__private__.playerPause).not.toHaveBeenCalled();
                    });

                    describe('when the video starts to play', function() {
                        beforeEach(function(done) {
                            player.__setProperty__('paused', false);

                            setTimeout(done, 5);
                        });

                        it('should pause the player', function() {
                            expect(player.__private__.playerPause).toHaveBeenCalled();
                        });

                        it('should unmute the player', function() {
                            expect(player.__private__.playerVolume).toHaveBeenCalledWith(1);
                        });

                        it('should make the state mutable', function() {
                            expect(player.__private__.state.mutable()).toBe(true);
                        });

                        it('should set buffering to false', function() {
                            expect(player.buffering).toBe(false);
                        });

                        it('should fulfill the Promise', function() {
                            expect(success).toHaveBeenCalled();
                        });
                    });
                });

                describe('if the device can\'t autoplay', function() {
                    beforeEach(function(done) {
                        autoplayDeferred.fulfill(false);
                        setTimeout(done, 5);
                    });

                    it('should not call playerPlay()', function() {
                        expect(player.__private__.playerPlay).not.toHaveBeenCalled();
                    });

                    it('should not call playerVolume(0)', function() {
                        expect(player.__private__.playerVolume).not.toHaveBeenCalled();
                    });

                    it('should make the state mutable', function() {
                        expect(player.__private__.state.mutable()).toBe(true);
                    });

                    it('should set buffering to false', function() {
                        expect(player.buffering).toBe(false);
                    });

                    it('should fulfill the Promise', function() {
                        expect(success).toHaveBeenCalled();
                    });
                });
            });
        });
    });

    describe('private properties', function() {
        it('should default values', function() {
            expect(player.__private__.src).toBe(null);
            expect(player.__private__.api).toBe(null);
            expect(player.__private__.eventListeners).toEqual([]);
            expect(player.__private__.serializer).toEqual(jasmine.any(PromiseSerializer));
            expect(player.__private__.state).toEqual(jasmine.any(Observable));
            expect(player.__private__.hasPlayed).toBe(false);
            expect(player.__private__.pollingInterval).toBeNull();
        });

        describe('hasPlayed', function() {
            it('should be set to true when playing', function() {
                player.emit.and.callThrough();
                player.__private__.hasPlayed = false;
                player.emit('playing');
                expect(player.__private__.hasPlayed).toBe(true);
            });

            it('should be set to false when emptied', function() {
                player.emit.and.callThrough();
                player.__private__.hasPlayed = true;
                player.emit('emptied');
                expect(player.__private__.hasPlayed).toBe(false);
            });
        });

        describe('currentTime', function() {
            it('should emit if changing values', function() {
                player.__private__.state.set('currentTime', 123);
                expect(player.emit).toHaveBeenCalledWith('timeupdate');
            });
        });

        describe('buffering', function() {
            it('should be false', function() {
                expect(player.__private__.state.get('buffering')).toBe(false);
            });

            describe('when set to true', function() {
                beforeEach(function() {
                    player.__private__.state.set('buffering', true);
                });

                it('should emit "buffering"', function() {
                    expect(player.emit).toHaveBeenCalledWith('buffering');
                    expect(player.emit.calls.count()).toBe(1);
                });
            });

            describe('when set to false', function() {
                beforeEach(function() {
                    player.__private__.state.set('buffering', true);
                    player.emit.calls.reset();

                    player.__private__.state.set('buffering', false);
                });

                it('should emit "buffered"', function() {
                    expect(player.emit).toHaveBeenCalledWith('buffered');
                    expect(player.emit.calls.count()).toBe(1);
                });
            });
        });

        describe('paused', function() {
            it('should emit when changing to true', function() {
                player.__private__.state.set('paused', false);
                expect(player.emit).not.toHaveBeenCalledWith('pause');
                player.__private__.state.set('paused', true);
                expect(player.emit).toHaveBeenCalledWith('pause');
            });

            it('should emit when changing to false', function() {
                player.__private__.state.set('paused', false);
                expect(player.emit).toHaveBeenCalledWith('play');
                expect(player.emit).toHaveBeenCalledWith('playing');
            });
        });

        describe('duration', function() {
            beforeEach(function() {
                player.__private__.state.set('duration', 123);
            });

            it('should emit if changing values', function() {
                expect(player.emit).toHaveBeenCalledWith('durationchange');
            });

            it('should set the readyState', function() {
                expect(player.readyState).toBe(1);
            });

            describe('if the readyState is greater than 1', function() {
                beforeEach(function() {
                    player.__private__.state.set('duration', 0);
                    player.__private__.state.set('readyState', 3);
                    player.emit.calls.reset();

                    player.__private__.state.set('duration', 33);
                });

                it('should not set the readyState', function() {
                    expect(player.readyState).toBe(3);
                });
            });
        });

        describe('readyState', function() {
            it('should be able to emit emptied', function() {
                player.__private__.state.set('readyState', 3);
                expect(player.emit).not.toHaveBeenCalledWith('emptied');
                player.__private__.state.set('readyState', 0);
                expect(player.emit).toHaveBeenCalledWith('emptied');
            });

            it('should be able to emit loadedmetadata', function() {
                player.__private__.state.set('readyState', 1);
                expect(player.emit).toHaveBeenCalledWith('loadedmetadata');
            });

            it('should be able to emit canplay', function() {
                player.__private__.state.set('readyState', 3);
                expect(player.emit).toHaveBeenCalledWith('canplay');
            });

            it('should be able to emit canplaythrough', function() {
                player.__private__.state.set('readyState', 4);
                expect(player.emit).toHaveBeenCalledWith('canplaythrough');
            });
        });

        describe('volume', function() {
            it('should emit when changing values', function() {
                player.__private__.state.set('volume', 123);
                expect(player.emit).toHaveBeenCalledWith('volumechange', 123);
            });
        });

        describe('seeking', function() {
            it('should emit when changing to true', function() {
                player.__private__.state.set('seeking', true);
                expect(player.emit).toHaveBeenCalledWith('seeking');
            });

            it('should emit when changing to false', function() {
                player.__private__.state.set('seeking', true);
                expect(player.emit).not.toHaveBeenCalledWith('seeked');
                player.__private__.state.set('seeking', false);
                expect(player.emit).toHaveBeenCalledWith('seeked');
            });
        });

        describe('width', function() {
            it('should emit when changing values', function() {
                player.__private__.state.set('width', 123);
                expect(player.emit).toHaveBeenCalledWith('resize');
            });
        });

        describe('height', function() {
            it('should emit when changing values', function() {
                player.__private__.state.set('height', 123);
                expect(player.emit).toHaveBeenCalledWith('resize');
            });
        });

        describe('ended', function() {
            it('should emit when changing to true', function() {
                player.__private__.state.set('ended', true);
                expect(player.emit).toHaveBeenCalledWith('ended');
            });
        });
    });

    describe('public methods', function() {
        describe('load', function() {
            it('should load the player after any pending operations', function(done) {
                player.__api__.loadPlayer = 'not null';
                player.__private__.playerLoad.and.returnValue(RunnerPromise.resolve('result'));
                player.load();
                expect(player.__private__.serializer.call).toHaveBeenCalled();
                serialFn().then(() => {
                    expect(player.__private__.playerLoad).toHaveBeenCalled();
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });

            it('should return an error if not implemented', function() {
                player.__api__.name = 'MyPlayer';
                expect(player.load()).toEqual(new Error('MyPlayer cannot load.'));
            });
        });

        describe('play', function() {
            it('should play the player after any pending operations', function(done) {
                player.__api__.methods.play = 'not null';
                player.__private__.playerPlay.and.returnValue(RunnerPromise.resolve('result'));
                player.play();
                expect(player.__private__.serializer.call).toHaveBeenCalled();
                serialFn().then(() => {
                    expect(player.__private__.playerPlay).toHaveBeenCalled();
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });

            it('should return an error if not implemented', function() {
                player.__api__.name = 'MyPlayer';
                expect(player.play()).toEqual(new Error('MyPlayer cannot play.'));
            });
        });

        describe('pause', function() {
            it('should play the player after any pending operations', function(done) {
                player.__api__.methods.pause = 'not null';
                player.__private__.playerPause.and.returnValue(RunnerPromise.resolve('result'));
                player.pause();
                expect(player.__private__.serializer.call).toHaveBeenCalled();
                serialFn().then(() => {
                    expect(player.__private__.playerPause).toHaveBeenCalled();
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });

            it('should return an error if not implemented', function() {
                player.__api__.name = 'MyPlayer';
                expect(player.pause()).toEqual(new Error('MyPlayer cannot pause.'));
            });
        });

        describe('unload', function() {
            it('should unload the player after any pending operations', function(done) {
                player.__api__.methods.unload = 'not null';
                player.__private__.playerUnload.and.returnValue(RunnerPromise.resolve('result'));
                player.unload();
                expect(player.__private__.serializer.call).toHaveBeenCalled();
                serialFn().then(() => {
                    expect(player.__private__.playerUnload).toHaveBeenCalled();
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });

            it('should call super after any pending operations', function(done) {
                player.__api__.methods.unload = 'not null';
                player.__private__.playerUnload.and.returnValue(RunnerPromise.resolve('result'));
                player.unload();
                expect(player.__private__.serializer.call).toHaveBeenCalled();
                serialFn().then(() => {
                    expect(CorePlayer.prototype.unload).toHaveBeenCalled();
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });

            it('should return an error if not implemented', function() {
                player.__api__.name = 'MyPlayer';
                expect(player.unload()).toEqual(new Error('MyPlayer cannot unload.'));
            });
        });

        describe('reload', function() {
            it('should call unload and load', function() {
                player.__api__.loadPlayer = 'not null';
                player.__api__.methods.unload = 'not null';
                player.reload();
                expect(player.unload).toHaveBeenCalled();
                expect(player.load).toHaveBeenCalled();
            });

            it('should return an error if not implemented', function() {
                player.__api__.name = 'MyPlayer';
                expect(player.reload()).toEqual(new Error('MyPlayer cannot reload.'));
            });
        });

        describe('minimize', function() {
            it('should unload the player after any pending operations', function(done) {
                player.__api__.methods.minimize = 'not null';
                player.__private__.playerMinimize.and.returnValue(RunnerPromise.resolve('result'));
                player.minimize();
                expect(player.__private__.serializer.call).toHaveBeenCalled();
                serialFn().then(() => {
                    expect(player.__private__.playerMinimize).toHaveBeenCalled();
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });

            it('should return an error if not implemented', function() {
                player.__api__.name = 'MyPlayer';
                expect(player.minimize()).toEqual(new Error('MyPlayer cannot minimize.'));
            });
        });

        describe('__setProperty__', function() {
            it('should set an allowed property on the approximate state', function() {
                player.__setProperty__('currentTime', 123);
                expect(player.__private__.state.get('currentTime')).toBe(123);
            });

            it('should not set disallowed properties', function() {
                try {
                    player.__setProperty__('foo', 'bar');
                    expect(true).toBe(false);
                } catch (error) {
                    expect(player.__private__.state.get('foo')).not.toBeDefined();
                    expect(error).toEqual(new Error('Cannot set invalid property foo'));
                }
            });
        });
    });

    describe('public properties', function() {
        describe('prebuffer', function() {
            it('should be false', function() {
                expect(player.prebuffer).toBe(false);
            });
        });

        describe('__api__', function() {
            it('should have defaults', function() {
                expect(player.__api__).toEqual({
                    name: '',
                    loadPlayer: null,
                    methods: {},
                    events: {},
                    autoplayTest: true,
                    onReady: noop,
                    pollingDelay: null,
                    onPoll: noop
                });
            });
        });

        describe('get src', function() {
            it('should get the private src', function() {
                player.__private__.src = 'some src';
                expect(player.src).toBe('some src');
            });
        });

        describe('set src', function() {
            it('should set the private src', function() {
                player.src = 'some src';
                expect(player.__private__.src).toBe('some src');
            });

            it('should unload the player if setting to a different src', function() {
                player.__private__.src = 'old src';
                player.src = 'new src';
                expect(player.unload).toHaveBeenCalled();
            });

            it('should not unload the player if setting to the same src', function() {
                player.__private__.src = 'some src';
                player.src = 'some src';
                expect(player.unload).not.toHaveBeenCalled();
            });
        });

        describe('get currentTime', function() {
            it('should get this player property', function() {
                player.__private__.state.get.and.returnValue(123);
                expect(player.currentTime).toBe(123);
                expect(player.__private__.state.get).toHaveBeenCalledWith('currentTime');
            });
        });

        describe('set currentTime', function() {
            it('should seek the player after any pending operations', function(done) {
                player.__private__.playerSeek.and.returnValue(RunnerPromise.resolve('result'));
                player.currentTime = 123;
                expect(player.__private__.serializer.call).toHaveBeenCalled();
                serialFn().then(() => {
                    expect(player.__private__.playerSeek).toHaveBeenCalledWith(123);
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });
        });

        describe('get volume', function() {
            it('should get this player property', function() {
                player.__private__.state.get.and.returnValue(123);
                expect(player.volume).toBe(123);
                expect(player.__private__.state.get).toHaveBeenCalledWith('volume');
            });
        });

        describe('set volume', function() {
            it('should change the players volume after any pending operations', function(done) {
                player.__private__.playerVolume.and.returnValue(RunnerPromise.resolve('result'));
                player.volume = 123;
                expect(player.__private__.serializer.call).toHaveBeenCalled();
                serialFn().then(() => {
                    expect(player.__private__.playerVolume).toHaveBeenCalledWith(123);
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });
        });

        describe('get buffering', function() {
            it('should get this player property', function() {
                player.__private__.state.get.and.returnValue(true);
                expect(player.buffering).toBe(true);
                expect(player.__private__.state.get).toHaveBeenCalledWith('buffering');
            });
        });

        describe('get paused', function() {
            it('should get this player property', function() {
                player.__private__.state.get.and.returnValue(true);
                expect(player.paused).toBe(true);
                expect(player.__private__.state.get).toHaveBeenCalledWith('paused');
            });
        });

        describe('get duration', function() {
            it('should get this player property', function() {
                player.__private__.state.get.and.returnValue(123);
                expect(player.duration).toBe(123);
                expect(player.__private__.state.get).toHaveBeenCalledWith('duration');
            });
        });

        describe('get ended', function() {
            it('should get this player property', function() {
                player.__private__.state.get.and.returnValue(true);
                expect(player.ended).toBe(true);
                expect(player.__private__.state.get).toHaveBeenCalledWith('ended');
            });
        });

        describe('get muted', function() {
            it('should get this player property', function() {
                player.__private__.state.get.and.returnValue(true);
                expect(player.muted).toBe(true);
                expect(player.__private__.state.get).toHaveBeenCalledWith('muted');
            });
        });

        describe('get readyState', function() {
            it('should get this player property', function() {
                player.__private__.state.get.and.returnValue(3);
                expect(player.readyState).toBe(3);
                expect(player.__private__.state.get).toHaveBeenCalledWith('readyState');
            });
        });

        describe('get seeking', function() {
            it('should get this player property', function() {
                player.__private__.state.get.and.returnValue(true);
                expect(player.seeking).toBe(true);
                expect(player.__private__.state.get).toHaveBeenCalledWith('seeking');
            });
        });

        describe('get error', function() {
            it('should get this player property', function() {
                player.__private__.state.get.and.returnValue('epic fail');
                expect(player.error).toBe('epic fail');
                expect(player.__private__.state.get).toHaveBeenCalledWith('error');
            });
        });
        
        describe('get controls', function() {
            it('should get this player property', function() {
                player.__private__.state.get.and.returnValue(true);
                expect(player.controls).toBe(true);
                expect(player.__private__.state.get).toHaveBeenCalledWith('controls');
            });
        });
        
        describe('set controls', function() {
            it('should change the players volume after any pending operations', function(done) {
                player.__private__.playerControls.and.returnValue(RunnerPromise.resolve('result'));
                player.controls = true;
                expect(player.__private__.serializer.call).toHaveBeenCalled();
                serialFn().then(() => {
                    expect(player.__private__.playerControls).toHaveBeenCalledWith(true);
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });
        });
    });
});
