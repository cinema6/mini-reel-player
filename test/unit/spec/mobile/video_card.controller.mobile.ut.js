import MobileVideoCardController from '../../../../src/controllers/mobile/MobileVideoCardController.js';
import VideoCardController from '../../../../src/controllers/VideoCardController.js';
import MobileVideoCardView from '../../../../src/views/mobile/MobileVideoCardView.js';
import {EventEmitter} from 'events';
import View from '../../../../lib/core/View.js';
import VideoCard from '../../../../src/models/VideoCard.js';
import playerFactory from '../../../../src/services/player_factory.js';
import Runner from '../../../../lib/Runner.js';
import moduleService from '../../../../src/services/module.js';
import DisplayAd from '../../../../src/models/DisplayAd.js';

describe('MobileVideoCardController', function() {
    let MobileVideoCardCtrl;
    let card;
    let experience;
    let player;
    let parentView;
    let moduleControllers;

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

        moduleControllers = {};
        spyOn(moduleService, 'getControllers').and.returnValue(moduleControllers);

        spyOn(MobileVideoCardController.prototype, 'addView').and.callThrough();

        MobileVideoCardCtrl = new MobileVideoCardController(card, parentView);
    });

    it('should be a VideoCardController', function() {
        expect(MobileVideoCardCtrl).toEqual(jasmine.any(VideoCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a VideoCardView', function() {
                expect(MobileVideoCardCtrl.view).toEqual(jasmine.any(MobileVideoCardView));
                expect(MobileVideoCardCtrl.addView).toHaveBeenCalledWith(MobileVideoCardCtrl.view);
            });
        });
    });

    describe('events:', function() {
        describe('moduleControllers', function() {
            describe(': displayAd', function() {
                beforeEach(function() {
                    moduleControllers.displayAd = new EventEmitter();
                    MobileVideoCardCtrl = new MobileVideoCardController(card, parentView);
                });

                describe('activate', function() {
                    beforeEach(function() {
                        Runner.run(() => MobileVideoCardCtrl.view.create());
                        spyOn(MobileVideoCardCtrl.view.playerOutlet, 'hide');
                        spyOn(MobileVideoCardCtrl.view.replayContainer, 'show');

                        moduleControllers.displayAd.emit('activate');
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

                        moduleControllers.displayAd.emit('deactivate');
                    });

                    it('should show the playerOutlet', function() {
                        expect(MobileVideoCardCtrl.view.playerOutlet.show).toHaveBeenCalled();
                    });

                    it('should hide the replayContainer', function() {
                        expect(MobileVideoCardCtrl.view.replayContainer.hide).toHaveBeenCalled();
                    });
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
                        moduleControllers.displayAd = new EventEmitter();
                        moduleControllers.displayAd.deactivate = jasmine.createSpy('DisplayAdCtrl.deactivate()');

                        MobileVideoCardCtrl = new MobileVideoCardController(card, parentView);
                        Runner.run(() => player.emit('play'));
                    });

                    it('should deactivate the DisplayAdCtrl', function() {
                        expect(moduleControllers.displayAd.deactivate).toHaveBeenCalled();
                    });
                });
            });

            describe('ended', function() {
                beforeEach(function() {
                    spyOn(player, 'minimize');
                    spyOn(card, 'complete');
                });

                describe('if the displayAd module is present', function() {
                    let displayAd;
                    let DisplayAdCtrl;

                    beforeEach(function() {
                        player.removeAllListeners();
                        displayAd = new DisplayAd(card, experience);

                        DisplayAdCtrl = new EventEmitter();
                        DisplayAdCtrl.activate = jasmine.createSpy('DisplayAdController.activate()');

                        moduleControllers.displayAd = DisplayAdCtrl;
                        card.modules.displayAd = displayAd;

                        MobileVideoCardCtrl = new MobileVideoCardController(card, parentView);
                    });

                    describe('if the displayAd is the default placement', function() {
                        beforeEach(function() {
                            displayAd.isDefault = true;
                            Runner.run(() => player.emit('ended'));
                        });

                        it('should not activate the DisplayAdCtrl', function() {
                            expect(DisplayAdCtrl.activate).not.toHaveBeenCalled();
                        });
                    });

                    describe('if the displayAd is not the default placement', function() {
                        beforeEach(function() {
                            displayAd.isDefault = false;
                            card.complete.calls.reset();
                            Runner.run(() => player.emit('ended'));
                        });

                        it('should activate the DisplayAdCtrl', function() {
                            expect(DisplayAdCtrl.activate).toHaveBeenCalled();
                        });
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
                    moduleControllers.displayAd = new EventEmitter();
                    moduleControllers.displayAd.deactivate = jasmine.createSpy('DisplayAdCtrl.deactivate()');
                    VideoCardController.prototype.replay.calls.reset();

                    MobileVideoCardCtrl = new MobileVideoCardController(card, parentView);
                    MobileVideoCardCtrl.replay();
                });

                it('should deactivate the DisplayAdCtrl', function() {
                    expect(moduleControllers.displayAd.deactivate).toHaveBeenCalled();
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
                    delete moduleControllers.displayAd;
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
                    moduleControllers.displayAd = new EventEmitter();
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
    });
});
