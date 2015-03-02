import TextCard from '../../../src/models/TextCard.js';
import Card from '../../../src/models/Card.js';

describe('TextCard', function() {
    let textCard;
    let minireel, data;

    beforeEach(function() {
        minireel = {
            splash: '/collateral/experiences/e-42108b552a05ea/splash'
        };

        data = {
            /* jshint quotmark:double */
            "data": {},
            "id": "rc-4b3dc304c3573f",
            "type": "text",
            "title": "Check These Out!",
            "note": "This people play the trumpet like you've never heard before.",
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
            /* jshint quotmark:single */
        };

        textCard = new TextCard(data, minireel.splash);
    });

    it('should be a Card', function() {
        expect(textCard).toEqual(jasmine.any(Card));
    });

    describe('properties:', function() {
        describe('type', function() {
            it('should be "text"', function() {
                expect(textCard.type).toBe('text');
            });
        });

        describe('thumbs', function() {
            it('should be copied from the passed-in value', function() {
                expect(textCard.thumbs).toEqual({
                    small: minireel.splash,
                    large: minireel.splash
                });
            });
        });
    });
});
