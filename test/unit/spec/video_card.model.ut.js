describe('VideoCard', function() {
    import VideoCard from '../../../src/models/VideoCard.js';
    import Card from '../../../src/models/Card.js';
    let card;

    /* jshint quotmark:double */
    const data = {
        "data": {
          "controls": true,
          "skip": true,
          "modestbranding": 0,
          "rel": 0,
          "videoid": "B5FcZrg_Nuo",
          "href": "https://www.youtube.com/watch?v=B5FcZrg_Nuo"
        },
        "id": "rc-68e8e50d9ffcfe",
        "type": "youtube",
        "title": "15. Tabloid",
        "note": "Errol Morris is the world’s greatest documentarian, and here he sinks his teeth into an irresistible tale of sex, kidnapping, and… Mormons. The story of the beautiful Joyce McKinney who kidnapped and allegedly raped a Mormon missionary is sensational enough. But the real scandal lies in the British tabloid wars between The Daily Mirror and The Daily Express which in a mad rush for readers stopped at nothing to unearth shady details about McKinney’s past and present. Anybody who believes journalism has fallen into the gutter thanks to the Internet should take note that this took place in 1977, when the Web was just a twinkle in Al Gore’s eye.",
        "source": "YouTube",
        "modules": [],
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
    };
    /* jshint quotmark:single */

    beforeEach(function() {
        card = new VideoCard(data);
    });

    it('should exist', function() {
        expect(card).toEqual(jasmine.any(Card));
    });

    describe('properties:', function() {
        describe('type', function() {
            it('should be "video"', function() {
                expect(card.type).toBe('video');
            });
        });

        describe('data', function() {
            it('should be an object with the video data', function() {
                expect(card.data).toEqual({
                    type: data.type,
                    source: data.source,
                    href: data.data.href,
                    videoid: data.data.videoid
                });
            });
        });
    });
});
