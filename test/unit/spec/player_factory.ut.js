import playerFactory from '../../../src/services/player_factory.js';
import VideoCard from '../../../src/models/VideoCard.js';
import YouTubePlayer from '../../../src/players/YouTubePlayer.js';
import VimeoPlayer from '../../../src/players/VimeoPlayer.js';
import VASTPlayer from '../../../src/players/VASTPlayer.js';

describe('playerFactory', function() {
    let experience;

    beforeEach(function() {
        playerFactory.constructor();

        experience = { data: {} };
    });

    describe('methods:', function() {
        describe('playerForCard(card)', function() {
            let card;
            let result;

            describe('if the card is from YouTube', function() {
                beforeEach(function() {
                    card = new VideoCard({
                        type: 'youtube',
                        data: {},
                        params: {},
                        collateral: {}
                    }, experience);

                    result = playerFactory.playerForCard(card);
                });

                it('should be a YouTubePlayer', function() {
                    expect(result).toEqual(jasmine.any(YouTubePlayer));
                });
            });

            describe('if the card is from Vimeo', function() {
                beforeEach(function() {
                    card = new VideoCard({
                        type: 'vimeo',
                        data: {},
                        params: {},
                        collateral: {}
                    }, experience);

                    result = playerFactory.playerForCard(card);
                });

                it('should be a VimeoPlayer', function() {
                    expect(result).toEqual(jasmine.any(VimeoPlayer));
                });
            });

            describe('if the card is an adUnit', function() {
                beforeEach(function() {
                    card = new VideoCard({
                        type: 'adUnit',
                        data: {},
                        params: {},
                        collateral: {}
                    }, experience);

                    result = playerFactory.playerForCard(card);
                });

                it('should be a VASTPlayer', function() {
                    expect(result).toEqual(jasmine.any(VASTPlayer));
                });
            });

            describe('if the type is unknown', function() {
                beforeEach(function() {
                    card = new VideoCard({
                        type: 'jsdkf',
                        data: {},
                        params: {},
                        collateral: {}
                    }, experience);
                });

                it('should throw an error', function() {
                    expect(function() {
                        playerFactory.playerForCard(card);
                    }).toThrow(new TypeError(`Have no Player for VideoCard with type "${card.data.type}".`));
                });
            });
        });
    });
});
