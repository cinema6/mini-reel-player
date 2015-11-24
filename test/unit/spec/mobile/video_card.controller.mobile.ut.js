import MobileVideoCardController from '../../../../src/controllers/mobile/MobileVideoCardController.js';
import VideoCardController from '../../../../src/controllers/VideoCardController.js';
import MobileVideoCardView from '../../../../src/views/mobile/MobileVideoCardView.js';
import View from '../../../../lib/core/View.js';
import VideoCard from '../../../../src/models/VideoCard.js';
import playerFactory from '../../../../src/services/player_factory.js';
import InlineBallotResultsVideoCardController from '../../../../src/mixins/InlineBallotResultsVideoCardController.js';
import ModalShareVideoCardController from '../../../../src/mixins/ModalShareVideoCardController.js';

describe('MobileVideoCardController', function() {
    let MobileVideoCardCtrl;
    let card;
    let experience;
    let player;
    let parentView;

    class MockPlayer extends View {
        load() {}
        unload() {}
        play() {}
        pause() {}
        minimize() {}
        reload() {}
    }

    beforeEach(function() {
        parentView = new View();
        parentView.tag = 'div';

        experience = {
            data: {}
        };

        card = new VideoCard({
            /* jshint quotmark:double */
            "data": {
              "hideSource": true,
              "controls": false,
              "autoadvance": false,
              "skip": true,
              "modestbranding": 0,
              "rel": 0,
              "videoid": "q3tq4-IXA0M",
              "href": "https://www.youtube.com/watch?v=q3tq4-IXA0M"
            },
            "type": "youtube",
            "title": "Aziz Ansari Live at Madison Square Garden",
            "note": "Stand-up comedian and TV star (\"Parks and Recreation\") Aziz Ansari delivers his sharp-witted take on immigration, relationships and the food industry in his newest Netflix original comedy special, Aziz Ansari: Live At Madison Square Garden.",
            "source": "YouTube",
            "modules": [],
            "thumbs": {
              "small": "http://colorlines.com/assets_c/2011/08/Aziz-Ansari-racism-hollywood-thumb-640xauto-3843.jpg",
              "large": "http://colorlines.com/assets_c/2011/08/Aziz-Ansari-racism-hollywood-thumb-640xauto-3843.jpg"
            },
            "placementId": null,
            "templateUrl": null,
            "sponsored": true,
            "campaign": {
              "campaignId": null,
              "advertiserId": null,
              "minViewTime": -1
            },
            "collateral": {
              "logo": "https://pbs.twimg.com/profile_images/554776783967363072/2lxo5V22_400x400.png"
            },
            "links": {
              "Action": "http://www.netflix.com/WiMovie/80038296?locale=en-US",
              "Website": "http://www.netflix.com",
              "Facebook": "https://www.facebook.com/netflixus",
              "Twitter": "https://twitter.com/netflix",
              "Pinterest": "https://www.pinterest.com/netflix/",
              "YouTube": "https://www.youtube.com/user/NewOnNetflix"
            },
            "params": {
              "sponsor": "Netflix",
              "action": {
                "type": "button",
                "label": "Watch on Netflix"
              },
              "ad": true
            },
            "id": "rc-fc7d04deda983b"
            /* jshint quotmark:single */
        }, experience);
        player = new MockPlayer();
        spyOn(playerFactory, 'playerForCard').and.returnValue(player);

        spyOn(MobileVideoCardController.prototype, 'addView').and.callThrough();
        spyOn(MobileVideoCardController.prototype, 'initBallotResults').and.callThrough();
        spyOn(MobileVideoCardController.prototype, 'initShare').and.callThrough();

        MobileVideoCardCtrl = new MobileVideoCardController(card, parentView);
    });

    it('should be a VideoCardController', function() {
        expect(MobileVideoCardCtrl).toEqual(jasmine.any(VideoCardController));
    });

    it('should mixin the InlineBallotResultsVideoCardController', function() {
        expect(MobileVideoCardController.mixins).toContain(InlineBallotResultsVideoCardController);
        expect(MobileVideoCardCtrl.initBallotResults).toHaveBeenCalled();
    });

    it('should mixin the ModalShareVideoCardController', function() {
        expect(MobileVideoCardController.mixins).toContain(ModalShareVideoCardController);
        expect(MobileVideoCardCtrl.initShare).toHaveBeenCalled();
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a VideoCardView', function() {
                expect(MobileVideoCardCtrl.view).toEqual(jasmine.any(MobileVideoCardView));
                expect(MobileVideoCardCtrl.addView).toHaveBeenCalledWith(MobileVideoCardCtrl.view);
            });
        });
    });
});
