describe('VideoCardController', function() {
    import VideoCardController from '../../../src/controllers/VideoCardController.js';
    import CardController from '../../../src/controllers/CardController.js';
    import VideoCard from '../../../src/models/VideoCard.js';
    import VideoCardView from '../../../src/views/VideoCardView.js';
    import Runner from '../../../lib/Runner.js';
    import View from '../../../lib/core/View.js';
    import YouTubePlayer from '../../../src/players/YouTubePlayer.js';
    let VideoCardCtrl;
    let card;
    let parentView;

    beforeEach(function() {
        parentView = new View();
        parentView.tag = 'div';

        card = new VideoCard({
            title: 'Hello',
            note: 'Sup?',
            type: 'youtube',
            source: 'YouTube',
            thumbs: {
                small: 'https://i.ytimg.com/vi/B5FcZrg_Nuo/default.jpg',
                large: 'https://i.ytimg.com/vi/B5FcZrg_Nuo/maxresdefault.jpg'
            },
            data: {
                href: 'https://www.youtube.com/watch?v=B5FcZrg_Nuo',
                videoid: 'B5FcZrg_Nuo'
            }
        });

        VideoCardCtrl = new VideoCardController(card, parentView);
    });

    it('should be a CardController', function() {
        expect(VideoCardCtrl).toEqual(jasmine.any(CardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a VideoCardView', function() {
                expect(VideoCardCtrl.view).toEqual(jasmine.any(VideoCardView));
            });
        });

        describe('model', function() {
            describe('events:', function() {
                let player;

                beforeEach(function() {
                    VideoCardCtrl.view.create();

                    spyOn(VideoCardCtrl.view.playerOutlet, 'append');
                    Runner.run(() => VideoCardCtrl.render());
                    player = VideoCardCtrl.view.playerOutlet.append.calls.mostRecent().args[0];
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
                    });

                    describe('if autoplay is true', function() {
                        beforeEach(function() {
                            card.data.autoplay = true;

                            Runner.run(() => card.activate());
                        });

                        it('should play the player', function() {
                            expect(player.play).toHaveBeenCalled();
                        });
                    });

                    describe('if autoplay is false', function() {
                        beforeEach(function() {
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

                        Runner.run(() => card.deactivate());
                    });

                    it('should pause the player', function() {
                        expect(player.pause).toHaveBeenCalled();
                    });

                    it('should unload the player', function() {
                        expect(player.unload).toHaveBeenCalled();
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
                    href: card.data.href
                });
            });

            it('should append a YouTubePlayer to the playerOutlet', function() {
                expect(VideoCardCtrl.view.playerOutlet.append).toHaveBeenCalledWith(jasmine.any(YouTubePlayer));
            });

            describe('the player', function() {
                let player;

                beforeEach(function() {
                    player = VideoCardCtrl.view.playerOutlet.append.calls.mostRecent().args[0];
                });

                it('should have a poster', function() {
                    expect(player.poster).toBe(card.thumbs.large);
                });

                it('should have a src', function() {
                    expect(player.src).toBe(card.data.videoid);
                });

                describe('events', function() {
                    describe('ended', function() {
                        beforeEach(function() {
                            spyOn(player, 'reload');
                            player.emit('ended');
                        });

                        it('should reload itself', function() {
                            expect(player.reload).toHaveBeenCalled();
                        });
                    });
                });
            });
        });
    });
});
