import VinePlayer from '../../../src/players/VinePlayer.js';
import ThirdPartyPlayer from '../../../src/players/ThirdPartyPlayer.js';
import Runner from '../../../lib/Runner.js';
import PlayerInterface from '../../../src/interfaces/PlayerInterface.js';

describe('VinePlayer', function() {
    let player;

    beforeEach(function() {
        player = new VinePlayer();
        Runner.run(() => {
            player.create();
        });
        spyOn(player.element, 'appendChild');
        spyOn(player, 'reload');
    });

    it('should exist', function() {
        expect(player).toEqual(jasmine.any(ThirdPartyPlayer));
    });

    it('should implement the PlayerInterface', function() {
        expect(player).toImplement(PlayerInterface);
    });

    it('should set the api name', function() {
        expect(player.__api__.name).toBe('VinePlayer');
    });

    describe('the loadPlayer function', function() {
        it('should resolve with an empty object since there is no vine player api', function(done) {
            Runner.run(() => {
                player.__api__.loadPlayer('src').then(api => {
                    expect(api).toEqual({});
                    process.nextTick(done);
                });
            });
        });
        
        it('should append the correct embed code when loading with audio', function(done) {
            player.__private__.loadWithAudio = true;
            Runner.run(() => {
                player.__api__.loadPlayer('src').then(() => {
                    expect(player.element.appendChild).toHaveBeenCalled();
                    const div = player.element.appendChild.calls.mostRecent().args[0];
                    expect(div.innerHTML).toBe('<iframe src="https://vine.co/v/src/embed/simple?audio=1" style="width:100%;height:100%" frameborder="0"></iframe><script src="https://platform.vine.co/static/scripts/embed.js"></script>');
                    process.nextTick(done);
                });
            });
        });
        
        it('should append the correct embed code when loading without audio', function(done) {
            player.__private__.loadWithAudio = false;
            Runner.run(() => {
                player.__api__.loadPlayer('src').then(() => {
                    expect(player.element.appendChild).toHaveBeenCalled();
                    const div = player.element.appendChild.calls.mostRecent().args[0];
                    expect(div.innerHTML).toBe('<iframe src="https://vine.co/v/src/embed/simple" style="width:100%;height:100%" frameborder="0"></iframe><script src="https://platform.vine.co/static/scripts/embed.js"></script>');
                    process.nextTick(done);
                });
            });
        });
        
        it('should set loadWithAudio to false', function(done) {
            player.__private__.loadWithAudio = true;
            Runner.run(() => {
                player.__api__.loadPlayer('src').then(() => {
                    expect(player.__private__.loadWithAudio).toBe(false);
                    process.nextTick(done);
                });
            });
        });
    });

    describe('the set api methods', function() {
        it('should implement play', function() {
            player.__private__.loadWithAudio = false;
            player.__api__.methods.play();
            expect(player.__private__.loadWithAudio).toBe(true);
            expect(player.reload).toHaveBeenCalled();
        });
        
        it('should implement pause', function() {
            player.__api__.methods.pause();
            expect(player.reload).toHaveBeenCalled();
        });
        
        it('should implement unload', function() {
            player.element.innerHTML = '<div></div>';
            Runner.run(() => {
                player.__api__.methods.unload();
            });
            expect(player.element.innerHTML).toBe('');
        });
    });
});
