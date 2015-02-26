import PlayerPosterView from '../../../src/views/PlayerPosterView.js';
import View from '../../../lib/core/View.js';

describe('PlayerPosterView', function() {
    let playerPosterView;

    beforeEach(function() {
        playerPosterView = new PlayerPosterView();
    });

    it('should be a view', function() {
        expect(playerPosterView).toEqual(jasmine.any(View));
    });

    describe('properties:', function() {
        describe('tag', function() {
            it('should be a div', function() {
                expect(playerPosterView.tag).toBe('div');
            });
        });
    });

    describe('methods:', function() {
        describe('setImage(src)', function() {
            beforeEach(function() {
                spyOn(playerPosterView, 'setAttribute').and.callThrough();
                playerPosterView.setImage('https://i.ytimg.com/vi/B5FcZrg_Nuo/maxresdefault.jpg');
            });

            it('should set the background image to the url', function() {
                expect(playerPosterView.setAttribute).toHaveBeenCalledWith('style', 'background-image:url("https://i.ytimg.com/vi/B5FcZrg_Nuo/maxresdefault.jpg")');
            });

            describe('if called with null', function() {
                beforeEach(function() {
                    playerPosterView.setAttribute.calls.reset();
                    playerPosterView.setImage(null);
                });

                it('should set style to false', function() {
                    expect(playerPosterView.setAttribute).toHaveBeenCalledWith('style', false);
                });
            });
        });
    });
});
