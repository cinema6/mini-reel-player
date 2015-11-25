import playerFactory from '../../../src/services/player_factory.js';
import VideoCard from '../../../src/models/VideoCard.js';
import YouTubePlayer from '../../../src/players/YouTubePlayer.js';
import VimeoPlayer from '../../../src/players/VimeoPlayer.js';
import VASTPlayer from '../../../src/players/VASTPlayer.js';
import VPAIDPlayer from '../../../src/players/VPAIDPlayer.js';
import DailymotionPlayer from '../../../src/players/DailymotionPlayer.js';
import SlideshowBobPlayer from '../../../src/players/SlideshowBobPlayer.js';
import VinePlayer from '../../../src/players/VinePlayer.js';
import InstagramVideoCard from '../../../src/models/InstagramVideoCard.js';
import HtmlVideoPlayer from '../../../src/players/HtmlVideoPlayer.js';
import VzaarPlayer from '../../../src/players/VzaarPlayer.js';
import WistiaPlayer from '../../../src/players/WistiaPlayer.js';
import JWPlayer from '../../../src/players/JWPlayer.js';
import VidyardPlayer from '../../../src/players/VidyardPlayer.js';

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

            describe('if the card is from Dailymotion', function() {
                beforeEach(function() {
                    card = new VideoCard({
                        type: 'dailymotion',
                        data: {},
                        params: {},
                        collateral: {}
                    }, experience);

                    result = playerFactory.playerForCard(card);
                });

                it('should be a DailymotionPlayer', function() {
                    expect(result).toEqual(jasmine.any(DailymotionPlayer));
                });
            });

            describe('if the card is from slideshow-bob', function() {
                beforeEach(function() {
                    card = new VideoCard({
                        type: 'slideshow-bob',
                        data: {},
                        params: {},
                        collateral: {}
                    }, experience);

                    result = playerFactory.playerForCard(card);
                });

                it('should be a SlideshowBobPlayer', function() {
                    expect(result).toEqual(jasmine.any(SlideshowBobPlayer));
                });
            });

            describe('if the card is from Vine', function() {
                beforeEach(function() {
                    card.data.type = 'vine';
                    result = playerFactory.playerForCard(card);
                });

                it('should be a VinePlayer', function() {
                    expect(result).toEqual(jasmine.any(VinePlayer));
                });
            });

            describe('if the card is an instagram video card', function() {
                beforeEach(function() {
                    card = new InstagramVideoCard({
                        type: 'video',
                        data: {},
                        params: {},
                        collateral: {}
                    }, experience);

                    result = playerFactory.playerForCard(card);
                });

                it('should be an HtmlVideoPlayer', function() {
                    expect(result).toEqual(jasmine.any(HtmlVideoPlayer));
                });
            });

            describe('if the card is from vzaar', function() {
                beforeEach(function() {
                    card = new VideoCard({
                        type: 'vzaar',
                        data: {},
                        params: {},
                        collateral: {}
                    }, experience);
                    result = playerFactory.playerForCard(card);
                });

                it('should be a VzaarPlayer', function() {
                    expect(result).toEqual(jasmine.any(VzaarPlayer));
                });
            });

            describe('if the card is from Wistia', function() {
                beforeEach(function() {
                    card = new VideoCard({
                        type: 'wistia',
                        data: {},
                        params: {},
                        collateral: {}
                    }, experience);
                    result = playerFactory.playerForCard(card);
                });

                it('should be a WistiaPlayer', function() {
                    expect(result).toEqual(jasmine.any(WistiaPlayer));
                });
            });

            describe('if the card is from JWPlayer', function() {
                beforeEach(function() {
                    card = new VideoCard({
                        type: 'jwplayer',
                        data: {},
                        params: {},
                        collateral: {}
                    }, experience);
                    result = playerFactory.playerForCard(card);
                });

                it('should be a JWPlayer', function() {
                    expect(result).toEqual(jasmine.any(JWPlayer));
                });
            });

            describe('if the card is from Vidyard', function() {
                beforeEach(function() {
                    card = new VideoCard({
                        type: 'vidyard',
                        data: {},
                        params: {},
                        collateral: {}
                    }, experience);
                    result = playerFactory.playerForCard(card);
                });

                it('should be a VidyardPlayer', function() {
                    expect(result).toEqual(jasmine.any(VidyardPlayer));
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
                });

                describe('if it is a vast card', function() {
                    beforeEach(function() {
                        card.data.type = 'vast';
                        result = playerFactory.playerForCard(card);
                    });

                    it('should be a VASTPlayer', function() {
                        expect(result).toEqual(jasmine.any(VASTPlayer));
                    });
                });

                describe('if it is a vpaid card', function() {
                    beforeEach(function() {
                        card.data.type = 'vpaid';
                        result = playerFactory.playerForCard(card);
                    });

                    it('should be a VPAIDPlayer', function() {
                        expect(result).toEqual(jasmine.any(VPAIDPlayer));
                    });
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
