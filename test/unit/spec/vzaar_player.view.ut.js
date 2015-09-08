import VzaarPlayer from '../../../src/players/VzaarPlayer.js';
import CorePlayer from '../../../src/players/CorePlayer.js';
import Runner from '../../../lib/Runner.js';
import PlayerInterface from '../../../src/interfaces/PlayerInterface.js';
import {EventEmitter} from 'events';
import codeLoader from '../../../src/services/code_loader.js';

describe('VzaarPlayer', function() {
    let player, SpyPlayer;

    beforeEach(function() {
        player = new VzaarPlayer();
    });

    it('should exist', function() {
        expect(player).toEqual(jasmine.any(CorePlayer));
    });

    it('should implement the PlayerInterface', function() {
        expect(player).toImplement(PlayerInterface);
    });

    describe('properties:', function() {
        describe('src', function() {
            it('should be null', function() {
                expect(player.src).toBeNull();
            });
        });
    });

    describe('methods:', function() {
        describe('private', function() {
            fdescribe('loadEmbed', function() {
                function loadEmbed() {
                    Runner.run(() => player.__private__.loadEmbed());
                }

                beforeEach(function() {
                    spyOn(player.__private__.embedView, 'append');
                    spyOn(player, 'unload');
                });

                describe('when there is no videoId', function() {
                    it('should do nothing', function() {
                        loadEmbed();
                        expect(player.__private__.embedView.append).not.toHaveBeenCalled();
                    });
                });

                describe('when the video with the given videoid is already loaded', function() {
                    it('should do nothing', function() {
                        loadEmbed();
                        expect(player.__private__.embedView.append).not.toHaveBeenCalled();
                    });
                });

                describe('when loading a new video', function() {
                    it('should unload the player', function() {
                        player.src = '123';
                        loadEmbed();
                        expect(player.unload).toHaveBeenCalled();
                    });
                });
            });
        });

        describe('play', function() {
            beforeEach(function() {
                Runner.run(() => player.load());
                spyOn(player.__private__, 'loadEmbed');
                spyOn(player.__private__.vzPlayer, 'play2');
                Runner.run(() => player.play());
            });

            it('should call load', function() {
                expect(player.__private__.loadEmbed).toHaveBeenCalledWith(jasmine.any(Function));
            });

            it('should call play2 on the video', function() {
                expect(player.__private__.vzPlayer.play2).toHaveBeenCalled();
            });
        });

        describe('pause', function() {
            it('should call pause on the video if its loaded', function() {
                Runner.run(() => player.load());
                console.log(player.__private__.vzPlayer);
                spyOn(player.__private__.vzPlayer, 'pause');
                Runner.run(() => player.pause());
                expect(player.__private__.vzPlayer.pause).toHaveBeenCalled();
            });

            it('should not call pause on the video if it is not loaded', function() {
                spyOn(player.__private__.vzPlayer, 'pause');
                Runner.run(() => player.pause());
                expect(player.__private__.vzPlayer.pause).not.toHaveBeenCalled();
            });
        });

        describe('minimize()', function() {
            beforeEach(function() {
                Runner.run(() => player.load());
                player.minimize();
            });

            it('should return a no method error', function() {
                expect(player.minimize()).toEqual(new Error('VzaarPlayer cannot minimize.'));
            });
        });

        describe('load()', function() {
            beforeEach(function() {
                Runner.run(() => player.load());
                spyOn(player.__private__, 'loadEmbed');
            });

            it('should call loadEmbed', function() {
                expect(player.__private__.loadEmbed).toHaveBeenCalled();
            });
        });

        describe('unload()', function() {
            beforeEach(function() {
                spyOn(player.__private__.embedView, 'remove');
                Runner.run(() => player.load());
                Runner.run(() => player.unload());
            });

            it('should set the vzPlayer to null', function() {
                expect(player.__private__.vzPlayer).toBeNull();
            });

            it('should set the loadedVideoId to null', function() {
                expect(player.__private__.loadedVideoId).toBeNull();
            });

            it('should call remove on the embed view', function() {
                expect(player.__private__.embedView.remove).toHaveBeenCalled();
            });
        });

        describe('reload()', function() {
            beforeEach(function() {
                spyOn(player, 'unload');
                spyOn(player, 'load');

                Runner.run(() => player.reload());
            });

            it('should unload() then load() the player', function() {
                expect(player.unload).toHaveBeenCalled();
                expect(player.load).toHaveBeenCalled();
            });
        });
    });
});
