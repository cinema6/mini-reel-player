import MobileInstagramCardController from '../../../../src/controllers/mobile/MobileInstagramCardController.js';
import InstagramCardController from '../../../../src/controllers/InstagramCardController.js';
import View from '../../../../lib/core/View.js';
import MobileInstagramCardView from '../../../../src/views/mobile/MobileInstagramCardView.js';
import InstagramImageCard from '../../../../src/models/InstagramImageCard.js';
import Runner from '../../../../lib/Runner.js';
import InstagramEmbedView from '../../../../src/views/image_embeds/InstagramEmbedView.js';

describe('MobileInstagramCardController', function() {
    let MobileInstagramCardCtrl;
    let card;
    let experience;
    let parentView;

    beforeEach(function() {
        experience = {
            data: {}
        };

        card = new InstagramImageCard({
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
            "likes": 78102,
            "date": "1437439190",
            "caption": "Solomon, Pembroke Welsh Corgi (12 w/o), BarkFest 2015, Brooklyn, NY @taylorswift",
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
            }
            /* jshint quotmark:single */
        }, experience);

        parentView = new View();
        spyOn(MobileInstagramCardController.prototype, 'addView').and.callThrough();

        MobileInstagramCardCtrl = new MobileInstagramCardController(card, parentView);
    });

    it('should exist', function() {
        expect(MobileInstagramCardCtrl).toEqual(jasmine.any(InstagramCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a MobileInstagramCardView', function() {
                expect(MobileInstagramCardCtrl.view).toEqual(jasmine.any(MobileInstagramCardView));
                expect(MobileInstagramCardCtrl.addView).toHaveBeenCalledWith(MobileInstagramCardCtrl.view);
            });
        });
    });

    describe('methods', function() {
        describe('renderInstagram', function() {
            function render() {
                Runner.run(() => {
                    MobileInstagramCardCtrl.renderInstagram();
                });
            }

            beforeEach(function() {
                MobileInstagramCardCtrl.view.embedOutlet = new View();
                spyOn(MobileInstagramCardCtrl.view, 'create').and.callThrough();
                spyOn(MobileInstagramCardCtrl.view.embedOutlet, 'append');
            });

            it('should set isRendered to true', function() {
                render();
                expect(MobileInstagramCardCtrl.isRendered).toBe(true);
            });

            it('should create the embed outlet if it isn\'t already created', function() {
                MobileInstagramCardCtrl.view.embedOutlet = null;
                render();
                expect(MobileInstagramCardCtrl.view.create).toHaveBeenCalled();
            });

            it('should not create the embed outlet if it is already created', function() {
                const embedOutlet = new View();
                embedOutlet.tag = 'div';
                MobileInstagramCardCtrl.view.embedOutlet = embedOutlet;
                render();
                expect(MobileInstagramCardCtrl.view.create).not.toHaveBeenCalled();
            });

            it('should append the embed view with the correct data', function() {
                render();
                expect(MobileInstagramCardCtrl.view.embedOutlet.append).toHaveBeenCalledWith(jasmine.any(InstagramEmbedView));
                const embed = MobileInstagramCardCtrl.view.embedOutlet.append.calls.mostRecent().args[0];
                const embedSrc = embed.element.innerHTML;
                expect(embedSrc).toContain('<a href="https://instagram.com/p/5YN6a0tOc-/"');
                expect(embedSrc).toContain('Solomon, Pembroke Welsh Corgi (12 w/o), BarkFest 2015, Brooklyn, NY @taylorswift</a>');
            });
        });
    });
});
