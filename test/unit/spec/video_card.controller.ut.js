import HideableView from '../../../src/views/HideableView.js';
import VideoCardController from '../../../src/controllers/VideoCardController.js';
import CardController from '../../../src/controllers/CardController.js';
import VideoCard from '../../../src/models/VideoCard.js';
import Runner from '../../../lib/Runner.js';
import View from '../../../lib/core/View.js';
import VideoCardView from '../../../src/views/VideoCardView.js';
import playerFactory from '../../../src/services/player_factory.js';
import dispatcher from '../../../src/services/dispatcher.js';
import PostVideoCardController from '../../../src/mixins/PostVideoCardController.js';
import SponsoredCardController from '../../../src/mixins/SponsoredCardController.js';
import environment from '../../../src/environment.js';

describe('VideoCardController', function() {
    let VideoCardCtrl;
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

    beforeAll(function() {
        environment.constructor();
    });

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
              "href": "https://www.youtube.com/watch?v=q3tq4-IXA0M",
              "start": 10,
              "end": 20
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
            "shareLinks": {
                "facebook": "https://www.cinema6.com",
                "twitter": "https://www.cinema6.com",
                "pinterest": "https://www.cinema6.com"
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

        spyOn(dispatcher, 'addSource');

        spyOn(VideoCardController.prototype, 'initPost').and.callThrough();

        VideoCardCtrl = new VideoCardController(card, parentView);
        VideoCardCtrl.view = new VideoCardView();
    });

    afterAll(function() {
        environment.constructor();
    });

    it('should be a CardController', function() {
        expect(VideoCardCtrl).toEqual(jasmine.any(CardController));
    });

    it('should mixin the PostVideoCardController', function() {
        expect(VideoCardController.mixins).toContain(PostVideoCardController);
        expect(VideoCardCtrl.initPost).toHaveBeenCalled();
    });

    it('should mixin the SponsoredCardController', function() {
        expect(VideoCardController.mixins).toContain(SponsoredCardController);
    });

    it('should add its model as an event source', function() {
        expect(dispatcher.addSource).toHaveBeenCalledWith('card', card, ['activate', 'deactivate', 'complete', 'becameUnskippable', 'becameSkippable', 'skippableProgress'], player);
    });

    it('should add the video as a source', function() {
        expect(dispatcher.addSource).toHaveBeenCalledWith('video', player, ['buffering'], card);
    });

    describe('properties:', function() {
        describe('player', function() {
            beforeEach(function() {
                spyOn(card, 'getSrc').and.returnValue(card.data.videoid + 'h39r8fh43');
                VideoCardCtrl = new VideoCardController(card);
            });

            it('should be the video player', function() {
                expect(VideoCardCtrl.player).toBe(player);
            });

            it('should have a poster', function() {
                expect(player.poster).toBe(card.thumbs.large);
            });

            it('should have a src', function() {
                expect(player.src).toBe(card.getSrc());
            });

            it('should set the controls', function() {
                expect(player.controls).toBe(card.data.controls);
            });

            it('should set the start and end times', function() {
                expect(player.start).toBe(card.data.start);
                expect(player.end).toBe(card.data.end);
            });

            it('should set prebuffer', function() {
                expect(player.prebuffer).toBe(false);
            });

            describe('if the prebuffer param is enabled', function() {
                beforeEach(function() {
                    environment.params.prebuffer = true;
                    VideoCardCtrl = new VideoCardController(card);
                });

                it('should enable prebuffer on the video', function() {
                    expect(player.prebuffer).toBe(true);
                });
            });
        });
    });

    describe('events:', function() {
        describe('model', function() {
            beforeEach(function() {
                VideoCardCtrl.view.playerOutlet = new HideableView();
                spyOn(VideoCardCtrl.view, 'update');

                spyOn(VideoCardCtrl.view.playerOutlet, 'append');
                Runner.run(() => VideoCardCtrl.render());
            });

            describe('prepare', function() {
                beforeEach(function() {
                    spyOn(player, 'load');
                });

                describe('if the card can be preloaded', function() {
                    beforeEach(function() {
                        card.data.preload = true;

                        Runner.run(() => card.prepare());
                    });

                    it('should load the player', function() {
                        expect(player.load).toHaveBeenCalled();
                    });
                });

                describe('if the card can\'t be preloaded', function() {
                    beforeEach(function() {
                        card.data.preload = false;

                        Runner.run(() => card.prepare());
                    });

                    it('should not load the player', function() {
                        expect(player.load).not.toHaveBeenCalled();
                    });
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
                        'attemptPlay', 'play', 'timeupdate', 'pause', 'ended', 'error',
                        'firstQuartile', 'midpoint', 'thirdQuartile', 'complete',
                        'loadedmetadata'
                    ], card);
                });

                describe('if player readyState < 1', function(){
                    beforeEach(function(){
                        card.active = false;
                        spyOn(player, 'emit');
                        Runner.run(() => card.activate());
                    });
                    it('should not emit loadedmetadata',function(){
                        expect(player.emit).not.toHaveBeenCalled();
                    });
                });

                describe('if player readyState >= 1', function(){
                    beforeEach(function(){
                        card.active = false;
                        player.readyState = 1;
                        spyOn(player, 'emit');
                        Runner.run(() => card.activate());
                    });
                    it('should not emit loadedmetadata',function(){
                        expect(player.emit).toHaveBeenCalledWith('loadedmetadata');
                    });
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

                it('should remove the player as an event source', function() {
                    expect(dispatcher.removeSource).toHaveBeenCalledWith(player);
                });
            });

            describe('cleanup', function() {
                beforeEach(function() {
                    spyOn(player, 'unload');

                    Runner.run(() => card.cleanup());
                });

                it('should unload() the player', function() {
                    expect(player.unload).toHaveBeenCalled();
                });
            });
        });

        describe('player', function() {
            describe('timeupdate', function() {
                beforeEach(function() {
                    player.currentTime = 0;
                    spyOn(VideoCardCtrl.model, 'setPlaybackState');
                });

                describe('if the video has no duration', function() {
                    beforeEach(function() {
                        player.duration = 0;

                        player.emit('timeupdate');
                    });

                    it('should not set the model\'s playback state', function() {
                        expect(VideoCardCtrl.model.setPlaybackState).not.toHaveBeenCalled();
                    });
                });

                describe('if the video has a duration', function() {
                    beforeEach(function() {
                        player.duration = 30;
                    });

                    it('should set the model\'s playback state', function() {
                        player.emit('timeupdate');
                        expect(VideoCardCtrl.model.setPlaybackState).toHaveBeenCalledWith({
                            currentTime: player.currentTime,
                            duration: player.duration
                        });
                        VideoCardCtrl.model.setPlaybackState.calls.reset();

                        player.currentTime = 3;
                        player.emit('timeupdate');
                        expect(VideoCardCtrl.model.setPlaybackState).toHaveBeenCalledWith({
                            currentTime: player.currentTime,
                            duration: player.duration
                        });
                    });
                });
            });

            describe('ended', function() {
                beforeEach(function() {
                    spyOn(player, 'minimize');
                    spyOn(card, 'complete');
                    spyOn(card, 'setPlaybackState');
                    player.currentTime = 27;
                    player.duration = 30;

                    Runner.run(() => player.emit('ended'));
                });

                it('should call setPlaybackState() with the currentTime equaling the duration', function() {
                    expect(card.setPlaybackState).toHaveBeenCalledWith({
                        currentTime: 30,
                        duration: 30
                    });
                });

                describe('if canAutoadvance() returns true', function() {
                    beforeEach(function() {
                        card.complete.calls.reset();
                        spyOn(VideoCardCtrl, 'canAutoadvance').and.returnValue(true);
                        Runner.run(() => player.emit('ended'));
                    });

                    it('should call complete() on the card', function() {
                        expect(card.complete).toHaveBeenCalled();
                    });
                });

                describe('if canAutoadvance() returns false', function() {
                    beforeEach(function() {
                        card.complete.calls.reset();
                        spyOn(VideoCardCtrl, 'canAutoadvance').and.returnValue(false);
                        Runner.run(() => player.emit('ended'));
                    });

                    it('should not call complete() on the card', function() {
                        expect(card.complete).not.toHaveBeenCalled();
                    });
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
            });
        });
    });

    describe('methods:', function() {
        describe('replay()', function() {
            beforeEach(function() {
                spyOn(player, 'play');

                VideoCardCtrl.replay();
            });

            it('should play the video', function() {
                expect(player.play).toHaveBeenCalled();
            });
        });

        describe('canAutoadvance()', function() {
            it('should return true', function() {
                expect(VideoCardCtrl.canAutoadvance()).toBe(true);
            });
        });

        describe('render()', function() {
            let result;

            beforeEach(function() {
                VideoCardCtrl.view.playerOutlet = new HideableView();

                spyOn(CardController.prototype, 'render').and.callThrough();
                spyOn(VideoCardCtrl.view, 'update');
                spyOn(VideoCardCtrl.view.playerOutlet, 'append');
                spyOn(VideoCardCtrl.view, 'didCreateElement');
                Runner.run(() => result = VideoCardCtrl.render());
            });

            it('should call super()', function() {
                expect(CardController.prototype.render).toHaveBeenCalled();
            });

            it('should update the view with video data', function() {
                expect(VideoCardCtrl.view.update).toHaveBeenCalledWith({
                    source: card.get('data.source'),
                    href: card.get('data.href'),
                    sponsor: card.get('sponsor'),
                    showSource: !card.get('data.hideSource'),
                    links: card.get('socialLinks'),
                    website: {
                        label: 'Website',
                        href: card.get('links.Website.uri'),
                        logo: card.get('logo'),
                        text: card.get('sponsor')
                    },
                    action: jasmine.objectContaining({
                        label: 'Action',
                        text: card.get('action.label'),
                        href: card.get('links.Action.uri')
                    }),
                    canShare: true,
                    videoOnly: jasmine.any(Boolean)
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

            describe('if the card has a title', function() {
                beforeEach(function() {
                    card.title = 'My Card';
                    card.note = '';
                    card.logo = null;
                    card.links = {};
                    card.shareLinks = {};
                    card.action = {};

                    VideoCardCtrl.view.update.calls.reset();
                    Runner.run(() => VideoCardCtrl.render());
                });

                it('should call update() with videoOnly: false', function() {
                    expect(VideoCardCtrl.view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        videoOnly: false
                    }));
                });
            });

            describe('if the card has a note', function() {
                beforeEach(function() {
                    card.title = '';
                    card.note = 'My note.';
                    card.logo = null;
                    card.links = {};
                    card.shareLinks = {};
                    card.action = {};

                    VideoCardCtrl.view.update.calls.reset();
                    Runner.run(() => VideoCardCtrl.render());
                });

                it('should call update() with videoOnly: false', function() {
                    expect(VideoCardCtrl.view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        videoOnly: false
                    }));
                });
            });

            describe('if the card has a logo', function() {
                beforeEach(function() {
                    card.title = '';
                    card.note = '';
                    card.logo = 'my-logo.png';
                    card.links = {};
                    card.shareLinks = {};
                    card.action = {};

                    VideoCardCtrl.view.update.calls.reset();
                    Runner.run(() => VideoCardCtrl.render());
                });

                it('should call update() with videoOnly: false', function() {
                    expect(VideoCardCtrl.view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        videoOnly: false
                    }));
                });
            });

            describe('if the card has links', function() {
                beforeEach(function() {
                    card.title = '';
                    card.note = '';
                    card.logo = null;
                    card.links = {
                        Instagram: {}
                    };
                    card.shareLinks = {};
                    card.action = {};

                    VideoCardCtrl.view.update.calls.reset();
                    Runner.run(() => VideoCardCtrl.render());
                });

                it('should call update() with videoOnly: false', function() {
                    expect(VideoCardCtrl.view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        videoOnly: false
                    }));
                });
            });

            describe('if the card has shareLinks', function() {
                beforeEach(function() {
                    card.title = '';
                    card.note = '';
                    card.logo = null;
                    card.links = {};
                    card.shareLinks = {
                        twitter: 'cinema6.com'
                    };
                    card.action = {};

                    VideoCardCtrl.view.update.calls.reset();
                    Runner.run(() => VideoCardCtrl.render());
                });

                it('should call update() with videoOnly: false', function() {
                    expect(VideoCardCtrl.view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        videoOnly: false
                    }));
                });
            });

            describe('if the card has an action', function() {
                beforeEach(function() {
                    card.title = '';
                    card.note = '';
                    card.logo = null;
                    card.links = {};
                    card.shareLinks = {};
                    card.action = {
                        label: 'Buy me now!'
                    };

                    VideoCardCtrl.view.update.calls.reset();
                    Runner.run(() => VideoCardCtrl.render());
                });

                it('should call update() with videoOnly: false', function() {
                    expect(VideoCardCtrl.view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        videoOnly: false
                    }));
                });
            });

            describe('if the card has no renderable properties', function() {
                beforeEach(function() {
                    card.title = '';
                    card.note = '';
                    card.logo = null;
                    card.links = {};
                    card.shareLinks = {};
                    card.action = {};

                    VideoCardCtrl.view.update.calls.reset();
                    Runner.run(() => VideoCardCtrl.render());
                });

                it('should call update() with videoOnly: true', function() {
                    expect(VideoCardCtrl.view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        videoOnly: true
                    }));
                });
            });

            it(`should append the player to the playerOutlet`, function() {
                expect(playerFactory.playerForCard).toHaveBeenCalledWith(card);
                expect(VideoCardCtrl.view.playerOutlet.append).toHaveBeenCalledWith(player);
            });
        });
    });
});
