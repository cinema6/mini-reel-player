import InstagramCardController from '../../../src/controllers/InstagramCardController.js';
import CardController from '../../../src/controllers/CardController.js';
import FullInstagramImageCardView from '../../../src/views/full/FullInstagramImageCardView.js';
import InstagramImageCard from '../../../src/models/InstagramImageCard.js';

describe('InstagramCardController', function() {
    let InstagramCardCtrl;
    let card;

    beforeEach(function() {
        card = new InstagramImageCard({
            data: {
                id: '5YN6a0tOc-',
                thumbs: {
                    small: 'https://scontent.cdninstagram.com/hphotos-xfa1/t51.2885-15/s150x150/e15/11351507_836701216398426_1156749946_n.jpg',
                    large: 'https://scontent.cdninstagram.com/hphotos-xfa1/t51.2885-15/s320x320/e15/11351507_836701216398426_1156749946_n.jpg'
                },
                type: 'image',
                src: 'https://scontent.cdninstagram.com/hphotos-xfa1/t51.2885-15/s640x640/e35/sh0.08/11351507_836701216398426_1156749946_n.jpg'
            },
            id: 'rc-2904af2036e145',
            type: 'instagram',
            source: 'Instagram',
            modules: [],
            placementId: null,
            templateUrl: null,
            sponsored: false,
            campaign: {
                campaignId: null,
                advertiserId: null,
                minViewTime: null,
                countUrls: [],
                clickUrls: []
            },
            collateral: {},
            links: {},
            params: {},
            href: 'https://instagram.com/p/5YN6a0tOc-/',
            likes: 77669,
            date: new Date(2015, 12, 2, 12, 57, 59),
            caption: 'Solomon, Pembroke Welsh Corgi (12 w/o), BarkFest 2015, Brooklyn, NY',
            comments: 9734,
            user: {
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
            }
        }, {
            data: {
                collateral: {}
            }
        });

        InstagramCardCtrl = new InstagramCardController(card);
        InstagramCardCtrl.model = card;
        InstagramCardCtrl.view = new FullInstagramImageCardView();
    });

    it('should exist', function() {
        expect(InstagramCardCtrl).toEqual(jasmine.any(CardController));
    });

    describe('properties', function() {
        describe('isRendered', function() {
            it('should be initialized to false', function() {
                expect(InstagramCardCtrl.isRendered).toBe(false);
            });
        });
    });

    describe('events', function() {
        describe('model', function() {
            beforeEach(function() {
                spyOn(InstagramCardCtrl, 'renderImage');
            });

            describe('prepare', function() {
                it('should call renderImage if not already rendered', function() {
                    card.prepare();
                    expect(InstagramCardCtrl.renderImage).toHaveBeenCalled();
                });

                it('should not call renderImage if already rendered', function() {
                    InstagramCardCtrl.isRendered = true;
                    card.prepare();
                    expect(InstagramCardCtrl.renderImage).not.toHaveBeenCalled();
                });
            });

            describe('activate', function() {
                it('should call renderImage if not already rendered', function() {
                    card.activate();
                    expect(InstagramCardCtrl.renderImage).toHaveBeenCalled();
                });

                it('should not call renderImage if already rendered', function() {
                    InstagramCardCtrl.isRendered = true;
                    card.prepare();
                    expect(InstagramCardCtrl.renderImage).not.toHaveBeenCalled();
                });
            });
        });
    });

    describe('methods', function() {

        beforeEach(function() {
            spyOn(Date, 'now').and.returnValue(new Date(2015, 12, 30, 12, 57, 59));
        });

        describe('formatLikes', function() {
            it('should format the number as an appropriate string', function() {
                const input =          [ 0,   1,   999,   1000, 77669,   999999,   1000000, 8924371, 999999999, 1000000000, 999999999999, 1000000000000];
                const expectedOutput = ['0', '1', '999', '1k', '77.7k', '1m',     '1m',    '8.9m',  '1b',      '1b',       '>1t',        '>1t'];
                const output = input.map(likes => {
                    return InstagramCardCtrl.formatLikes(likes);
                });
                expect(output).toEqual(expectedOutput);
            });
        });

        describe('formatDate', function() {
            it('should format the date as an appropriate string', function() {
                const input = [
                    new Date(2015, 12, 30, 12, 57, 59),
                    new Date(2010, 12, 30, 12, 57, 59),
                    new Date(2015, 6, 30, 12, 57, 59),
                    new Date(2015, 12, 16, 12, 57, 59),
                    new Date(2015, 12, 24, 12, 57, 59),
                    new Date(2015, 12, 30, 5, 57, 59),
                    new Date(2015, 12, 30, 12, 17, 59),
                    new Date(2015, 12, 30, 12, 57, 57),
                    new Date(2015, 12, 29, 13, 57, 59),
                    new Date(2015, 12, 30, 12, 57, 58)
                ];
                const expectedOutput = [
                    'just now',
                    '5 years',
                    '6 months',
                    '2 weeks',
                    '6 days',
                    '7 hours',
                    '40 minutes',
                    '2 seconds',
                    '23 hours',
                    '1 second'
                ];
                const output = input.map(date => {
                    return InstagramCardCtrl.formatDate(date);
                });
                expect(output).toEqual(expectedOutput);
            });
        });

        describe('formatComments', function() {
            it('should format the comments as an appropriate string', function() {
                const input = [0, 1, 999, 1000, 900000, 1000000];
                const expectedOutput = ['0', '1', '999', '1,000', '900,000', '1,000,000'];
                const output = input.map(comments => {
                    return InstagramCardCtrl.formatComments(comments);
                });
                expect(output).toEqual(expectedOutput);
            });
        });

        describe('renderImage', function() {

            beforeEach(function() {
                spyOn(InstagramCardCtrl.view, 'update');
                InstagramCardCtrl.renderImage();
            });

            it('should set the isRendered property to true', function() {
                expect(InstagramCardCtrl.isRendered).toBe(true);
            });

            it('should update the source on the template', function() {
                var expectedOutput = {
                    userHref: 'https://instagram.com/thedogist',
                    userFollow: 'https://instagram.com/accounts/login/?next=%2Fp%2F5YN6a0tOc-%2F&source=follow',
                    userPicture: 'https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xfa1/t51.2885-19/s150x150/11382947_1023728481019302_1629502413_a.jpg',
                    userUsername: 'thedogist',
                    userFullname: 'The Dogist',
                    userBio: 'A photo-documentary series about the beauty of dogs. Author of THE DOGIST, coming October, 2015.',
                    userWebsite: 'http://thedogist.com/book',
                    userPosts: 2886,
                    userFollowers: 1030957,
                    userFollowing: 3,
                    mediaSrc: 'https://scontent.cdninstagram.com/hphotos-xfa1/t51.2885-15/s640x640/e35/sh0.08/11351507_836701216398426_1156749946_n.jpg',
                    href: 'https://instagram.com/p/5YN6a0tOc-/',
                    likes: '77.7k',
                    date: '4 weeks',
                    caption: 'Solomon, Pembroke Welsh Corgi (12 w/o), BarkFest 2015, Brooklyn, NY',
                    comments: '9,734'
                };
                expect(InstagramCardCtrl.view.update).toHaveBeenCalledWith(expectedOutput);
            });
        });
    });

});
