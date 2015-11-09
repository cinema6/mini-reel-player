import CorePlayer from '../../../src/players/CorePlayer.js';
import ThirdPartyPlayer from '../../../src/mixins/ThirdPartyPlayer.js';
import PlayerInterface from '../../../src/interfaces/PlayerInterface.js';
import RunnerPromise from '../../../lib/RunnerPromise.js';
import browser from '../../../src/services/browser.js';

describe('ThirdPartyPlayer mixin', function() {
    let player, success, failure;
    
    beforeEach(function() {
        class MyPlayer extends CorePlayer {}
        MyPlayer.mixin(ThirdPartyPlayer);
        player = new MyPlayer();
        player.playerName = 'MyPlayer';
        success = jasmine.createSpy('success');
        failure = jasmine.createSpy('failure');
        spyOn(player, 'emit');
        spyOn(player, 'load').and.callThrough();
        spyOn(player, 'unload').and.callThrough();
        spyOn(player.__private__, 'getPlayerProperty').and.callThrough();
        spyOn(player.__private__, 'playerSeek').and.callThrough();
        spyOn(player.__private__, 'playerVolume').and.callThrough();
        spyOn(player.__private__, 'playerLoad').and.callThrough();
        spyOn(player.__private__, 'playerPlay').and.callThrough();
        spyOn(player.__private__, 'playerPause').and.callThrough();
        spyOn(player.__private__, 'playerUnload').and.callThrough();
        spyOn(player.__private__, 'playerMinimize').and.callThrough();
        spyOn(player.__private__, 'addEventListeners').and.callThrough();
        spyOn(player.__private__, 'removeEventListeners').and.callThrough();
        spyOn(player.__private__, 'callPlayerMethod').and.callThrough();
        spyOn(browser, 'test').and.callThrough();
    });
    
    it('should exist', function() {
        expect(player).toEqual(jasmine.any(CorePlayer));
    });

    it('should implement the player interface', function() {
        expect(player).toImplement(PlayerInterface);
    });
    
    describe('private methods', function() {
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
            
            describe('when calling the load player method', function() {
                let loadSpy;
                
                beforeEach(function() {
                    loadSpy = jasmine.createSpy('load').and.returnValue(RunnerPromise.resolve('the api'));
                    player.playerMethods.load = loadSpy;
                });
                
                it('should make the call to the defined load method', function(done) {
                    player.__private__.callPlayerMethod('load', ['some src']).then(() => {
                        expect(loadSpy).toHaveBeenCalledWith('some src');
                        done();
                    }).catch(error => {
                        expect(error).not.toBeDefined();
                        done();
                    });
                });                
            });
            
            describe('when calling a player method that is not load', function() {
                let playSpy;
                
                beforeEach(function() {
                    playSpy = jasmine.createSpy('play').and.returnValue(RunnerPromise.resolve());
                    player.playerMethods.play = playSpy;
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
        
        describe('getPlayerProperty', function() {
            let getTimeSpy;
            
            beforeEach(function() {
                getTimeSpy = jasmine.createSpy('getCurrentTime').and.returnValue(123);
                player.playerPropertyGetters.currentTime = getTimeSpy;
            });
            
            it('should not return a value for a property not on the whitelist', function() {
                expect(player.__private__.getPlayerProperty('foo')).not.toBeDefined();
            });
            
            it('should use a getter function for the property if one exists and there is an api', function() {
                player.__private__.api = 'the api';
                expect(player.__private__.getPlayerProperty('currentTime')).toBe(123);
                expect(getTimeSpy).toHaveBeenCalledWith('the api');
            });
            
            it('should get a value from the approximate state if it is not null', function() {
                player.__private__.approximateState.currentTime = 123;
                expect(player.__private__.getPlayerProperty('currentTime')).toBe(123);
                expect(getTimeSpy).not.toHaveBeenCalled();
            });
            
            it('should fallback to a default value', function() {
                expect(player.__private__.getPlayerProperty('currentTime')).toBe(0);
                expect(getTimeSpy).not.toHaveBeenCalled();
            });
        });
        
        describe('addEventListeners', function() {
            it('should set the private event listeners property', function(done) {
                player.playerMethods.addEventListener = () => {};
                player.__private__.api = 'the api';
                player.apiEventHandlers = {
                    event1: 'event1 handler',
                    event2: 'event2 handler'
                };
                player.__private__.addEventListeners().then(() => {
                    expect(player.__private__.eventListeners).toEqual([{
                        name: 'event1',
                        handler: 'event1 handler'
                    }, {
                        name: 'event2',
                        handler: 'event2 handler'
                    }]);
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });
            
            it('should call the player method addEventListener for each implemented event', function(done) {
                player.playerMethods.addEventListener = () => {};
                player.__private__.api = 'the api';
                player.apiEventHandlers = {
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
                player.playerMethods.removeEventListener = () => {};
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
                player.__private__.callPlayerMethod.and.returnValue(RunnerPromise.resolve());
                player.__private__.src = 'some src';
                player.__private__.playerLoad().then(() => {
                    expect(player.__private__.callPlayerMethod).toHaveBeenCalledWith('load', ['some src']);
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });
            
            it('should set the api after calling the load method', function(done) {
                player.__private__.callPlayerMethod.and.returnValue(RunnerPromise.resolve('the api'));
                player.__private__.src = 'some src';
                player.__private__.playerLoad().then(() => {
                    expect(player.__private__.api).toBe('the api');
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });
            
            it('should set the readyState after calling the load method', function(done) {
                player.__private__.callPlayerMethod.and.returnValue(RunnerPromise.resolve('the api'));
                player.__private__.src = 'some src';
                player.__private__.playerLoad().then(() => {
                    expect(player.__private__.approximateState.readyState).toBe(3);
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });
            
            it('should add any defined event listeners after calling the load method', function(done) {
                player.__private__.callPlayerMethod.and.returnValue(RunnerPromise.resolve('the api'));
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
        });
        
        describe('playerPlay', function() {
            beforeEach(function() {
                player.__private__.callPlayerMethod.and.returnValue(RunnerPromise.resolve());
            });
            
            it('should call the player method play if there is an api', function(done) {
                player.__private__.api = 'the api';
                player.__private__.playerPlay().then(() => {
                    expect(player.__private__.callPlayerMethod).toHaveBeenCalledWith('play');
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });
            
            it('should test the browser for autoplay capability if there is no api', function(done) {
                browser.test.and.returnValue(RunnerPromise.resolve(true));
                player.__private__.playerLoad.and.returnValue(RunnerPromise.resolve());
                player.__private__.playerPlay().then(() => {
                    expect(browser.test).toHaveBeenCalledWith('autoplay');
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });
            
            it('should load the player before playing if there is no api', function(done) {
                player.__private__.playerLoad.and.returnValue(RunnerPromise.resolve());
                browser.test.and.returnValue(RunnerPromise.resolve(true));
                player.__private__.playerPlay().then(() => {
                    expect(player.__private__.playerLoad).toHaveBeenCalled();
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });
            
            it('should call the play player method after loading if there is no api', function(done) {
                player.__private__.playerLoad.and.returnValue(RunnerPromise.resolve());
                browser.test.and.returnValue(RunnerPromise.resolve(true));
                player.__private__.playerPlay().then(() => {
                    expect(player.__private__.callPlayerMethod).toHaveBeenCalledWith('play');
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
                });
            });
            
            it('should not play if the player is not autoplayable in the browser', function(done) {
                browser.test.and.returnValue(RunnerPromise.resolve(false));
                player.__private__.playerPlay().then(() => {
                    expect(player.__private__.playerLoad).toHaveBeenCalled();
                    expect(player.__private__.callPlayerMethod).not.toHaveBeenCalled();
                    done();
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    done();
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
            
            it('should clear the approximate state if there is an api', function(done) {
                player.__private__.api = 'the api';
                player.__private__.approximateState = {
                    prop1: 'foo',
                    prop2: 'bar'
                };
                player.__private__.playerUnload().then(() => {
                    expect(player.__private__.approximateState.prop1).toBe(null);
                    expect(player.__private__.approximateState.prop2).toBe(null);
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
                player.__private__.getPlayerProperty.and.returnValue(true);
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
                player.__private__.getPlayerProperty.and.returnValue(false);
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
    });
    
    describe('private properties', function() {
        it('should default values', function() {
            expect(player.__private__.src).toBe(null);
            expect(player.__private__.api).toBe(null);
            expect(player.__private__.eventListeners).toEqual([]);
            expect(player.__private__.pendingOperation).toEqual(jasmine.any(RunnerPromise));
            expect(player.__private__.approximateState).toBeDefined();
        });
        
        describe('currentTime', function() {
            it('should get/set the currentTime', function() {
                player.__private__.approximateState.currentTime = 123;
                expect(player.__private__.approximateState.currentTime).toBe(123);
            });
            
            it('should not emit when changing to null', function() {
                player.__private__.approximateState.currentTime = 0;
                player.__private__.approximateState.currentTime = null;
                expect(player.emit).toHaveBeenCalledWith('timeupdate');
                expect(player.emit.calls.all().length).toBe(1);
            });
            
            it('should emit if changing values', function() {
                player.__private__.approximateState.currentTime = 0;
                player.__private__.approximateState.currentTime = 123;
                expect(player.emit).toHaveBeenCalledWith('timeupdate');
                expect(player.emit.calls.all().length).toBe(2);
            });
        });
        
        describe('paused', function() {
            it('should get/set paused', function() {
                player.__private__.approximateState.paused = true;
                expect(player.__private__.approximateState.paused).toBe(true);
            });
            
            it('should emit when changing to true', function() {
                player.__private__.approximateState.paused = true;
                expect(player.emit).toHaveBeenCalledWith('pause');
            });
            
            it('should emit when changing to false', function() {
                player.__private__.approximateState.paused = false;
                expect(player.emit).toHaveBeenCalledWith('play');
                expect(player.emit).toHaveBeenCalledWith('playing');
            });
        });
        
        describe('duration', function() {
            it('should get/set duration', function() {
                player.__private__.approximateState.duration = 123;
                expect(player.__private__.approximateState.duration).toBe(123);
            });
            
            it('should not emit when changing to null', function() {
                player.__private__.approximateState.duration = 0;
                player.__private__.approximateState.duration = null;
                expect(player.emit).toHaveBeenCalledWith('durationchange');
                expect(player.emit.calls.all().length).toBe(1);
            });
            
            it('should emit if changing values', function() {
                player.__private__.approximateState.duration = 0;
                player.__private__.approximateState.duration = 123;
                expect(player.emit).toHaveBeenCalledWith('durationchange');
                expect(player.emit.calls.all().length).toBe(2);
            });
        });
        
        describe('readyState', function() {
            it('should get/set readyState', function() {
                player.__private__.approximateState.readyState = 3;
                expect(player.__private__.approximateState.readyState).toBe(3);
            });
            
            it('should not emit when changing to null', function() {
                player.__private__.approximateState.readyState = 0;
                player.__private__.approximateState.readyState = null;
                expect(player.emit).toHaveBeenCalledWith('emptied');
                expect(player.emit.calls.all().length).toBe(1);
            });
            
            it('should be able to emit emptied', function() {
                player.__private__.approximateState.readyState = 0;
                expect(player.emit).toHaveBeenCalledWith('emptied');
                expect(player.emit.calls.all().length).toBe(1);
            });
            
            it('should be able to emit loadedmetadata', function() {
                player.__private__.approximateState.readyState = 1;
                expect(player.emit).toHaveBeenCalledWith('loadedmetadata');
                expect(player.emit.calls.all().length).toBe(1);
            });
            
            it('should be able to emit canplay', function() {
                player.__private__.approximateState.readyState = 3;
                expect(player.emit).toHaveBeenCalledWith('canplay');
                expect(player.emit.calls.all().length).toBe(1);
            });
            
            it('should be able to emit canplaythrough', function() {
                player.__private__.approximateState.readyState = 4;
                expect(player.emit).toHaveBeenCalledWith('canplaythrough');
                expect(player.emit.calls.all().length).toBe(1);
            });
        });
        
        describe('muted', function() {
            it('should get/set muted', function() {
                player.__private__.approximateState.muted = true;
                expect(player.__private__.approximateState.muted).toBe(true);
            });
        });
        
        describe('volume', function() {
            it('should get/set volume', function() {
                player.__private__.approximateState.volume = 123;
                expect(player.__private__.approximateState.volume).toBe(123);
            });
            
            it('should not emit when changing to null', function() {
                player.__private__.approximateState.volume = 0;
                player.__private__.approximateState.volume = null;
                expect(player.emit).toHaveBeenCalledWith('volumechange');
                expect(player.emit.calls.all().length).toBe(1);
            });
            
            it('should emit when changing values', function() {
                player.__private__.approximateState.volume = 0;
                player.__private__.approximateState.volume = 123;
                expect(player.emit).toHaveBeenCalledWith('volumechange');
                expect(player.emit.calls.all().length).toBe(2);
            });
        });
        
        describe('seeking', function() {
            it('should get/set seeking', function() {
                player.__private__.approximateState.seeking = true;
                expect(player.__private__.approximateState.seeking).toBe(true);
            });
            
            it('should emit when changing to true', function() {
                player.__private__.approximateState.seeking = true;
                expect(player.emit).toHaveBeenCalledWith('seeking');
            });
            
            it('should emit when changing to false', function() {
                player.__private__.approximateState.seeking = false;
                expect(player.emit).toHaveBeenCalledWith('seeked');
            });
        });
        
        describe('minimized', function() {
            it('should get/set minimized', function() {
                player.__private__.approximateState.minimized = true;
                expect(player.__private__.approximateState.minimized).toBe(true);
            });
        });
        
        describe('width', function() {
            it('should get/set width', function() {
                player.__private__.approximateState.width = 123;
                expect(player.__private__.approximateState.width).toBe(123);
            });

            it('should not emit when changing to null', function() {
                player.__private__.approximateState.width = 0;
                player.__private__.approximateState.width = null;
                expect(player.emit).toHaveBeenCalledWith('resize');
                expect(player.emit.calls.all().length).toBe(1);
            });
            
            it('should emit when changing values', function() {
                player.__private__.approximateState.width = 0;
                player.__private__.approximateState.width = 123;
                expect(player.emit).toHaveBeenCalledWith('resize');
                expect(player.emit.calls.all().length).toBe(2);
            });
        });
        
        describe('height', function() {
            it('should get/set height', function() {
                player.__private__.approximateState.height = 123;
                expect(player.__private__.approximateState.height).toBe(123);
            });

            it('should not emit when changing to null', function() {
                player.__private__.approximateState.height = 0;
                player.__private__.approximateState.height = null;
                expect(player.emit).toHaveBeenCalledWith('resize');
                expect(player.emit.calls.all().length).toBe(1);
            });
            
            it('should emit when changing values', function() {
                player.__private__.approximateState.height = 0;
                player.__private__.approximateState.height = 123;
                expect(player.emit).toHaveBeenCalledWith('resize');
                expect(player.emit.calls.all().length).toBe(2);
            });
        });
        
        describe('ended', function() {
            it('should get/set ended', function() {
                player.__private__.approximateState.ended = true;
                expect(player.__private__.approximateState.ended).toBe(true);
            });

            it('should emit when changing to true', function() {
                player.__private__.approximateState.ended = true;
                expect(player.emit).toHaveBeenCalledWith('ended');
            });
            
            it('should emit when changing to false', function() {
                player.__private__.approximateState.ended = false;
                expect(player.emit).toHaveBeenCalledWith('playing');
            });
        });

        describe('error', function() {
            it('should get/set error', function() {
                player.__private__.approximateState.error = 'epic fail';
                expect(player.__private__.approximateState.error).toBe('epic fail');
            });
        });        
    });
    
    describe('public methods', function() {
        describe('load', function() {
            it('should load the player after any pending operations', function(done) {
                player.playerMethods.load = 'not null';
                player.__private__.playerLoad.and.returnValue(RunnerPromise.resolve('result'));
                player.__private__.pendingOperation = RunnerPromise.resolve();
                player.load();
                setTimeout(() => {
                    expect(player.__private__.playerLoad).toHaveBeenCalled();
                    player.__private__.pendingOperation.then(result => {
                        expect(result).toBe('result');
                        done();
                    }).catch(error => {
                        expect(error).not.toBeDefined();
                        done();
                    });
                }, 1);
            });
            
            it('should return an error if not implemented', function() {                
                expect(player.load()).toEqual(new Error('MyPlayer cannot load.'));
            });
        });
        
        describe('play', function() {
            it('should play the player after any pending operations', function(done) {
                player.playerMethods.play = 'not null';
                player.__private__.playerPlay.and.returnValue(RunnerPromise.resolve('result'));
                player.__private__.pendingOperation = RunnerPromise.resolve();
                player.play();
                setTimeout(() => {
                    expect(player.__private__.playerPlay).toHaveBeenCalled();
                    player.__private__.pendingOperation.then(result => {
                        expect(result).toBe('result');
                        done();
                    }).catch(error => {
                        expect(error).not.toBeDefined();
                        done();
                    });
                }, 1);
            });
            
            it('should return an error if not implemented', function() {                
                expect(player.play()).toEqual(new Error('MyPlayer cannot play.'));
            });
        });
        
        describe('pause', function() {
            it('should play the player after any pending operations', function(done) {
                player.playerMethods.pause = 'not null';
                player.__private__.playerPause.and.returnValue(RunnerPromise.resolve('result'));
                player.__private__.pendingOperation = RunnerPromise.resolve();
                player.pause();
                setTimeout(() => {
                    expect(player.__private__.playerPause).toHaveBeenCalled();
                    player.__private__.pendingOperation.then(result => {
                        expect(result).toBe('result');
                        done();
                    }).catch(error => {
                        expect(error).not.toBeDefined();
                        done();
                    });
                }, 1);
            });
            
            it('should return an error if not implemented', function() {                
                expect(player.pause()).toEqual(new Error('MyPlayer cannot pause.'));
            });
        });
        
        describe('unload', function() {
            it('should unload the player after any pending operations', function(done) {
                player.playerMethods.unload = 'not null';
                player.__private__.playerUnload.and.returnValue(RunnerPromise.resolve('result'));
                player.__private__.pendingOperation = RunnerPromise.resolve();
                player.unload();
                setTimeout(() => {
                    expect(player.__private__.playerUnload).toHaveBeenCalled();
                    player.__private__.pendingOperation.then(result => {
                        expect(result).toBe('result');
                        done();
                    }).catch(error => {
                        expect(error).not.toBeDefined();
                        done();
                    });
                }, 1);
            });
            
            it('should return an error if not implemented', function() {                
                expect(player.unload()).toEqual(new Error('MyPlayer cannot unload.'));
            });
        });
        
        describe('reload', function() {
            it('should call unload and load', function() {
                player.playerMethods.load = 'not null';
                player.playerMethods.unload = 'not null';
                player.reload();
                expect(player.unload).toHaveBeenCalled();
                expect(player.load).toHaveBeenCalled();
            });
            
            it('should return an error if not implemented', function() {
                expect(player.reload()).toEqual(new Error('MyPlayer cannot reload.'));
            });
        });
        
        describe('minimize', function() {
            it('should unload the player after any pending operations', function(done) {
                player.playerMethods.minimize = 'not null';
                player.__private__.playerMinimize.and.returnValue(RunnerPromise.resolve('result'));
                player.__private__.pendingOperation = RunnerPromise.resolve();
                player.minimize();
                setTimeout(() => {
                    expect(player.__private__.playerMinimize).toHaveBeenCalled();
                    player.__private__.pendingOperation.then(result => {
                        expect(result).toBe('result');
                        done();
                    }).catch(error => {
                        expect(error).not.toBeDefined();
                        done();
                    });
                }, 1);
            });
            
            it('should return an error if not implemented', function() {                
                expect(player.minimize()).toEqual(new Error('MyPlayer cannot minimize.'));
            });
        });
        
        describe('setEventDrivenProperty', function() {
            it('should set an allowed property on the approximate state', function() {
                player.setEventDrivenProperty('currentTime', 123);
                expect(player.__private__.approximateState.currentTime).toBe(123);
            });
            
            it('should not set disallowed properties', function() {
                player.setEventDrivenProperty('foo', 'bar');
                expect(player.__private__.approximateState.foo).not.toBeDefined();
            });
        });
    });
    
    describe('public properties', function() {
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
                player.__private__.getPlayerProperty.and.returnValue(123);
                expect(player.currentTime).toBe(123);
                expect(player.__private__.getPlayerProperty).toHaveBeenCalledWith('currentTime');
            });
        });
        
        describe('set currentTime', function() {
            it('should seek the player after any pending operations', function(done) {
                player.__private__.playerSeek.and.returnValue(RunnerPromise.resolve('result'));
                player.__private__.pendingOperation = RunnerPromise.resolve();
                player.currentTime = 123;
                setTimeout(() => {
                    expect(player.__private__.playerSeek).toHaveBeenCalledWith(123);
                    player.__private__.pendingOperation.then(result => {
                        expect(result).toBe('result');
                        done();
                    }).catch(error => {
                        expect(error).not.toBeDefined();
                        done();
                    });
                }, 1);
            });
        });
        
        describe('get volume', function() {
            it('should get this player property', function() {
                player.__private__.getPlayerProperty.and.returnValue(123);
                expect(player.volume).toBe(123);
                expect(player.__private__.getPlayerProperty).toHaveBeenCalledWith('volume');
            });
        });
        
        describe('set volume', function() {
            it('should change the players volume after any pending operations', function(done) {
                player.__private__.playerVolume.and.returnValue(RunnerPromise.resolve('result'));
                player.__private__.pendingOperation = RunnerPromise.resolve();
                player.volume = 123;
                setTimeout(() => {
                    expect(player.__private__.playerVolume).toHaveBeenCalledWith(123);
                    player.__private__.pendingOperation.then(result => {
                        expect(result).toBe('result');
                        done();
                    }).catch(error => {
                        expect(error).not.toBeDefined();
                        done();
                    });
                }, 1);
            });
        });
        
        describe('get paused', function() {
            it('should get this player property', function() {
                player.__private__.getPlayerProperty.and.returnValue(true);
                expect(player.paused).toBe(true);
                expect(player.__private__.getPlayerProperty).toHaveBeenCalledWith('paused');
            });
        });
        
        describe('get duration', function() {
            it('should get this player property', function() {
                player.__private__.getPlayerProperty.and.returnValue(123);
                expect(player.duration).toBe(123);
                expect(player.__private__.getPlayerProperty).toHaveBeenCalledWith('duration');
            });
        });
        
        describe('get ended', function() {
            it('should get this player property', function() {
                player.__private__.getPlayerProperty.and.returnValue(true);
                expect(player.ended).toBe(true);
                expect(player.__private__.getPlayerProperty).toHaveBeenCalledWith('ended');
            });
        });
        
        describe('get muted', function() {
            it('should get this player property', function() {
                player.__private__.getPlayerProperty.and.returnValue(true);
                expect(player.muted).toBe(true);
                expect(player.__private__.getPlayerProperty).toHaveBeenCalledWith('muted');
            });
        });

        describe('get readyState', function() {
            it('should get this player property', function() {
                player.__private__.getPlayerProperty.and.returnValue(3);
                expect(player.readyState).toBe(3);
                expect(player.__private__.getPlayerProperty).toHaveBeenCalledWith('readyState');
            });
        });

        describe('get seeking', function() {
            it('should get this player property', function() {
                player.__private__.getPlayerProperty.and.returnValue(true);
                expect(player.seeking).toBe(true);
                expect(player.__private__.getPlayerProperty).toHaveBeenCalledWith('seeking');
            });
        });

        describe('get error', function() {
            it('should get this player property', function() {
                player.__private__.getPlayerProperty.and.returnValue('epic fail');
                expect(player.error).toBe('epic fail');
                expect(player.__private__.getPlayerProperty).toHaveBeenCalledWith('error');
            });
        });
    });
});
