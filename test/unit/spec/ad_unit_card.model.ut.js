import AdUnitCard from '../../../src/models/AdUnitCard.js';
import VideoCard from '../../../src/models/VideoCard.js';

describe('AdUnitCard', function() {
    let card;
    let data;
    let experience;

    beforeEach(function() {
        experience = {
            data: {}
        };

        data = {
            /* jshint quotmark:double */
            "data": {
              "hideSource": true,
              "autoplay": true,
              "controls": false,
              "autoadvance": false,
              "skip": 40,
              "vast": "//ad.doubleclick.net/pfadx/N6543.1919213CINEMA6INC/B8370514.113697085;sz=0x0;ord=[timestamp];dcmt=text/xml"
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

        card = new AdUnitCard(data, experience);
    });

    it('should be a VideoCard', function() {
        expect(card).toEqual(jasmine.any(VideoCard));
    });

    describe('properties:', function() {
        describe('data', function() {
            describe('.videoid', function() {
                it('should be the VAST', function() {
                    expect(card.data.videoid).toBe(data.data.vast);
                });
            });
        });
    });
});
