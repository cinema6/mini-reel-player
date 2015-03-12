import CorePlayer from '../../../src/players/CorePlayer.js';
import View from '../../../lib/core/View.js';
import PlayerPosterView from '../../../src/views/PlayerPosterView.js';
import Runner from '../../../lib/Runner.js';

describe('CorePlayer', function() {
    let player;

    beforeEach(function() {
        player = new CorePlayer();
    });

    it('should be a view', function() {
        expect(player).toEqual(jasmine.any(View));
    });

    describe('properties:', function() {
        describe('tag', function() {
            it('should be "div"', function() {
                expect(player.tag).toBe('div');
            });
        });

        describe('poster', function() {
            it('should be null', function() {
                expect(player.poster).toBeNull();
            });
        });

        describe('classes', function() {
            it('should include "playerBox"', function() {
                expect(player.classes).toEqual(new View().classes.concat(['playerBox']));
            });
        });
    });

    describe('hooks:', function() {
        describe('didCreateElement()', function() {
            let posterView;

            beforeEach(function() {
                player.poster = 'https://i.ytimg.com/vi/B5FcZrg_Nuo/maxresdefault.jpg';

                spyOn(PlayerPosterView.prototype, 'setImage').and.callThrough();
                spyOn(player, 'append').and.callThrough();
                Runner.run(() => player.create());
                posterView = player.append.calls.mostRecent().args[0];
            });

            it('should append a view for its poster', function() {
                expect(player.append).toHaveBeenCalledWith(jasmine.any(PlayerPosterView));
            });

            it('should set the poster\'s image', function() {
                expect(posterView.setImage).toHaveBeenCalledWith(player.poster);
            });

            describe('when the poster is changed', function() {
                beforeEach(function() {
                    posterView.setImage.calls.reset();

                    Runner.run(() => player.poster = 'https://i.ytimg.com/vi/B5FcZrg_Nuo/low.jpg');
                });

                it('should set the poster\'s image again', function() {
                    expect(posterView.setImage).toHaveBeenCalledWith(player.poster);
                });
            });
        });
    });
});
