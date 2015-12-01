import InstagramVideoCardController from '../../../src/controllers/InstagramVideoCardController.js';
import InstagramCardController from '../../../src/controllers/InstagramCardController.js';
import FullNPInstagramVideoCardView from '../../../src/views/full-np/FullNPInstagramVideoCardView.js';
import InstagramVideoCard from '../../../src/models/InstagramVideoCard.js';
import View from '../../../lib/core/View.js';
import HtmlVideoPlayer from '../../../src/players/HtmlVideoPlayer.js';

describe('InstagramVideoCardController', function() {
    let InstagramVideoCardCtrl;
    let card;

    beforeEach(function() {
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
                "autoplay": true,
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
            "params": {}
            /* jshint quotmark:single */
        }, {
            data: {
                collateral: {}
            }
        });

        InstagramVideoCardCtrl = new InstagramVideoCardController(card);
        InstagramVideoCardCtrl.model = card;
        InstagramVideoCardCtrl.view = new FullNPInstagramVideoCardView();
    });

    it('should exist', function() {
        expect(InstagramVideoCardCtrl).toEqual(jasmine.any(InstagramCardController));
    });

    describe('properties', function () {
        describe('private', function() {
            describe('player', function() {

                it('should be an HtmlVideoPlayer', function() {
                    expect(InstagramVideoCardCtrl.__private__.player).toEqual(jasmine.any(HtmlVideoPlayer));
                });

                it('should set the src and loop properties', function() {
                    expect(InstagramVideoCardCtrl.__private__.player.src).toBe('https://scontent.cdninstagram.com/hphotos-xfa1/t50.2886-16/11765072_1641853446058461_1518004451_n.mp4');
                    expect(InstagramVideoCardCtrl.__private__.player.loop).toBe(true);
                });
            });
        });
    });

    describe('events', function() {
        describe('prepare', function() {

            beforeEach(function() {
                spyOn(InstagramCardController.prototype, 'prepare');
                spyOn(InstagramVideoCardCtrl.__private__.player, 'load');
            });

            it('should call super', function()  {
                InstagramVideoCardCtrl.prepare();
                expect(InstagramCardController.prototype.prepare).toHaveBeenCalled();
            });

            it('should call load on the player if preload', function() {
                InstagramVideoCardCtrl.model.data.preload = true;
                InstagramVideoCardCtrl.prepare();
                expect(InstagramVideoCardCtrl.__private__.player.load).toHaveBeenCalled();
            });

            it('should not call load on the player if not preload', function() {
                InstagramVideoCardCtrl.model.data.preload = false;
                InstagramVideoCardCtrl.prepare();
                expect(InstagramVideoCardCtrl.__private__.player.load).not.toHaveBeenCalled();
            });
        });

        describe('activate', function() {

            beforeEach(function() {
                spyOn(InstagramCardController.prototype, 'activate');
                spyOn(InstagramVideoCardCtrl.__private__.player, 'play');
                spyOn(InstagramVideoCardCtrl.__private__.player, 'load');
            });

            it('should call super', function() {
                InstagramVideoCardCtrl.activate();
                expect(InstagramCardController.prototype.activate).toHaveBeenCalled();
            });

            it('should call play on the player if autoplay', function() {
                InstagramVideoCardCtrl.model.data.autoplay = true;
                InstagramVideoCardCtrl.activate();
                expect(InstagramVideoCardCtrl.__private__.player.play).toHaveBeenCalled();
                expect(InstagramVideoCardCtrl.__private__.player.load).not.toHaveBeenCalled();
            });

            it('should call load on the player if not autoplay', function() {
                InstagramVideoCardCtrl.model.data.autoplay = false;
                InstagramVideoCardCtrl.activate();
                expect(InstagramVideoCardCtrl.__private__.player.load).toHaveBeenCalled();
                expect(InstagramVideoCardCtrl.__private__.player.play).not.toHaveBeenCalled();
            });
        });

        describe('deactivate', function() {
            beforeEach(function() {
                spyOn(InstagramCardController.prototype, 'deactivate');
                spyOn(InstagramVideoCardCtrl.__private__.player, 'pause');
            });

            it('should call super', function() {
                InstagramVideoCardCtrl.deactivate();
                expect(InstagramCardController.prototype.deactivate).toHaveBeenCalled();
            });

            it('should call pause on the player', function() {
                InstagramVideoCardCtrl.deactivate();
                expect(InstagramVideoCardCtrl.__private__.player.pause).toHaveBeenCalled();
            });
        });

        describe('render', function() {

            beforeEach(function() {
                InstagramVideoCardCtrl.view.playerOutlet = new View();
                spyOn(InstagramCardController.prototype, 'render');
                spyOn(InstagramVideoCardCtrl.view.playerOutlet, 'append');
            });

            it('should call super', function() {
                InstagramVideoCardCtrl.render();
                expect(InstagramCardController.prototype.render).toHaveBeenCalled();
            });

            it('should append the player to its outlet', function() {
                InstagramVideoCardCtrl.render();
                expect(InstagramVideoCardCtrl.view.playerOutlet.append).toHaveBeenCalledWith(InstagramVideoCardCtrl.__private__.player);
            });
        });
    });
});
