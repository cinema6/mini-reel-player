import MobileVideoCardController from '../../../../src/controllers/mobile/MobileVideoCardController.js';
import VideoCardController from '../../../../src/controllers/VideoCardController.js';
import MobileVideoCardView from '../../../../src/views/mobile/MobileVideoCardView.js';
import {EventEmitter} from 'events';
import View from '../../../../lib/core/View.js';
import VideoCard from '../../../../src/models/VideoCard.js';
import playerFactory from '../../../../src/services/player_factory.js';
import Runner from '../../../../lib/Runner.js';
import DisplayAd from '../../../../src/models/DisplayAd.js';
import DisplayAdController from '../../../../src/controllers/DisplayAdController.js';
import InlineBallotResultsVideoCardController from '../../../../src/mixins/InlineBallotResultsVideoCardController.js';

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

        MobileVideoCardCtrl = new MobileVideoCardController(card, parentView);
    });

    it('should be a VideoCardController', function() {
        expect(MobileVideoCardCtrl).toEqual(jasmine.any(VideoCardController));
    });

    it('should mixin the InlineBallotResultsVideoCardController', function() {
        expect(MobileVideoCardController.mixins).toContain(InlineBallotResultsVideoCardController);
        expect(MobileVideoCardCtrl.initBallotResults).toHaveBeenCalled();
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a VideoCardView', function() {
                expect(MobileVideoCardCtrl.view).toEqual(jasmine.any(MobileVideoCardView));
                expect(MobileVideoCardCtrl.addView).toHaveBeenCalledWith(MobileVideoCardCtrl.view);
            });
        });

        describe('DisplayAdCtrl', function() {
            it('should not exist', function() {
                expect('DisplayAdCtrl' in MobileVideoCardCtrl).toBe(false);
            });

            describe('if there is a displayAd', function() {
                beforeEach(function() {
                    card.modules.displayAd = {};
                });

                describe('if the placement is the default', function() {
                    beforeEach(function() {
                        card.modules.displayAd.isDefault = true;

                        MobileVideoCardCtrl = new MobileVideoCardController(card);
                    });

                    it('should not exist', function() {
                        expect('DisplayAdCtrl' in MobileVideoCardCtrl).toBe(false);
                    });
                });

                describe('if the placement is not the default', function() {
                    beforeEach(function() {
                        card.modules.displayAd.isDefault = false;

                        MobileVideoCardCtrl = new MobileVideoCardController(card);
                    });

                    it('should be a DisplayAdController', function() {
                        expect(MobileVideoCardCtrl.DisplayAdCtrl).toEqual(jasmine.any(DisplayAdController));
                    });
                });
            });
        });
    });

    describe('events:', function() {
        describe('DisplayAdCtrl', function() {
            beforeEach(function() {
                card.modules.displayAd = { isDefault: false };
                MobileVideoCardCtrl = new MobileVideoCardController(card, parentView);
            });

            describe('activate', function() {
                beforeEach(function() {
                    Runner.run(() => MobileVideoCardCtrl.view.create());
                    spyOn(MobileVideoCardCtrl.view.playerOutlet, 'hide');
                    spyOn(MobileVideoCardCtrl.view.replayContainer, 'show');

                    MobileVideoCardCtrl.DisplayAdCtrl.emit('activate');
                });

                it('should hide the playerOutlet', function() {
                    expect(MobileVideoCardCtrl.view.playerOutlet.hide).toHaveBeenCalled();
                });

                it('should show the replayContainer', function() {
                    expect(MobileVideoCardCtrl.view.replayContainer.show).toHaveBeenCalled();
                });
            });

            describe('deactivate', function() {
                beforeEach(function() {
                    Runner.run(() => MobileVideoCardCtrl.view.create());
                    spyOn(MobileVideoCardCtrl.view.playerOutlet, 'show');
                    spyOn(MobileVideoCardCtrl.view.replayContainer, 'hide');

                    MobileVideoCardCtrl.DisplayAdCtrl.emit('deactivate');
                });

                it('should show the playerOutlet', function() {
                    expect(MobileVideoCardCtrl.view.playerOutlet.show).toHaveBeenCalled();
                });

                it('should hide the replayContainer', function() {
                    expect(MobileVideoCardCtrl.view.replayContainer.hide).toHaveBeenCalled();
                });
            });
        });

        describe('player', function() {
            describe('play', function() {
                beforeEach(function() {
                    Runner.run(() => player.emit('play'));
                });

                it('should do nothing', function() {});

                describe('if there is a DisplayAdCtrl', function() {
                    beforeEach(function() {
                        card.modules.displayAd = { isDefault: false };
                        MobileVideoCardCtrl = new MobileVideoCardController(card, parentView);
                        spyOn(MobileVideoCardCtrl.DisplayAdCtrl, 'deactivate');

                        Runner.run(() => player.emit('play'));
                    });

                    it('should deactivate the DisplayAdCtrl', function() {
                        expect(MobileVideoCardCtrl.DisplayAdCtrl.deactivate).toHaveBeenCalled();
                    });
                });
            });

            describe('ended', function() {
                describe('if the displayAd module is present', function() {
                    beforeEach(function() {
                        card.modules.displayAd = { isDefault: false };

                        MobileVideoCardCtrl = new MobileVideoCardController(card, parentView);
                        spyOn(MobileVideoCardCtrl.DisplayAdCtrl, 'activate');

                        Runner.run(() => player.emit('ended'));
                    });

                    it('should activate the DisplayAdCtrl', function() {
                        expect(MobileVideoCardCtrl.DisplayAdCtrl.activate).toHaveBeenCalled();
                    });
                });
            });
        });
    });

    describe('methods:', function() {
        describe('replay()', function() {
            beforeEach(function() {
                spyOn(VideoCardController.prototype, 'replay');

                MobileVideoCardCtrl.replay();
            });

            it('should call super()', function() {
                expect(VideoCardController.prototype.replay).toHaveBeenCalled();
            });

            describe('if there is a DisplayAdCtrl', function() {
                beforeEach(function() {
                    card.modules.displayAd = { isDefault: false };
                    MobileVideoCardCtrl = new MobileVideoCardController(card, parentView);
                    spyOn(MobileVideoCardCtrl.DisplayAdCtrl, 'deactivate');

                    MobileVideoCardCtrl.replay();
                });

                it('should deactivate the DisplayAdCtrl', function() {
                    expect(MobileVideoCardCtrl.DisplayAdCtrl.deactivate).toHaveBeenCalled();
                });

                it('should call super()', function() {
                    expect(VideoCardController.prototype.replay).toHaveBeenCalled();
                });
            });
        });

        describe('canAutoadvance()', function() {
            beforeEach(function() {
                spyOn(VideoCardController.prototype, 'canAutoadvance').and.returnValue(true);
            });

            describe('if there is no displayAd module', function() {
                beforeEach(function() {
                    delete MobileVideoCardCtrl.DisplayAdCtrl;
                    delete card.modules.displayAd;

                    MobileVideoCardCtrl = new MobileVideoCardController(card, parentView);
                });

                it('should be true', function() {
                    expect(MobileVideoCardCtrl.canAutoadvance()).toBe(true);
                });

                describe('if the parent implementation returns false', function() {
                    beforeEach(function() {
                        VideoCardController.prototype.canAutoadvance.and.returnValue(false);
                    });

                    it('should be false', function() {
                        expect(MobileVideoCardCtrl.canAutoadvance()).toBe(false);
                    });
                });
            });

            describe('if there is a displayAd module', function() {
                beforeEach(function() {
                    MobileVideoCardCtrl.DisplayAdCtrl = new EventEmitter();
                    card.modules.displayAd = new DisplayAd(card, experience);

                    MobileVideoCardCtrl = new MobileVideoCardController(card, parentView);
                });

                describe('if the displayAd is the default placement', function() {
                    beforeEach(function() {
                        card.modules.displayAd.isDefault = true;
                    });

                    it('should return true', function() {
                        expect(MobileVideoCardCtrl.canAutoadvance()).toBe(true);
                    });
                });

                describe('if the displayAd is not the default placement', function() {
                    beforeEach(function() {
                        card.modules.displayAd.isDefault = false;
                    });

                    it('should be false', function() {
                        expect(MobileVideoCardCtrl.canAutoadvance()).toBe(false);
                    });
                });
            });
        });

        describe('render()', function() {
            beforeEach(function() {
                spyOn(VideoCardController.prototype, 'render');
            });

            describe('if there is no displayAd', function() {
                beforeEach(function() {
                    MobileVideoCardCtrl.render();
                });

                it('should call super()', function() {
                    expect(VideoCardController.prototype.render).toHaveBeenCalled();
                });
            });

            describe('if there is no displayAd', function() {
                beforeEach(function() {
                    card.modules.displayAd = { isDefault: false };
                    MobileVideoCardCtrl = new MobileVideoCardController(card, parentView);
                    Runner.run(() => MobileVideoCardCtrl.view.create());
                    spyOn(MobileVideoCardCtrl.DisplayAdCtrl, 'renderInto');

                    MobileVideoCardCtrl.render();
                });

                it('should call super()', function() {
                    expect(MobileVideoCardCtrl.DisplayAdCtrl.renderInto).toHaveBeenCalledWith(MobileVideoCardCtrl.view.displayAdOutlet);
                });
            });
        });
    });
});
