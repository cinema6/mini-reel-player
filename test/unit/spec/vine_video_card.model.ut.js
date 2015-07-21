import VineVideoCard from '../../../src/models/VineVideoCard.js';
import VideoCard from '../../../src/models/VideoCard.js';

describe('VineVideoCard', function() {
    let data, experience;
    let card;

    beforeEach(function() {
        data = {
            /* jshint quotmark:double */
            "campaign": {
                "advertiserId": null,
                "campaignId": null,
                "clickUrls": [],
                "countUrls": [],
                "minViewTime": null
            },
            "collateral": {},
            "data": {
                "code": "<iframe src=\"https://vine.co/v/erUbKHDX6Ug/embed/simple\" style=\"width:100%;height:100%\" frameborder=\"0\"></iframe><script src=\"https://platform.vine.co/static/scripts/embed.js\"><\/script>",
                "href": "https://vine.co/v/erUbKHDX6Ug",
                "service": "vine",
                "skip": true,
                "thumbs": {
                    "large": "https://v.cdn.vine.co/r/videos/C31833CBD01233913054908575744_3c4238857b1.4.2.10927983196821659900.mp4.jpg?versionId=qikEoITRQWCqj.xYFpPF53iTSlIdCucx",
                    "small": "https://v.cdn.vine.co/r/videos/C31833CBD01233913054908575744_3c4238857b1.4.2.10927983196821659900.mp4.jpg?versionId=qikEoITRQWCqj.xYFpPF53iTSlIdCucx"
                },
                "videoid": "erUbKHDX6Ug"
            },
            "id": "rc-f409791386e1a4",
            "links": {},
            "modules": [],
            "note": "This is a vine card.",
            "params": {},
            "placementId": null,
            "source": "Vine",
            "sponsored": false,
            "templateUrl": null,
            "thumbs": null,
            "title": "VINE",
            "type": "vine"
            /* jshint quotmark:single */
        };

        experience = { data: {} };

        card = new VineVideoCard(data, experience);
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
