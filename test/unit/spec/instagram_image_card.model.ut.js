import InstagramImageCard from '../../../src/models/InstagramImageCard.js';
import ImageCard from '../../../src/models/ImageCard.js';

describe('InstagramImageCard', function() {
    let instagramImageCard;
    let experience, data;

    beforeEach(function() {
        experience = {
            data: {
                collateral: {
                    splash: '/collateral/experiences/e-42108b552a05ea/splash'
                }
            }
        };

        data = {
            /* jshint quotmark:double */
            "data": {
                "id": "5YN6a0tOc-",
                "thumbs": {
                    "small": "https://scontent.cdninstagram.com/hphotos-xfa1/t51.2885-15/s150x150/e15/11351507_836701216398426_1156749946_n.jpg",
                    "large": "https://scontent.cdninstagram.com/hphotos-xfa1/t51.2885-15/s320x320/e15/11351507_836701216398426_1156749946_n.jpg"
                },
                "type": "image",
                "src": "https://scontent.cdninstagram.com/hphotos-xfa1/t51.2885-15/s640x640/e35/sh0.08/11351507_836701216398426_1156749946_n.jpg"
            },
            "id": "rc-2904af2036e145",
            "type": "instagram",
            "source": "Instagram",
            "modules": [],
            "placementId": null,
            "templateUrl": null,
            "sponsored": false,
            "campaign": {
                "campaignId": null,
                "advertiserId": null,
                "minViewTime": null,
                "countUrls": [],
                "clickUrls": []
            },
            "collateral": {},
            "links": {},
            "params": {},
            "href": "https://instagram.com/p/5YN6a0tOc-/",
            "likes": 77669,
            "date": "1437439190",
            "caption": "Solomon, Pembroke Welsh Corgi (12 w/o), BarkFest 2015, Brooklyn, NY",
            "comments": 9734,
            "user": {
                "fullname": "The Dogist",
                "picture": "https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xfa1/t51.2885-19/s150x150/11382947_1023728481019302_1629502413_a.jpg",
                "username": "thedogist",
                "follow": "https://instagram.com/accounts/login/?next=%2Fp%2F5YN6a0tOc-%2F&source=follow",
                "href": "https://instagram.com/thedogist",
                "bio": "A photo-documentary series about the beauty of dogs. Author of THE DOGIST, coming October, 2015.",
                "website": "http://thedogist.com/book",
                "posts": 2886,
                "followers": 1030957,
                "following": 3
            }
            /* jshint quotmark:single */
        };

        instagramImageCard = new InstagramImageCard(data, experience);
    });

    it('should be an ImageCard', function() {
        expect(instagramImageCard).toEqual(jasmine.any(ImageCard));
    });

    describe('properties:', function() {

        describe('type', function() {

            it('should be "instagram"', function() {
                expect(instagramImageCard.type).toBe('instagramImage');
            });
        });

        describe('title', function() {

            it('should be copied from the passed-in caption', function() {
                expect(instagramImageCard.title).toEqual('Solomon, Pembroke Welsh Corgi (12 w/o), BarkFest 2015, Brooklyn, NY');
            });
        });

        describe('data', function() {

            describe('source', function() {

                it('should be copied from the passed-in value', function() {
                    expect(instagramImageCard.data.source).toEqual('Instagram');
                });
            });

            describe('href', function() {

                it('should be copied from the passed-in value', function() {
                    expect(instagramImageCard.data.href).toEqual('https://instagram.com/p/5YN6a0tOc-/');
                });
            });
        });

        describe('user', function() {
            it('should be copied from the passed-in value', function() {
                const output = instagramImageCard.user;
                const expectedOutput = {
                    fullname: 'The Dogist',
                    picture: 'https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xfa1/t51.2885-19/s150x150/11382947_1023728481019302_1629502413_a.jpg',
                    username: 'thedogist',
                    follow: 'https://instagram.com/accounts/login/?next=%2Fp%2F5YN6a0tOc-%2F&source=follow',
                    href: 'https://instagram.com/thedogist',
                    bio: 'A photo-documentary series about the beauty of dogs. Author of THE DOGIST, coming October, 2015.',
                    website: 'http://thedogist.com/book',
                    posts: 2886,
                    followers: 1030957,
                    following: 3
                };
                expect(output).toEqual(expectedOutput);
            });
        });

        describe('likes', function() {
            it('should be copied from the passed-in value', function() {
                expect(instagramImageCard.likes).toBe(77669);
            });
        });

        describe('data', function() {
            it('should be copied from the passed-in value as a Date object', function() {
                expect(instagramImageCard.date).toEqual(new Date(1437439190000));
            });
        });

        describe('caption', function() {
            it('should be copied from the passed-in value', function() {
                expect(instagramImageCard.caption).toBe('Solomon, Pembroke Welsh Corgi (12 w/o), BarkFest 2015, Brooklyn, NY');
            });
        });

        describe('comments', function() {
            it('should be copied from the passed-in value', function() {
                expect(instagramImageCard.comments).toBe(9734);
            });
        });
    });
});
