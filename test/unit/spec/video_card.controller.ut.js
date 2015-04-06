import {EventEmitter} from 'events';
import HideableView from '../../../src/views/HideableView.js';

describe('VideoCardController', function() {
    import VideoCardController from '../../../src/controllers/VideoCardController.js';
    import CardController from '../../../src/controllers/CardController.js';
    import VideoCard from '../../../src/models/VideoCard.js';
    import Runner from '../../../lib/Runner.js';
    import View from '../../../lib/core/View.js';
    import VideoCardView from '../../../src/views/VideoCardView.js';
    import playerFactory from '../../../src/services/player_factory.js';
    import module from '../../../src/services/module.js';
    import Post from '../../../src/models/Post.js';
    import dispatcher from '../../../src/services/dispatcher.js';
    let VideoCardCtrl;
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
        spyOn(module, 'getControllers').and.returnValue(moduleControllers);

        spyOn(dispatcher, 'addSource');

        VideoCardCtrl = new VideoCardController(card, parentView);
        VideoCardCtrl.view = new VideoCardView();
    });

    it('should be a CardController', function() {
        expect(VideoCardCtrl).toEqual(jasmine.any(CardController));
    });

    it('should add its model as an event source', function() {
        expect(dispatcher.addSource).toHaveBeenCalledWith('card', card,
            ['activate','deactivate'], player);
    });

    describe('properties:', function() {
        describe('player', function() {
            it('should be the video player', function() {
                expect(VideoCardCtrl.player).toBe(player);
            });

            it('should have a poster', function() {
                expect(player.poster).toBe(card.thumbs.large);
            });

            it('should have a src', function() {
                expect(player.src).toBe(card.data.videoid);
            });

            it('should set the controls', function() {
                expect(player.controls).toBe(card.data.controls);
            });

            it('should set the start and end times', function() {
                expect(player.start).toBe(card.data.start);
                expect(player.end).toBe(card.data.end);
            });
        });

        describe('moduleControllers', function() {
            it('should be the result of module.getControllers()', function() {
                expect(module.getControllers).toHaveBeenCalledWith(card.modules);
                expect(module.getControllers.calls.mostRecent().args[0]).toBe(card.modules);
                expect(VideoCardCtrl.moduleControllers).toBe(moduleControllers);
            });
        });
    });

    describe('events:', function() {
        describe('moduleControllers', function() {
            describe(': post', function() {
                beforeEach(function() {
                    moduleControllers.post = new EventEmitter();
                    VideoCardCtrl = new VideoCardController(card, parentView);
                    VideoCardCtrl.view = new VideoCardView();
                    VideoCardCtrl.view.playerOutlet = new HideableView();
                });

                describe('activate', function() {
                    beforeEach(function() {
                        spyOn(VideoCardCtrl.view.playerOutlet, 'hide');

                        moduleControllers.post.emit('activate');
                    });

                    it('should hide the playerOutlet', function() {
                        expect(VideoCardCtrl.view.playerOutlet.hide).toHaveBeenCalled();
                    });
                });

                describe('deactivate', function() {
                    beforeEach(function() {
                        spyOn(VideoCardCtrl.view.playerOutlet, 'show');

                        moduleControllers.post.emit('deactivate');
                    });

                    it('should hide the playerOutlet', function() {
                        expect(VideoCardCtrl.view.playerOutlet.show).toHaveBeenCalled();
                    });
                });

                describe('replay', function() {
                    beforeEach(function() {
                        spyOn(player, 'play');

                        moduleControllers.post.emit('replay');
                    });

                    it('should play the video', function() {
                        expect(player.play).toHaveBeenCalled();
                    });
                });
            });
        });

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

                it('should unload the player', function() {
                    expect(player.unload).toHaveBeenCalled();
                });

                it('should remove the player as an event source', function() {
                    expect(dispatcher.removeSource).toHaveBeenCalledWith(player);
                });

                describe('if the post module is present', function() {
                    let post;
                    let PostCtrl;

                    beforeEach(function() {
                        Runner.run(() => card.activate());
                        player.removeAllListeners();
                        post = new Post(card, experience);

                        PostCtrl = new EventEmitter();
                        PostCtrl.deactivate = jasmine.createSpy('PostCtrl.deactivate()');

                        moduleControllers.post = PostCtrl;
                        card.modules.post = post;

                        VideoCardCtrl = new VideoCardController(card, parentView);
                        VideoCardCtrl.view = new VideoCardView();

                        Runner.run(() => card.deactivate());
                    });

                    it('should deactivate the PostCtrl', function() {
                        expect(PostCtrl.deactivate).toHaveBeenCalled();
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

                describe('if there is a PostCtrl', function() {
                    beforeEach(function() {
                        moduleControllers.post = new EventEmitter();
                        moduleControllers.post.deactivate = jasmine.createSpy('DisplayAdCtrl.deactivate()');

                        VideoCardCtrl = new VideoCardController(card, parentView);
                        VideoCardCtrl.view = new VideoCardView();
                        Runner.run(() => player.emit('play'));
                    });

                    it('should deactivate the PostCtrl', function() {
                        expect(moduleControllers.post.deactivate).toHaveBeenCalled();
                    });
                });
            });

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
                    Runner.run(() => player.emit('ended'));
                });

                describe('if the post module is present', function() {
                    let post;
                    let PostCtrl;

                    beforeEach(function() {
                        card.complete.calls.reset();
                        player.removeAllListeners();
                        post = new Post(card, experience);

                        PostCtrl = new EventEmitter();
                        PostCtrl.activate = jasmine.createSpy('PostCtrl.activate()');

                        moduleControllers.post = PostCtrl;
                        card.modules.post = post;

                        VideoCardCtrl = new VideoCardController(card, parentView);
                        VideoCardCtrl.view = new VideoCardView();

                        Runner.run(() => player.emit('ended'));
                    });

                    it('should activate the PostCtrl', function() {
                        expect(PostCtrl.activate).toHaveBeenCalled();
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
            describe('if there is no post module', function() {
                beforeEach(function() {
                    delete moduleControllers.post;

                    VideoCardCtrl = new VideoCardController(card, parentView);
                });

                it('should be true', function() {
                    expect(VideoCardCtrl.canAutoadvance()).toBe(true);
                });
            });

            describe('if there is a post module', function() {
                beforeEach(function() {
                    moduleControllers.post = new EventEmitter();
                    VideoCardCtrl = new VideoCardController(card, parentView);
                });

                it('should be false', function() {
                    expect(VideoCardCtrl.canAutoadvance()).toBe(false);
                });
            });
        });

        describe('render()', function() {
            let result;

            beforeEach(function() {
                VideoCardCtrl.view.playerOutlet = new HideableView();
                VideoCardCtrl.view.displayAdOutlet = new View();
                VideoCardCtrl.view.postOutlet = new View();
                VideoCardCtrl.view.moduleOutlets = {
                    displayAd: VideoCardCtrl.view.displayAdOutlet,
                    post: VideoCardCtrl.view.postOutlet
                };

                ['displayAd', 'post', 'unsupported'].forEach(type => {
                    moduleControllers[type] = new EventEmitter();
                    moduleControllers[type].renderInto = jasmine.createSpy('ModuleController.renderInto()');
                    moduleControllers[type].deactivate = jasmine.createSpy('ModuleController.deactivate()');
                });

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

            it('should render its ModuleControllers into the proper outlets', function() {
                expect(moduleControllers.displayAd.renderInto).toHaveBeenCalledWith(VideoCardCtrl.view.moduleOutlets.displayAd);
                expect(moduleControllers.post.renderInto).toHaveBeenCalledWith(VideoCardCtrl.view.moduleOutlets.post);
                expect(moduleControllers.unsupported.renderInto).not.toHaveBeenCalledWith(undefined);
            });
        });
    });
});
