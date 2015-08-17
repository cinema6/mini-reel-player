import MobileInstagramVideoCardController from '../../../../src/controllers/mobile/MobileInstagramVideoCardController.js';
import InstagramCardController from '../../../../src/controllers/InstagramCardController.js';
import View from '../../../../lib/core/View.js';
import MobileInstagramCardView from '../../../../src/views/mobile/MobileInstagramCardView.js';
import InstagramImageCard from '../../../../src/models/InstagramImageCard.js';
import Runner from '../../../../lib/Runner.js';
import InstagramEmbedView from '../../../../src/views/image_embeds/InstagramEmbedView.js';

describe('MobileInstagramVideoCardController', function() {
    let MobileInstagramVideoCardCtrl;
    let card;
    let experience;
    let parentView;

    function render() {
        Runner.run(() => {
            MobileInstagramVideoCardCtrl.renderInstagram();
        });
    }

    beforeEach(function() {
        experience = {
            data: {}
        };

        card = new InstagramImageCard({
            /* jshint quotmark:double */
            "data": {
                "id": "6DD1crjvG7",
                "thumbs": {
                    "small": "https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/s150x150/e15/11821147_104753706542520_2033718459_n.jpg",
                    "large": "https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/s320x320/e15/11821147_104753706542520_2033718459_n.jpg"
                },
                "type": "video",
                "src": "https://scontent.cdninstagram.com/hphotos-xaf1/t50.2886-16/11847040_533864646760736_1934852926_n.mp4"
            },
            "id": "rc-0cd5e929c16ada",
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
            "href": "https://instagram.com/p/6DD1crjvG7/",
            "likes": 1185622,
            "date": "1438876747",
            "caption": "Coming Home to Mixed Reactions - a short film",
            "comments": 45258,
            "user": {
                "fullname": "Taylor Swift",
                "picture": "https://igcdn-photos-f-a.akamaihd.net/hphotos-ak-xpa1/t51.2885-19/10617008_540121486120445_1609281390_a.jpg",
                "username": "taylorswift",
                "follow": "https://instagram.com/accounts/login/?next=%2Fp%2F6DD1crjvG7%2F&source=follow",
                "href": "https://instagram.com/taylorswift",
                "bio": "Born in 1989.",
                "website": "http://www.mtv.com/ontv/vma/2015/video-of-the-year/",
                "posts": 645,
                "followers": 41603278,
                "following": 71
            }
            /* jshint quotmark:single */
        }, experience);

        parentView = new View();
        spyOn(MobileInstagramVideoCardController.prototype, 'addView').and.callThrough();

        MobileInstagramVideoCardCtrl = new MobileInstagramVideoCardController(card, parentView);
    });

    it('should exist', function() {
        expect(MobileInstagramVideoCardCtrl).toEqual(jasmine.any(InstagramCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a MobileInstagramCardView', function() {
                expect(MobileInstagramVideoCardCtrl.view).toEqual(jasmine.any(MobileInstagramCardView));
                expect(MobileInstagramVideoCardCtrl.addView).toHaveBeenCalledWith(MobileInstagramVideoCardCtrl.view);
            });
        });
    });

    describe('methods', function() {
        describe('renderInstagram', function() {
            beforeEach(function() {
                MobileInstagramVideoCardCtrl.view.embedOutlet = new View();
                spyOn(MobileInstagramVideoCardCtrl.view, 'create').and.callThrough();
                spyOn(MobileInstagramVideoCardCtrl.view.embedOutlet, 'append');
            });

            it('should set isRendered to true', function() {
                render();
                expect(MobileInstagramVideoCardCtrl.isRendered).toBe(true);
            });

            it('should create the embed outlet if it isn\'t already created', function() {
                MobileInstagramVideoCardCtrl.view.embedOutlet = null;
                render();
                expect(MobileInstagramVideoCardCtrl.view.create).toHaveBeenCalled();
            });

            it('should not create the embed outlet if it is already created', function() {
                const embedOutlet = new View();
                embedOutlet.tag = 'div';
                MobileInstagramVideoCardCtrl.view.embedOutlet = embedOutlet;
                render();
                expect(MobileInstagramVideoCardCtrl.view.create).not.toHaveBeenCalled();
            });

            it('should append the embed view with the correct data', function() {
                render();
                expect(MobileInstagramVideoCardCtrl.view.embedOutlet.append).toHaveBeenCalledWith(jasmine.any(InstagramEmbedView));
                const embed = MobileInstagramVideoCardCtrl.view.embedOutlet.append.calls.mostRecent().args[0];
                const embedSrc = embed.element.innerHTML;
                expect(embedSrc).toContain('<a href="https://instagram.com/p/6DD1crjvG7/"');
                expect(embedSrc).toContain('Coming Home to Mixed Reactions - a short film');
            });
        });
    });

    describe('events', function() {
        describe('deactivate', function() {
            beforeEach(function() {
                render();
                Runner.run(() => {
                    MobileInstagramVideoCardCtrl.deactivate();
                });
            });

            it('should remove the embed', function() {
                expect(MobileInstagramVideoCardCtrl.view.embedOutlet.element.firstElementChild).toBeNull();
            });
        });
    });
});
