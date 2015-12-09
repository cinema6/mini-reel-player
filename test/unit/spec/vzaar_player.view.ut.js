import VzaarPlayer from '../../../src/players/VzaarPlayer.js';
import ThirdPartyPlayer from '../../../src/players/ThirdPartyPlayer.js';
import Runner from '../../../lib/Runner.js';
import PlayerInterface from '../../../src/interfaces/PlayerInterface.js';
import codeLoader from '../../../src/services/code_loader.js';
import RunnerPromise from '../../../lib/RunnerPromise.js';
import timer from '../../../lib/timer.js';

describe('VzaarPlayer', function() {
    let player, GlobalVzaar, mockApi;

    beforeEach(function() {
        player = new VzaarPlayer();
        mockApi = {
            play2: jasmine.createSpy('play2()'),
            pause: jasmine.createSpy('pause()'),
            seekTo: jasmine.createSpy('seekTo()'),
            setVolume: jasmine.createSpy('setVolume()'),
            addEventListener: jasmine.createSpy('addEventListener()').and.callFake((name, callback) => {
                switch(name) {
                case 'ready':
                    callback();
                }
            }),
            removeEventListener: jasmine.createSpy('removeEventListener()'),
            ready: jasmine.createSpy('ready()').and.callFake(callback => {
                callback();
            }),
            getTotalTime: jasmine.createSpy('getTotalTime()').and.callFake(callback => {
                callback(123);
            }),
            getTime: jasmine.createSpy('getTime()').and.callFake(callback => {
                callback(123)
            }),
            getVolume: jasmine.createSpy('getVolume()').and.callFake(callback => {
                callback(4);
            })
        };
        GlobalVzaar = function() {};
        GlobalVzaar.prototype = mockApi;
        Runner.run(() => {
            player.create();
        });
        spyOn(player.element, 'appendChild');
        spyOn(player, '__setProperty__');
        spyOn(codeLoader, 'load').and.returnValue(RunnerPromise.resolve(GlobalVzaar));
        spyOn(timer, 'interval');
        spyOn(timer, 'cancel');
    });

    it('should exist', function() {
        expect(player).toEqual(jasmine.any(ThirdPartyPlayer));
    });

    it('should implement the PlayerInterface', function() {
        expect(player).toImplement(PlayerInterface);
    });

    it('should set the api name', function() {
        expect(player.__api__.name).toBe('VzaarPlayer');
    });

    describe('the loadPlayer function', function() {
        let div, api;

        beforeEach(function(done) {
            api = null;
            div = { };
            spyOn(document, 'createElement').and.callFake(element => {
                if(element === 'div') {
                    return div;
                }
            });
            Runner.run(() => {
                player.__api__.loadPlayer('abc-123').then(result => {
                    api = result;
                    process.nextTick(done);
                });
            });
        });

        it('should create and append the div', function() {
            expect(document.createElement).toHaveBeenCalledWith('div');
            expect(player.element.appendChild).toHaveBeenCalledWith(div);
        });

        it('should put the correct embed code in the div', function() {
            expect(div.innerHTML).toContain('//view.vzaar.com/abc-123/player?apiOn=true');
        });

        it('should call the codeLoader', function() {
            expect(codeLoader.load).toHaveBeenCalledWith('vzaar');
        });

        it('should resolve with the api when the player is ready', function() {
            expect(mockApi.ready).toHaveBeenCalled();
            expect(api).toEqual(jasmine.any(GlobalVzaar));
        });
    });

    describe('the set api methods', function() {
        describe('the play implementation', function() {
            it('should resolve immediately if playing succeeds', function(done) {
                player.__setProperty__.and.callThrough();
                player.__setProperty__('paused', true);
                mockApi.play2.and.callFake(() => {
                    player.__setProperty__('paused', false);
                });
                player.__api__.methods.play(mockApi).then(() => {
                    expect(mockApi.play2).toHaveBeenCalled();
                    process.nextTick(done);
                }).catch(error => {
                    expect(error).not.toBeDefined();
                    process.nextTick(done);
                });
            });
            
            describe('the interval if playing initially fails', function() {
                let callback, resolve, reject;
                
                beforeEach(function() {
                    resolve = jasmine.createSpy('resolve()');
                    reject = jasmine.createSpy('reject()');
                    player.__setProperty__.and.callThrough();
                    player.__setProperty__('paused', true);
                    player.__api__.methods.play(mockApi).then(resolve).catch(reject);
                    callback = timer.interval.calls.mostRecent().args[0];
                });
                
                it('should try to play and cancel if playing suceeds', function() {
                    player.__setProperty__('paused', false);
                    callback();
                    expect(mockApi.play2).toHaveBeenCalled();
                    expect(timer.cancel).toHaveBeenCalled();
                });
                
                it('should retry the play a total of 10 times before cancelling', function() {
                    for(let i=0;i<9;i++) {
                        callback();
                        expect(timer.cancel).not.toHaveBeenCalled();
                    }
                    callback();
                    expect(mockApi.play2.calls.count()).toBe(11);
                    expect(timer.cancel).toHaveBeenCalled();
                });
            });

            describe('if the player is buffering', function() {
                beforeEach(function() {
                    mockApi.play2.calls.reset();
                    timer.interval.calls.reset();

                    player.__private__.state.set('buffering', true);
                    player.__setProperty__('paused', true);
                    mockApi.play2.and.returnValue(undefined);

                    player.__api__.methods.play(mockApi);
                });

                it('should only call play once', function() {
                    expect(mockApi.play2.calls.count()).toBe(1);
                    expect(timer.interval).not.toHaveBeenCalled();
                });
            });
        });

        it('should implement unload', function() {
            player.element.innerHTML = 'not empty';
            Runner.run(() => {
                player.__api__.methods.unload(mockApi);
            });
            expect(player.element.innerHTML).toBe('');
        });

        it('should implement pause', function() {
            player.__api__.methods.pause(mockApi);
            expect(mockApi.pause).toHaveBeenCalled();
        });

        it('should implement seek', function() {
            player.__api__.methods.seek(mockApi, 123);
            expect(mockApi.seekTo).toHaveBeenCalledWith(123);
        });

        it('should implement volume', function() {
            player.__api__.methods.volume(mockApi, 1);
            expect(mockApi.setVolume).toHaveBeenCalledWith(5);
        });

        it('should implement addEventListener', function() {
            const handler = jasmine.createSpy('handler()');
            player.__api__.methods.addEventListener(mockApi, 'foo', handler);
            expect(mockApi.addEventListener).toHaveBeenCalledWith('foo', jasmine.any(Function));
        });

        it('should implement removeEventListener', function() {
            player.__api__.methods.removeEventListener(mockApi, 'foo');
            expect(mockApi.removeEventListener).toHaveBeenCalledWith('foo');
        });
    });

    describe('the implemented api events', function() {
        describe('the playState event handler', function() {
            it('should handle mediaStarted', function() {
                player.__api__.events.playState('mediaStarted');
                expect(player.__setProperty__).toHaveBeenCalledWith('ended', false);
            });

            it('should handle mediaPaused', function() {
                player.__api__.events.playState('mediaPaused');
                expect(player.__setProperty__).toHaveBeenCalledWith('paused', true);
            });

            it('should handle mediaPlaying', function() {
                player.__api__.events.playState('mediaPlaying');
                expect(player.__setProperty__).toHaveBeenCalledWith('paused', false);
                expect(player.__setProperty__).toHaveBeenCalledWith('ended', false);
            });

            it('should handle mediaEnded', function() {
                player.__api__.events.playState('mediaEnded');
                expect(player.__setProperty__).toHaveBeenCalledWith('paused', true);
                expect(player.__setProperty__).toHaveBeenCalledWith('ended', true);
            });
        });

        describe('the interaction event handler', function() {
            it('should handle the pause interaction', function() {
                player.__api__.events.interaction('pause');
                expect(player.__setProperty__).toHaveBeenCalledWith('paused', true);
            });

            it('should handle the resume interaction', function() {
                player.__api__.events.interaction('resume');
                expect(player.__setProperty__).toHaveBeenCalledWith('paused', false);
                expect(player.__setProperty__).toHaveBeenCalledWith('ended', false);
            });

            it('should handle the soundOn interaction', function() {
                player.__api__.events.interaction('soundOn');
                expect(player.__setProperty__).toHaveBeenCalledWith('muted', false);
            });

            it('should handle the soundOff interaction', function() {
                player.__api__.events.interaction('soundOff');
                expect(player.__setProperty__).toHaveBeenCalledWith('muted', true);
            });
        });

        describe('the onReady event callabck', function() {
            beforeEach(function() {
                player.__setProperty__.and.callThrough();
            });

            it('should set the duration', function() {
                player.on('loadedmetadata', () => expect(() => Runner.schedule('render', null, () => {})).not.toThrow());

                player.__api__.onReady(mockApi);
                expect(mockApi.getTotalTime).toHaveBeenCalledWith(jasmine.any(Function));
                expect(player.__setProperty__).toHaveBeenCalledWith('duration', 123);
            });
        });

        describe('the onPoll event callback', function() {
            beforeEach(function() {
                player.__setProperty__.and.callThrough();
            });

            it('should set the current time', function() {
                player.on('timeupdate', () => expect(() => Runner.schedule('render', null, () => {})).not.toThrow());

                player.__api__.onPoll(mockApi);
                expect(mockApi.getTime).toHaveBeenCalledWith(jasmine.any(Function));
                expect(player.__setProperty__).toHaveBeenCalledWith('currentTime', 123);
            });

            it('should set the current volume', function() {
                player.on('volumechange', () => expect(() => Runner.schedule('render', null, () => {})).not.toThrow());

                player.__api__.onPoll(mockApi);
                expect(mockApi.getVolume).toHaveBeenCalledWith(jasmine.any(Function));
                expect(player.__setProperty__).toHaveBeenCalledWith('volume', 0.8);
            });
        });
    });
});
