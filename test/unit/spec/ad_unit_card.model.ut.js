import AdUnitCard from '../../../src/models/AdUnitCard.js';
import VideoCard from '../../../src/models/VideoCard.js';
import environment from '../../../src/environment.js';

describe('AdUnitCard', function() {
    let card;
    let data;
    let experience;
    let profile;

    beforeEach(function() {
        environment.constructor();

        experience = {
            data: {}
        };

        profile = {};

        data = {
            /* jshint quotmark:double */
            "data": {
              "hideSource": true,
              "autoplay": true,
              "controls": false,
              "autoadvance": false,
              "skip": 40,
              "vast": "//ad.doubleclick.net/pfadx/N6543.1919213CINEMA6INC/B8370514.113697085;sz=0x0;ord=[timestamp];dcmt=text/xml",
              "vpaid": "//ad.doubleclick.net/pfadx/N6543.1919213CINEMA6VPAIDINC/B8370514.113697085;sz=0x0;ord=[timestamp];dcmt=text/xml"
            },
            "id": "rc-c175fedab87e6f",
            "type": "adUnit",
            "title": "WATCH & LEARN",
            "note": "See how to make classic, seasonal and specialty cocktails from our expert bartenders. You’re just a shake, stir and pour away from the ultimate drink.",
            "modules": [
              "displayAd",
              "post"
            ],
            "thumbs": {
              "small": "https://yt3.ggpht.com/-EFAfQiEuYSI/AAAAAAAAAAI/AAAAAAAAAAA/AsAgcOBSoTw/s100-c-k-no/photo.jpg",
              "large": "https://yt3.ggpht.com/-EFAfQiEuYSI/AAAAAAAAAAI/AAAAAAAAAAA/AsAgcOBSoTw/s100-c-k-no/photo.jpg"
            },
            "placementId": "3245275",
            "templateUrl": null,
            "sponsored": true,
            "campaign": {
              "campaignId": "",
              "advertiserId": "DIAGEO USA",
              "minViewTime": -1
            },
            "collateral": {
              "logo": "http://i.imgur.com/YbBIFZv.png"
            },
            "links": {},
            "params": {
              "action": null,
              "sponsor": "thebar.com",
              "ad": true
            }
            /* jshint quotmark:single */
        };

        card = new AdUnitCard(data, experience, profile);
    });

    afterAll(function() {
        environment.constructor();
    });

    it('should be a VideoCard', function() {
        expect(card).toEqual(jasmine.any(VideoCard));
    });

    describe('properties:', function() {
        describe('data', function() {
            describe('.type', function() {
                describe('if the profile supports flash', function() {
                    beforeEach(function() {
                        profile.flash = true;
                        card = new AdUnitCard(data, experience, profile);
                    });

                    it('should be "vpaid"', function() {
                        expect(card.data.type).toBe('vpaid');
                    });

                    describe('if there is no vpaid tag', function() {
                        beforeEach(function() {
                            delete data.data.vpaid;
                            card = new AdUnitCard(data, experience, profile);
                        });

                        it('should be "vast"', function() {
                            expect(card.data.type).toBe('vast');
                        });
                    });
                });

                describe('if the profile does not support flash', function() {
                    beforeEach(function() {
                        profile.flash = false;
                        card = new AdUnitCard(data, experience, profile);
                    });

                    it('should be "vast"', function() {
                        expect(card.data.type).toBe('vast');
                    });
                });
            });

            describe('.videoid', function() {
                describe('if the profile supports flash', function() {
                    beforeEach(function() {
                        profile.flash = true;
                        card = new AdUnitCard(data, experience, profile);
                    });

                    it('should be the VPAID tag', function() {
                        expect(card.data.videoid).toBe(data.data.vpaid);
                    });

                    describe('if there is no vpaid tag', function() {
                        beforeEach(function() {
                            delete data.data.vpaid;
                            card = new AdUnitCard(data, experience, profile);
                        });

                        it('should be the VAST tag', function() {
                            expect(card.data.videoid).toBe(data.data.vast);
                        });
                    });
                });

                describe('if the profile does not support flash', function() {
                    beforeEach(function() {
                        profile.flash = false;
                        card = new AdUnitCard(data, experience, profile);
                    });

                    it('should be the VAST', function() {
                        expect(card.data.videoid).toBe(data.data.vast);
                    });
                });
            });
        });
    });

    describe('methods:', function() {
        describe('getSrc()', function() {
            beforeEach(function() {
                jasmine.clock().install();
                jasmine.clock().mockDate();
                environment.debug = false;

                card.data.videoid = '//ad.doubleclick.net/pfadx/N6543.1919213CINEMA6INC/B8370514.113697085;sz=0x0;ord={cachebreaker};dcmt=text/xml;url={pageUrl};id={guid};cb={cachebreaker}';
            });

            afterEach(function() {
                jasmine.clock().uninstall();
            });

            it('should be the videoid with the dynamic segments replaced', function() {
                expect(card.getSrc()).toBe(
                    `//ad.doubleclick.net/pfadx/N6543.1919213CINEMA6INC/B8370514.113697085;sz=0x0` +
                    `;ord=${encodeURIComponent(Date.now())};dcmt=text/xml;url` +
                    `=${encodeURIComponent(environment.href)};id` +
                    `=${encodeURIComponent(environment.guid)};cb=${encodeURIComponent(Date.now())}`
                );
            });

            describe('if in debug mode', function() {
                beforeEach(function() {
                    environment.debug = true;
                    card.data.videoid = '{pageUrl}';
                });

                it('should set the pageUrl to "mutantplayground.com"', function() {
                    expect(card.getSrc()).toBe(encodeURIComponent('mutantplayground.com'));
                });
            });
        });
    });
});
