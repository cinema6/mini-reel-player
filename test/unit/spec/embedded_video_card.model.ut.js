import EmbeddedVideoCard from '../../../src/models/EmbeddedVideoCard.js';
import VideoCard from '../../../src/models/VideoCard.js';

describe('EmbeddedVideoCard', function() {
    let data, experience;
    let card;

    beforeEach(function() {
        data = {
            /* jshint quotmark:double */
            "data": {
              "skip": true,
              "service": "yahoo",
              "videoid": "immigrant-tale-000000984",
              "code": "<iframe width=\"100%\"\n    height=\"100%\"\n    scrolling=\"no\"\n    frameborder=\"0\"\n    src=\"https://screen.yahoo.com/immigrant-tale-000000984.html?format=embed\"\n    allowfullscreen=\"true\"\n    mozallowfullscreen=\"true\"\n    webkitallowfullscreen=\"true\"\n    allowtransparency=\"true\">\n</iframe>",
              "href": "https://screen.yahoo.com/immigrant-tale-000000984.html",
              "thumbs": {
                "small": "https://s1.yimg.com/uu/api/res/1.2/JaJYkJd9poEvE2pPhcZTRQ--/dz02NDA7c209MTtmaT1maWxsO3B5b2ZmPTA7aD0zNjA7YXBwaWQ9eXRhY2h5b24-/http://media.zenfs.com/en-US/video/video.snl.com/SNL_1553_05_Immigrant_Tale.png",
                "large": "https://s1.yimg.com/uu/api/res/1.2/JaJYkJd9poEvE2pPhcZTRQ--/dz02NDA7c209MTtmaT1maWxsO3B5b2ZmPTA7aD0zNjA7YXBwaWQ9eXRhY2h5b24-/http://media.zenfs.com/en-US/video/video.snl.com/SNL_1553_05_Immigrant_Tale.png"
              }
            },
            "id": "rc-541cc592ddc110",
            "type": "embedded",
            "title": "Justin Timberlake is Funny",
            "note": "He's coming to America!",
            "source": "Yahoo! Screen",
            "modules": [],
            "thumbs": {
              "small": "https://s1.yimg.com/uu/api/res/1.2/JaJYkJd9poEvE2pPhcZTRQ--/dz02NDA7c209MTtmaT1maWxsO3B5b2ZmPTA7aD0zNjA7YXBwaWQ9eXRhY2h5b24-/http://media.zenfs.com/en-US/video/video.snl.com/SNL_1553_05_Immigrant_Tale.png",
              "large": "https://s1.yimg.com/uu/api/res/1.2/JaJYkJd9poEvE2pPhcZTRQ--/dz02NDA7c209MTtmaT1maWxsO3B5b2ZmPTA7aD0zNjA7YXBwaWQ9eXRhY2h5b24-/http://media.zenfs.com/en-US/video/video.snl.com/SNL_1553_05_Immigrant_Tale.png"
            },
            "placementId": null,
            "templateUrl": null,
            "sponsored": false,
            "campaign": {
              "campaignId": null,
              "advertiserId": null,
              "minViewTime": null
            },
            "collateral": {},
            "links": {},
            "params": {}
            /* jshint quotmark:single */
        };

        experience = { data: {} };

        card = new EmbeddedVideoCard(data, experience);
    });

    it('should exist', function() {
        expect(card).toEqual(jasmine.any(VideoCard));
    });

    describe('properties:', function() {
        describe('data', function() {
            describe('.videoid', function() {
                it('should be the data\'s code property', function() {
                    expect(card.data.videoid).toBe(data.data.code);
                });
            });
        });
    });
});
