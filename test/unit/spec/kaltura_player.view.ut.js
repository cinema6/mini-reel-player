import KalturaPlayer from '../../../src/players/KalturaPlayer.js';
import ThirdPartyPlayer from '../../../src/players/ThirdPartyPlayer.js';
import Runner from '../../../lib/Runner.js';
import RunnerPromise from '../../../lib/RunnerPromise.js';
import PlayerInterface from '../../../src/interfaces/PlayerInterface.js';
import codeLoader from '../../../src/services/code_loader.js';

describe('Kaltura Player', function() {
    let player, mockApi, mockKaltura;

    beforeEach(function() {
        player = new KalturaPlayer();
        mockApi = {
            kBind: jasmine.createSpy('kBind()'),
            kUnbind: jasmine.createSpy('kUnbind()'),
            sendNotification: jasmine.createSpy('sendNotification()'),
            evaluate: jasmine.createSpy('evaluate()')
        };
        mockKaltura = {
            embed: jasmine.createSpy('embed()')
        };
        spyOn(player, '__setProperty__');
        spyOn(codeLoader, 'configure');
        spyOn(codeLoader, 'load');
        spyOn(Runner, 'schedule');
        spyOn(document, 'getElementById').and.callThrough();
        Runner.run(() => {
            player.create();
        });
    });

    it('should exist', function() {
        expect(player).toEqual(jasmine.any(ThirdPartyPlayer));
    });

    it('should implement the PlayerInterface', function() {
        expect(player).toImplement(PlayerInterface);
    });

    it('should set the api name', function() {
        expect(player.__api__.name).toBe('KalturaPlayer');
    });

    describe('the loadPlayer function', function() {
        let onCodeLoaderSuccess;
        
        beforeEach(function() {
            codeLoader.load.and.returnValue({
                then: onSuccess => onCodeLoaderSuccess = onSuccess
            });
            player.__api__.loadPlayer('{"partnerid": "2054981","playerid":"32784031","videoid":"1_dsup2iqd"}');
        });
        
        it('should configure the codeLoader', function() {
            expect(codeLoader.configure).toHaveBeenCalledWith('kaltura', {
                src: 'https://cdnapisec.kaltura.com/p/2054981/sp/205498100/embedIframeJs/uiconf_id/32784031/partner_id/2054981',
                after: jasmine.any(Function)
            });
        });
        
        it('should load the Kaltura script', function() {
            expect(codeLoader.load).toHaveBeenCalledWith('kaltura');
        });
        
        describe('when the Kaltura script loads', function() {
            let result;
            
            beforeEach(function() {
                result = onCodeLoaderSuccess(mockKaltura);
            });
            
            it('should embed the player in an afterRender queue', function() {
                expect(Runner.schedule).toHaveBeenCalledWith('afterRender', null, jasmine.any(Function));
            });
            
            it('should return a RunnerPromise', function() {
                expect(result).toEqual(jasmine.any(RunnerPromise));
            });
            
            describe('embedding the player in the afterRender queue', function() {
                beforeEach(function() {
                    Runner.schedule.calls.mostRecent().args[2]();
                });
                
                it('should append a div', function() {
                    expect(player.element.childNodes.length).toBe(1);
                    expect(player.element.childNodes[0].tagName).toBe('DIV');
                    expect(player.element.childNodes[0].getAttribute('id')).toContain('kaltura_player_');
                });
                
                it('should embed the Kaltura player with the proper options', function() {
                    expect(mockKaltura.embed).toHaveBeenCalledWith({
                        targetId: jasmine.any(String),
                        wid: '_2054981',
                        /* jshint camelcase:false */
                        uiconf_id: '32784031',
                        /* jshint camelcase:true */
                        flashvars: {
                            EmbedPlayer: {
                                WebKitPlaysInline: true
                            },
                            KalturaSupport: {
                                LeadWithHTML5: true
                            }
                        },
                        /* jshint camelcase:false */
                        cache_st: jasmine.any(String),
                        entry_id: '1_dsup2iqd',
                        /* jshint camelcase:true */
                        readyCallback: jasmine.any(Function)
                    });
                });
                
                describe('the readyCallback', function() {
                    beforeEach(function() {
                        document.getElementById.and.returnValue(mockApi);
                        mockKaltura.embed.calls.mostRecent().args[0].readyCallback('some player id');
                    });
                    
                    it('should get the player element', function() {
                        expect(document.getElementById).toHaveBeenCalledWith('some player id');
                    });
                    
                    it('should wait for the media to be ready', function() {
                        expect(mockApi.kBind).toHaveBeenCalledWith('mediaReady', jasmine.any(Function));
                    });
                });
            });
        });
    });

    describe('the api methods', function() {
        it('should implement addEventListener', function() {
            player.__api__.methods.addEventListener(mockApi, 'foo', () => {});
            expect(mockApi.kBind).toHaveBeenCalledWith('foo', jasmine.any(Function));
        });
        
        it('should implement removeEventListener', function() {
            player.__api__.methods.removeEventListener(mockApi, 'foo');
            expect(mockApi.kUnbind).toHaveBeenCalledWith('foo');
        });
        
        it('should implement play', function() {
            player.__api__.methods.play(mockApi);
            expect(mockApi.sendNotification).toHaveBeenCalledWith('doPlay');
        });
        
        it('should implement pause', function() {
            player.__api__.methods.pause(mockApi);
            expect(mockApi.sendNotification).toHaveBeenCalledWith('doPause');
        });
        
        it('should implement unload', function() {
            Runner.schedule.and.callThrough();
            player.element.innerHTML = 'not empty';
            Runner.run(() => {
                player.__api__.methods.unload(mockApi);
            });
            expect(mockApi.sendNotification).toHaveBeenCalledWith('cleanMedia');
            expect(player.element.innerHTML).toBe('');
        });
        
        it('should implement seek', function() {
            player.__api__.methods.seek(mockApi, 123);
            expect(mockApi.sendNotification).toHaveBeenCalledWith('doSeek', 123);
        });
        
        it('should implement volume', function() {
            player.__api__.methods.volume(mockApi, 0.5);
            expect(mockApi.sendNotification).toHaveBeenCalledWith('changeVolume', 0.5);
        });
        
        it('should implement controls', function() {
            player.__api__.methods.controls(mockApi, false);
            expect(mockApi.sendNotification).toHaveBeenCalledWith('enableGui', {
                guiEnabled: false
            });
            mockApi.sendNotification.calls.reset();
            player.__api__.methods.controls(mockApi, true);
            expect(mockApi.sendNotification).toHaveBeenCalledWith('enableGui', {
                guiEnabled: true
            });
        });
    });

    describe('the implemented api events', function() {
        it('should handle the playerPlayEnd event', function() {
            player.__api__.events.playerPlayEnd();
            expect(player.__setProperty__).toHaveBeenCalledWith('ended', true);
            expect(player.__setProperty__).toHaveBeenCalledWith('paused', true);
        });
        
        it('should handle the durationChange event', function() {
            player.__api__.events.durationChange({
                newValue: 123
            });
            expect(player.__setProperty__).toHaveBeenCalledWith('duration', 123);
        });
        
        it('should handle the playerPaused event', function() {
            player.__api__.events.playerPaused();
            expect(player.__setProperty__).toHaveBeenCalledWith('paused', true);
        });
        
        it('should handle the playerPlayed event', function() {
            player.__api__.events.playerPlayed();
            expect(player.__setProperty__).toHaveBeenCalledWith('paused', false);
            expect(player.__setProperty__).toHaveBeenCalledWith('ended', false);
        });
        
        it('should handle the playerSeekStart event', function() {
            player.__api__.events.playerSeekStart();
            expect(player.__setProperty__).toHaveBeenCalledWith('seeking', true);
        });
        
        it('should handle the playerSeekEnd event', function() {
            player.__api__.events.playerSeekEnd();
            expect(player.__setProperty__).toHaveBeenCalledWith('seeking', false);
        });
        
        it('should handle the playerUpdatePlayhead event', function() {
            player.__api__.events.playerUpdatePlayhead(123);
            expect(player.__setProperty__).toHaveBeenCalledWith('currentTime', 123);
        });
        
        it('should handle the openFullScreen event', function() {
            player.__api__.events.openFullScreen();
            expect(player.__setProperty__).toHaveBeenCalledWith('minimized', false);
        });
        
        it('should handle the closeFullScreen event', function() {
            player.__api__.events.closeFullScreen();
            expect(player.__setProperty__).toHaveBeenCalledWith('minimized', true);
        });
        
        it('should handle the volumeChanged event', function() {
            player.__api__.events.volumeChanged({
                newVolume: 0.5
            });
            expect(player.__setProperty__).toHaveBeenCalledWith('volume', 0.5);
        });
        
        it('should handle the mute event', function() {
            player.__api__.events.mute();
            expect(player.__setProperty__).toHaveBeenCalledWith('muted', true);
        });
        
        it('should handle the unmute event', function() {
            player.__api__.events.unmute();
            expect(player.__setProperty__).toHaveBeenCalledWith('muted', false);
        });
    });
    
    describe('the onReady callback', function() {
        it('should set the duration', function() {
            mockApi.evaluate.and.returnValue(123);
            player.__api__.onReady(mockApi);
            expect(mockApi.evaluate).toHaveBeenCalledWith('{duration}');
            expect(player.__setProperty__).toHaveBeenCalledWith('duration', 123);
        });
    });
});
