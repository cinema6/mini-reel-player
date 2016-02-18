import Card from '../../../src/models/Card.js';
import SponsoredCard from '../../../src/mixins/SponsoredCard.js';
import normalizeLinks from '../../../src/fns/normalize_links.js';
import makeSocialLinks from '../../../src/fns/make_social_links.js';
import makeShareLinks from '../../../src/fns/make_share_links.js';
class MyInstagramCard extends Card {}
MyInstagramCard.mixin(SponsoredCard);

let instagramData;

describe('SponsoredCard mixin', function() {
    let card;

    beforeEach(function() {
        instagramData = {
            /* jshint quotmark:double */
            "data": {
                "id": "5YN6a0tOc-",
                "thumbs": {
                    "small": "https://scontent.cdninstagram.com/hphotos-xfa1/t51.2885-15/s150x150/e15/11351507_836701216398426_1156749946_n.jpg",
                    "large": "https://scontent.cdninstagram.com/hphotos-xfa1/t51.2885-15/s320x320/e15/11351507_836701216398426_1156749946_n.jpg"
                },
                "type": "image",
                "src": "https://scontent.cdninstagram.com/hphotos-xfa1/t51.2885-15/s640x640/sh0.08/e35/11351507_836701216398426_1156749946_n.jpg"
            },
            "id": "rc-d847d2b76b4daf",
            "type": "instagram",
            "source": "Instagram",
            "modules": [],
            "placementId": null,
            "templateUrl": null,
            "sponsored": true,
            "campaign": {
                "campaignId": null,
                "advertiserId": null,
                "minViewTime": null,
                "countUrls": [],
                "clickUrls": []
            },
            "collateral": {
                "logo": "www.site.com/logo"
            },
            "links": {
                "Action": "https://www.cinema6.com",
                "Website": "https://www.cinema6.com",
                "Facebook": "https://www.cinema6.com",
                "Twitter": "https://www.cinema6.com",
                "Pinterest": "https://www.cinema6.com",
                "YouTube": "https://www.cinema6.com"
            },
            "shareLinks": {
                "facebook": "https://www.cinema6.com",
                "twitter": "https://www.cinema6.com",
                "pinterest": "https://www.cinema6.com"
            },
            "params": {
                "action": {
                    "type": "button",
                    "label": "give me a puppy now"
                },
                "ad": true,
                "sponsor": "The Dogist"
            },
            "thumbs":{
              "small":"http://rufflifechicago.com/wp-content/uploads/cat-treats.jpg",
              "large":"http://rufflifechicago.com/wp-content/uploads/cat-treats.jpg"
            },
            "href": "https://instagram.com/p/5YN6a0tOc-/",
            "likes": 78102,
            "date": "1437439190",
            "title": "",
            "caption": "Solomon, Pembroke Welsh Corgi #cat (12 w/o), BarkFest 2015, Brooklyn, NY @taylorswift",
            "comments": 9835,
            "user": {
                "fullname": "The Dogist",
                "picture": "https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xfa1/t51.2885-19/s150x150/11382947_1023728481019302_1629502413_a.jpg",
                "username": "thedogist",
                "follow": "https://instagram.com/accounts/login/?next=%2Fp%2F5YN6a0tOc-%2F&source=follow",
                "href": "https://instagram.com/thedogist",
                "bio": "A photo-documentary series about the beauty of dogs. Author of THE DOGIST, coming October, 2015.",
                "website": "http://thedogist.com/book",
                "posts": 2910,
                "followers": 1052572,
                "following": 3
                /* jshint quotmark:single */
            }
        };
        card = new MyInstagramCard(instagramData);
    });

    it('should exist', function() {
        expect(card).toEqual(jasmine.any(Card));
    });

    describe('if not a sponsored card', function() {
        beforeEach(function() {
            instagramData.sponsored = false;
            card = new MyInstagramCard(instagramData);
        });

        it('should initialize sponsored card properties', function() {
            expect(card.sponsored).toBe(false);
            expect(card.campaign).toEqual({
                'campaignId': null,
                'advertiserId': null,
                'minViewTime': null,
                'countUrls': [],
                'clickUrls': []
            });
            expect(card.action).toEqual({ });
            expect(card.links).toEqual({ });
            expect(card.socialLinks).toEqual([ ]);
            expect(card.ad).toBe(false);
            expect(card.sponsor).not.toBeDefined();
            expect(card.logo).not.toBeDefined();
        });
    });

    describe('if a sponsored card', function() {
        it('should initialize sponsored card properties to their proper values', function() {
            expect(card.sponsored).toBe(true);
            expect(card.campaign).toEqual({
                'campaignId': null,
                'advertiserId': null,
                'minViewTime': null,
                'countUrls': [],
                'clickUrls': []
            });
            expect(card.sponsor).toBe('The Dogist');
            expect(card.action).toEqual({
                type: 'button',
                label: 'give me a puppy now'
            });
            expect(card.logo).toBe('www.site.com/logo');
            expect(card.links).toEqual(normalizeLinks(instagramData.links));
            expect(card.socialLinks).toEqual(makeSocialLinks(card.links));
            expect(card.shareLinks).toEqual(makeShareLinks(instagramData.shareLinks, instagramData.data.thumbs.large, instagramData.title));
            expect(card.ad).toBe(true);
        });
    });

    describe('methods:', function() {
        describe('clickthrough(link)', function() {
            let clickthrough;

            beforeEach(function() {
                clickthrough = jasmine.createSpy('clickthrough()');
                card.on('clickthrough', clickthrough);

                card.clickthrough('Twitter');
            });

            it('should emit the clickthrough event with the link config and type', function() {
                expect(clickthrough).toHaveBeenCalledWith(card.links.Twitter, 'Twitter');
            });

            describe('if the link cannot be found', function() {
                beforeEach(function() {
                    clickthrough.calls.reset();

                    card.clickthrough('jsdhf');
                });

                it('should not emit the event', function() {
                    expect(clickthrough).not.toHaveBeenCalled();
                });
            });
        });

        describe('share(type)', function() {
            let share;

            beforeEach(function() {
                share = jasmine.createSpy('share()');
                card.on('share', share);

                card.share('twitter');
            });

            it('should emit the share event with the share link config', function() {
                expect(share).toHaveBeenCalledWith(card.shareLinks[1], 'twitter');
            });

            describe('if the link cannot be found', function() {
                beforeEach(function() {
                    share.calls.reset();

                    card.share('jsdhf');
                });

                it('should not emit the event', function() {
                    expect(share).not.toHaveBeenCalled();
                });
            });
        });
    });
});
