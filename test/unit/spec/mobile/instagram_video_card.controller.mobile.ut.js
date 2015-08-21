import MobileInstagramVideoCardController from '../../../../src/controllers/mobile/MobileInstagramVideoCardController.js';
import InstagramVideoCardController from '../../../../src/controllers/InstagramVideoCardController.js';
import View from '../../../../lib/core/View.js';
import MobileInstagramVideoCardView from '../../../../src/views/mobile/MobileInstagramVideoCardView.js';
import InstagramVideoCard from '../../../../src/models/InstagramVideoCard.js';

describe('MobileInstagramVideoCardController', function() {
    let MobileInstagramVideoCardCtrl;
    let card;
    let experience;
    let parentView;

    beforeEach(function() {
        experience = {
            data: {}
        };

        card = new InstagramVideoCard({
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
        expect(MobileInstagramVideoCardCtrl).toEqual(jasmine.any(InstagramVideoCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a MobileInstagramVideoCardView', function() {
                expect(MobileInstagramVideoCardCtrl.view).toEqual(jasmine.any(MobileInstagramVideoCardView));
                expect(MobileInstagramVideoCardCtrl.addView).toHaveBeenCalledWith(MobileInstagramVideoCardCtrl.view);
            });
        });
    });
});
