import DisplayAdCard from '../../../src/models/DisplayAdCard.js';
import Card from '../../../src/models/Card.js';
import makeSocialLinks from '../../../src/fns/make_social_links.js';
import DisplayAd from '../../../src/models/DisplayAd.js';

describe('DisplayAdCard', function() {
    let card;
    let data;
    let experience;

    beforeEach(function() {
        data = {
            /* jshint quotmark:double */
            "data": {
              "size": "300x250"
            },
            "id": "rc-984e8b8e4168d1",
            "type": "displayAd",
            "title": "How Goes It?",
            "note": null,
            "modules": [],
            "placementId": "12345678",
            "templateUrl": null,
            "sponsored": false,
            "campaign": {
              "campaignId": null,
              "advertiserId": null,
              "minViewTime": null
            },
            "collateral": {},
            "links": {
              "Website": "http://www.mysite.com",
              "Twitter": "twitter.com/93rf443t",
              "YouTube": "youtube.com/watch?v=84ry943"
            },
            "thumbs": {
              "small": "http://www.apple.com/logo.png",
              "large": "http://www.apple.com/logo.png"
            },
            "params": {
              "sponsor": "My Sponsor"
            }
            /* jshint quotmark:single */
        };

        experience = { data: {} };

        card = new DisplayAdCard(data, experience);
    });

    it('should exist', function() {
        expect(card).toEqual(jasmine.any(Card));
    });

    describe('properties:', function() {
        describe('type', function() {
            it('should be "displayAd"', function() {
                expect(card.type).toBe('displayAd');
            });
        });

        describe('sponsor', function() {
            it('should be the card\'s sponsor', function() {
                expect(card.sponsor).toBe(data.params.sponsor);
            });
        });

        describe('links', function() {
            it('should be the card\'s links', function() {
                expect(card.links).toBe(data.links);
            });
        });

        describe('socialLinks', function() {
            it('should be an array of social links', function() {
                expect(card.socialLinks).toEqual(makeSocialLinks(data.links));
            });
        });

        describe('displayAd', function() {
            it('should be a DisplayAd', function() {
                expect(card.displayAd).toEqual(new DisplayAd(data, experience));
            });
        });
    });
});
