import AdUnitCard from '../../../src/models/AdUnitCard.js';
import VideoCard from '../../../src/models/VideoCard.js';
import completeUrl from '../../../src/fns/complete_url.js';

describe('AdUnitCard', function() {
    let card;
    let data;
    let experience;
    let profile;

    beforeEach(function() {
        experience = {
            data: {}
        };

        profile = {};

        data = {
            /* jshint quotmark:double */
            "data": {
              "hideSource": true,
              "autoplay": false,
              "controls": false,
              "autoadvance": false,
              "skip": 40,
              "vast": "//ad.doubleclick.net/pfadx/N6543.1919213CINEMA6INC/B8370514.113697085;sz=0x0;ord=[timestamp];dcmt=text/xml",
              "vpaid": "//ad.doubleclick.net/pfadx/N6543.1919213CINEMA6VPAIDINC/B8370514.113697085;sz=0x0;ord=[timestamp];dcmt=text/xml"
            },
            "id": "rc-c175fedab87e6f",
            "type": "adUnit",
            "title": "WATCH & LEARN",
            "note": "See how to make classic, seasonal and specialty cocktails from our expert bartenders. You’re just a shake, stir and pour away from the ultimate drink.",
            "modules": [
              "displayAd",
              "post"
            ],
            "thumbs": {
              "small": "https://yt3.ggpht.com/-EFAfQiEuYSI/AAAAAAAAAAI/AAAAAAAAAAA/AsAgcOBSoTw/s100-c-k-no/photo.jpg",
              "large": "https://yt3.ggpht.com/-EFAfQiEuYSI/AAAAAAAAAAI/AAAAAAAAAAA/AsAgcOBSoTw/s100-c-k-no/photo.jpg"
            },
            "placementId": "3245275",
            "templateUrl": null,
            "sponsored": true,
            "campaign": {
              "campaignId": "",
              "advertiserId": "DIAGEO USA",
              "minViewTime": -1
            },
            "collateral": {
              "logo": "http://i.imgur.com/YbBIFZv.png"
            },
            "links": {},
            "params": {
              "action": null,
              "sponsor": "thebar.com",
              "ad": true
            }
            /* jshint quotmark:single */
        };

        card = new AdUnitCard(data, experience, profile);
    });

    it('should be a VideoCard', function() {
        expect(card).toEqual(jasmine.any(VideoCard));
    });

    describe('properties:', function() {
        describe('data', function() {
            describe('.type', function() {
                it('should be "vast"', function() {
                    expect(card.data.type).toBe('vast');
                });
            });

            describe('.videoid', function() {
                it('should be the VAST tag', function() {
                    expect(card.data.videoid).toBe(data.data.vast);
                });

                describe('if the card has no vast tag', function() {
                    beforeEach(function() {
                        data.data.vast = null;

                        card = new AdUnitCard(data, experience, profile);
                    });

                    it('should be the vpaid tag', function() {
                        expect(card.data.videoid).toBe(data.data.vpaid);
                    });
                });
            });

            describe('.preload', function() {
                it('should be true', function() {
                    expect(card.data.preload).toBe(true);
                });
            });
        });
    });

    describe('methods:', function() {
        describe('getSrc()', function() {
            beforeEach(function() {
                jasmine.clock().install();
                jasmine.clock().mockDate();

                card.data.videoid = '//ad.doubleclick.net/pfadx/N6543.1919213CINEMA6INC/B8370514.113697085;sz=0x0;ord={cachebreaker};dcmt=text/xml;url={pageUrl};id={guid};cb={cachebreaker}';
            });

            afterEach(function() {
                jasmine.clock().uninstall();
            });

            it('should be the videoid passed through the completeUrl() function', function() {
                expect(card.getSrc()).toBe(completeUrl(card.data.videoid));
            });
        });
    });
});
