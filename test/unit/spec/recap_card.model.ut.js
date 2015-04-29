describe('RecapCard', function() {
    import RecapCard from '../../../src/models/RecapCard.js';
    import Card from '../../../src/models/Card.js';
    import MiniReel from '../../../src/models/MiniReel.js';
    let card, minireel;

    const experience = {
        data: {}
    };
    const profile = { flash: false };

    /* jshint quotmark:double */
    const data = {
        "data": {
          "controls": true,
          "skip": true,
          "modestbranding": 0,
          "rel": 0,
          "videoid": "B5FcZrg_Nuo"
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
        minireel = new MiniReel();
        minireel.splash = '/collateral/experiences/e-42108b552a05ea/splash';
        card = new RecapCard(data, experience, profile, minireel);
    });

    it('should exist', function() {
        expect(card).toEqual(jasmine.any(Card));
    });

    describe('properties:', function() {
        describe('type', function() {
            it('should be "recap"', function() {
                expect(card.type).toBe('recap');
            });
        });

        describe('data', function() {
            it('should be the minireel', function() {
                expect(card.data).toBe(minireel);
            });
        });

        describe('thumbs', function() {
            it('should use the minireel\'s splash', function() {
                expect(card.thumbs).toEqual({
                    small: minireel.splash,
                    large: minireel.splash
                });
            });
        });
    });
});
