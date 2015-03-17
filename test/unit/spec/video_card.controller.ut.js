describe('VideoCardController', function() {
    import VideoCardController from '../../../src/controllers/VideoCardController.js';
    import CardController from '../../../src/controllers/CardController.js';
    import VideoCard from '../../../src/models/VideoCard.js';
    import VideoCardView from '../../../src/views/VideoCardView.js';
    import Runner from '../../../lib/Runner.js';
    import View from '../../../lib/core/View.js';
    import playerFactory from '../../../src/services/player_factory.js';
    import dispatcher from '../../../src/services/dispatcher.js';
    let VideoCardCtrl;
    let card;
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
        });
        player = new MockPlayer();
        spyOn(playerFactory, 'playerForCard').and.returnValue(player);

        spyOn(dispatcher, 'addSource');

        VideoCardCtrl = new VideoCardController(card, parentView);
    });

    it('should be a CardController', function() {
        expect(VideoCardCtrl).toEqual(jasmine.any(CardController));
    });

    it('should add its model as an event source', function() {
        expect(dispatcher.addSource).toHaveBeenCalledWith('card', card, ['activate'], player);
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a VideoCardView', function() {
                expect(VideoCardCtrl.view).toEqual(jasmine.any(VideoCardView));
            });
        });

        describe('model', function() {
            describe('events:', function() {
                beforeEach(function() {
                    VideoCardCtrl.view.create();
                    spyOn(VideoCardCtrl.view, 'update');

                    spyOn(VideoCardCtrl.view.playerOutlet, 'append');
                    Runner.run(() => VideoCardCtrl.render());
                });

                describe('prepare', function() {
                    beforeEach(function() {
                        spyOn(player, 'load');

                        Runner.run(() => card.prepare());
                    });

                    it('should load the player', function() {
                        expect(player.load).toHaveBeenCalled();
                    });
                });

                describe('activate', function() {
                    beforeEach(function() {
                        spyOn(player, 'play');
                        spyOn(player, 'load');

                        Runner.run(() => card.activate());
                    });

                    it('should add the player as an event source', function() {
                        expect(dispatcher.addSource).toHaveBeenCalledWith('video', player, [
                            'play', 'timeupdate', 'pause', 'ended', 'error',
                            'firstQuartile', 'midpoint', 'thirdQuartile', 'complete'
                        ], card);
                    });

                    describe('if autoplay is true', function() {
                        beforeEach(function() {
                            player.play.calls.reset();
                            player.load.calls.reset();
                            card.active = false;
                            card.data.autoplay = true;

                            Runner.run(() => card.activate());
                        });

                        it('should play the player', function() {
                            expect(player.play).toHaveBeenCalled();
                        });
                    });

                    describe('if autoplay is false', function() {
                        beforeEach(function() {
                            player.play.calls.reset();
                            player.load.calls.reset();
                            card.active = false;
                            card.data.autoplay = false;

                            Runner.run(() => card.activate());
                        });

                        it('should not play the player', function() {
                            expect(player.play).not.toHaveBeenCalled();
                        });

                        it('should load the player', function() {
                            expect(player.load).toHaveBeenCalled();
                        });
                    });
                });

                describe('deactivate', function() {
                    beforeEach(function() {
                        card.active = true;

                        spyOn(player, 'pause');
                        spyOn(player, 'unload');
                        spyOn(dispatcher, 'removeSource').and.callThrough();

                        Runner.run(() => card.deactivate());
                    });

                    it('should pause the player', function() {
                        expect(player.pause).toHaveBeenCalled();
                    });

                    it('should unload the player', function() {
                        expect(player.unload).toHaveBeenCalled();
                    });

                    it('should remove the player as an event source', function() {
                        expect(dispatcher.removeSource).toHaveBeenCalledWith(player);
                    });
                });
            });
        });
    });

    describe('methods:', function() {
        describe('render()', function() {
            let result;

            beforeEach(function() {
                VideoCardCtrl.view.create();

                spyOn(CardController.prototype, 'render').and.callThrough();
                spyOn(VideoCardCtrl.view, 'update');
                spyOn(VideoCardCtrl.view.playerOutlet, 'append');
                Runner.run(() => result = VideoCardCtrl.render());
            });

            it('should call super()', function() {
                expect(CardController.prototype.render).toHaveBeenCalled();
            });

            it('should update the view with video data', function() {
                expect(VideoCardCtrl.view.update).toHaveBeenCalledWith({
                    source: card.data.source,
                    href: card.data.href,
                    sponsor: card.sponsor,
                    logo: card.logo,
                    showSource: !card.data.hideSource,
                    links: card.socialLinks,
                    website: card.links.Website,
                    action: jasmine.objectContaining({
                        label: card.action.label,
                        href: card.links.Action
                    })
                });
            });

            describe('if the action is a button', function() {
                beforeEach(function() {
                    VideoCardCtrl.view.update.calls.reset();
                    card.action.type = 'button';
                    Runner.run(() => VideoCardCtrl.render());
                });

                it('should update the view with the action marked as being a button', function() {
                    expect(VideoCardCtrl.view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        action: jasmine.objectContaining({
                            isButton: true,
                            isText: false
                        })
                    }));
                });
            });

            describe('if the action is text', function() {
                beforeEach(function() {
                    VideoCardCtrl.view.update.calls.reset();
                    card.action.type = 'text';
                    Runner.run(() => VideoCardCtrl.render());
                });

                it('should update the view with the action marked as being text', function() {
                    expect(VideoCardCtrl.view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        action: jasmine.objectContaining({
                            isButton: false,
                            isText: true
                        })
                    }));
                });
            });

            it(`should append the player to the playerOutlet`, function() {
                expect(playerFactory.playerForCard).toHaveBeenCalledWith(card);
                expect(VideoCardCtrl.view.playerOutlet.append).toHaveBeenCalledWith(player);
            });

            describe('the player', function() {
                it('should have a poster', function() {
                    expect(player.poster).toBe(card.thumbs.large);
                });

                it('should have a src', function() {
                    expect(player.src).toBe(card.data.videoid);
                });

                it('should set the controls', function() {
                    expect(player.controls).toBe(card.data.controls);
                });

                describe('events', function() {
                    describe('ended', function() {
                        beforeEach(function() {
                            spyOn(player, 'minimize');
                            spyOn(card, 'complete');
                            Runner.run(() => player.emit('ended'));
                        });

                        describe('if the minimize() method returns an error', function() {
                            beforeEach(function() {
                                player.minimize.and.returnValue(new Error());
                                spyOn(player, 'reload');

                                Runner.run(() => player.emit('ended'));
                            });

                            it('should reload the player', function() {
                                expect(player.reload).toHaveBeenCalled();
                            });
                        });

                        it('should minimize the player', function() {
                            expect(player.minimize).toHaveBeenCalled();
                        });

                        it('should call complete() on the card', function() {
                            expect(card.complete).toHaveBeenCalled();
                        });
                    });
                });
            });
        });
    });
});
