import InstagramVideoCard from '../../../src/models/InstagramVideoCard.js';
import VideoCard from '../../../src/models/VideoCard.js';

describe('InstagramVideoCard', function() {
    let instagramVideoCard;
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
                "id": "5U4nPnmyDc",
                "thumbs": {
                    "small": "https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/s150x150/e15/11381442_443827579136917_34636061_n.jpg",
                    "large": "https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/s320x320/e15/11381442_443827579136917_34636061_n.jpg"
                },
                "type": "video",
                "src": "https://scontent.cdninstagram.com/hphotos-xfa1/t50.2886-16/11765072_1641853446058461_1518004451_n.mp4",
                "href": "https://instagram.com/p/5U4nPnmyDc/",
                "likes": 16839,
                "date": "1437327359",
                "caption": "Handheld Bungee Jump😱 | Via @damienwalters",
                "comments": 1051,
                "user": {
                    "fullname": "Videos",
                    "picture": "https://igcdn-photos-c-a.akamaihd.net/hphotos-ak-xfp1/t51.2885-19/10956552_1556821651232394_1665347195_a.jpg",
                    "username": "unbelievable",
                    "follow": "https://instagram.com/accounts/login/?next=%2Fp%2F5U4nPnmyDc%2F&source=follow",
                    "href": "https://instagram.com/thedogist",
                    "bio": "Most UNBELIEVABLE videos on this planet! Can you believe it? #unbelievable\nmmgfeed@gmail.com K: UAV",
                    "website": "http://www.shoprad.co",
                    "posts": 391,
                    "followers": 522304,
                    "following": 9
                }
            },
            "id": "rc-42ee5be0f0ee18",
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
            "params": {}
            /* jshint quotmark:single */
        };

        instagramVideoCard = new InstagramVideoCard(data, experience);
    });

    it('should be an VideoCard', function() {
        expect(instagramVideoCard).toEqual(jasmine.any(VideoCard));
    });

    describe('properties:', function() {

        describe('type', function() {

            it('should be "instagram"', function() {
                expect(instagramVideoCard.type).toBe('instagramVideo');
            });
        });

        describe('title', function() {

            it('should be copied from the passed-in title', function() {
                data.title = 'Oooh it\'s a doggie!';
                instagramVideoCard = new InstagramVideoCard(data, experience);
                expect(instagramVideoCard.title).toBe('Oooh it\'s a doggie!');
            });

            it('should be copied from the passed-in caption', function() {
                expect(instagramVideoCard.title).toEqual('Handheld Bungee Jump😱 | Via @damienwalters');
            });
        });

        describe('hideTitle', function() {

            it('should be false if a title is given', function() {
                data.title = 'Oooh it\'s a doggie!';
                instagramVideoCard = new InstagramVideoCard(data, experience);
                expect(instagramVideoCard.hideTitle).toBe(false);
            });

            it('should be true if a title is not given', function() {
                expect(instagramVideoCard.hideTitle).toBe(true);
            });
        });

        describe('data', function() {

            describe('href', function() {

                it('should be copied from the passed-in value', function() {
                    expect(instagramVideoCard.data.href).toEqual('https://instagram.com/p/5U4nPnmyDc/');
                });
            });

            describe('src', function() {
                it('should be copied from the passed-in value', function() {
                    expect(instagramVideoCard.data.src).toBe('https://scontent.cdninstagram.com/hphotos-xfa1/t50.2886-16/11765072_1641853446058461_1518004451_n.mp4');
                });
            });

            describe('user', function() {
                it('should be copied from the passed-in value', function() {
                    const output = instagramVideoCard.data.user;
                    const expectedOutput = {
                        fullname: 'Videos',
                        picture: 'https://igcdn-photos-c-a.akamaihd.net/hphotos-ak-xfp1/t51.2885-19/10956552_1556821651232394_1665347195_a.jpg',
                        username: 'unbelievable',
                        follow: 'https://instagram.com/accounts/login/?next=%2Fp%2F5U4nPnmyDc%2F&source=follow',
                        href: 'https://instagram.com/thedogist',
                        bio: 'Most UNBELIEVABLE videos on this planet! Can you believe it? #unbelievable\nmmgfeed@gmail.com K: UAV',
                        website: 'http://www.shoprad.co',
                        posts: 391,
                        followers: 522304,
                        following: 9
                    };
                    expect(output).toEqual(expectedOutput);
                });
            });

            describe('likes', function() {
                it('should be copied from the passed-in value', function() {
                    expect(instagramVideoCard.data.likes).toBe(16839);
                });
            });

            describe('date', function() {
                it('should be copied from the passed-in value as a Date object', function() {
                    expect(instagramVideoCard.data.date).toEqual(new Date(1437327359000));
                });
            });

            describe('caption', function() {
                it('should be copied from the passed-in value', function() {
                    expect(instagramVideoCard.data.caption).toBe('Handheld Bungee Jump😱 | Via @damienwalters');
                });
            });

            describe('comments', function() {
                it('should be copied from the passed-in value', function() {
                    expect(instagramVideoCard.data.comments).toBe(1051);
                });
            });
        });
    });
});
