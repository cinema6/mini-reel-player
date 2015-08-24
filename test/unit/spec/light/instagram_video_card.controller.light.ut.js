import LightInstagramVideoCardController from '../../../../src/controllers/light/LightInstagramVideoCardController.js';
import InstagramVideoCardController from '../../../../src/controllers/InstagramVideoCardController.js';
import View from '../../../../lib/core/View.js';
import LightInstagramVideoCardView from '../../../../src/views/light/LightInstagramVideoCardView.js';
import InstagramVideoCard from '../../../../src/models/InstagramVideoCard.js';

describe('LightInstagramVideoCardController', function() {
    let LightInstagramVideoCardCtrl;
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
                "id": "5U4nPnmyDc",
                "thumbs": {
                    "small": "https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/s150x150/e15/11381442_443827579136917_34636061_n.jpg",
                    "large": "https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/s320x320/e15/11381442_443827579136917_34636061_n.jpg"
                },
                "type": "video",
                "src": "https://scontent.cdninstagram.com/hphotos-xfa1/t50.2886-16/11765072_1641853446058461_1518004451_n.mp4",
                "autoplay": true
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
            "href": "https://instagram.com/p/5U4nPnmyDc/",
            "likes": 17243,
            "date": "1437327359",
            "caption": "Handheld Bungee Jump😱 | Via @damienwalters @taylorswift",
            "comments": 1078,
            "user": {
                "fullname": "Videos",
                "picture": "https://igcdn-photos-c-a.akamaihd.net/hphotos-ak-xfp1/t51.2885-19/10956552_1556821651232394_1665347195_a.jpg",
                "username": "unbelievable",
                "follow": "https://instagram.com/accounts/login/?next=%2Fp%2F5U4nPnmyDc%2F&source=follow",
                "href": "https://instagram.com/unbelievable",
                "bio": "Most UNBELIEVABLE videos on this planet! Can you believe it? #unbelievable\nmmgfeed@gmail.com K: UAV",
                "website": "http://www.shoprad.co",
                "posts": 406,
                "followers": 522548,
                "following": 9
            }
            /* jshint quotmark:single */
        }, experience);
        parentView = new View();
        spyOn(LightInstagramVideoCardController.prototype, 'addView').and.callThrough();

        LightInstagramVideoCardCtrl = new LightInstagramVideoCardController(card, parentView);
    });

    it('should exist', function() {
        expect(LightInstagramVideoCardCtrl).toEqual(jasmine.any(InstagramVideoCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a LightInstagramVideoCardView', function() {
                expect(LightInstagramVideoCardCtrl.view).toEqual(jasmine.any(LightInstagramVideoCardView));
                expect(LightInstagramVideoCardCtrl.addView).toHaveBeenCalledWith(LightInstagramVideoCardCtrl.view);
            });
        });
    });
});
