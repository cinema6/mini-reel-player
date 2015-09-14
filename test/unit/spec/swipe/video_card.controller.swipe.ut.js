import SwipeVideoCardController from '../../../../src/controllers/swipe/SwipeVideoCardController.js';
import VideoCardController from '../../../../src/controllers/VideoCardController.js';
import Mixable from '../../../../lib/core/Mixable.js';
import SafelyGettable from '../../../../src/mixins/SafelyGettable.js';
import { EventEmitter } from 'events';
import SwipeVideoCardView from '../../../../src/views/swipe/SwipeVideoCardView.js';
import View from '../../../../lib/core/View.js';
import Runner from '../../../../lib/Runner.js';
import SwipeBallotController from '../../../../src/controllers/swipe/SwipeBallotController.js';
import SwipePostController from '../../../../src/controllers/swipe/SwipePostController.js';
import playerFactory from '../../../../src/services/player_factory.js';
import CorePlayer from '../../../../src/players/CorePlayer.js';

class MockPlayer extends CorePlayer {
    play() {}
    pause() {}
    minimize() {}
    load() {}
    reload() {}
    unload() {}
}

class MockCard extends Mixable {}
MockCard.mixin(EventEmitter, SafelyGettable);

describe('SwipeVideoCardController', function() {
    let SwipeVideoCardCtrl;
    let card;
    let meta;
    let parentView;

    beforeEach(function() {
        card = new MockCard();
        card.data = { type: 'youtube' };
        card.thumbs = {};
        card.modules = {};
        card.getSrc = function() {};
        card.links = {};
        card.shareLinks = {};
        card.action = {};
        card.complete = function() {};
        card.setPlaybackState = function() {};

        meta = {
            number: 3,
            total: 5
        };

        spyOn(playerFactory, 'playerForCard').and.callFake(() => new MockPlayer());

        parentView = new View();

        spyOn(SwipeVideoCardController.prototype, 'addView').and.callThrough();

        SwipeVideoCardCtrl = new SwipeVideoCardController(card, meta, parentView);
    });

    it('should exist', function() {
        expect(SwipeVideoCardCtrl).toEqual(jasmine.any(VideoCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a SwipeVideoCardView', function() {
                expect(SwipeVideoCardCtrl.view).toEqual(jasmine.any(SwipeVideoCardView));
                expect(SwipeVideoCardCtrl.addView).toHaveBeenCalledWith(SwipeVideoCardCtrl.view);
            });

            describe('events:', function() {
                let player;
                let view;

                beforeEach(function() {
                    player = SwipeVideoCardCtrl.player;
                    view = SwipeVideoCardCtrl.view;

                    spyOn(player, 'pause');
                    spyOn(player, 'play');
                });

                describe('flip', function() {
                    describe('if the player is paused', function() {
                        beforeEach(function() {
                            Object.defineProperty(player, 'paused', { value: true });

                            view.emit('flip');
                        });

                        it('should not pause the player', function() {
                            expect(player.pause).not.toHaveBeenCalled();
                        });

                        describe('when the card unflips', function() {
                            beforeEach(function() {
                                view.emit('unflip');
                            });

                            it('should not play the player', function() {
                                expect(player.play).not.toHaveBeenCalled();
                            });
                        });
                    });

                    describe('if the player is not paused', function() {
                        beforeEach(function() {
                            Object.defineProperty(player, 'paused', { value: false });

                            view.emit('flip');
                        });

                        it('should pause the player', function() {
                            expect(player.pause).toHaveBeenCalled();
                        });

                        describe('when the card unflips', function() {
                            beforeEach(function() {
                                view.emit('unflip');
                            });

                            it('should play the player', function() {
                                expect(player.play).toHaveBeenCalled();
                            });
                        });
                    });
                });
            });
        });

        describe('flippable', function() {
            it('should be true', function() {
                expect(SwipeVideoCardCtrl.flippable).toBe(true);
            });
        });

        describe('model', function() {
            describe('events:', function() {
                describe('deactivate', function() {
                    beforeEach(function() {
                        spyOn(SwipeVideoCardCtrl.view, 'flip');

                        Runner.run(() => card.emit('deactivate'));
                    });

                    it('should unflip its view', function() {
                        expect(SwipeVideoCardCtrl.view.flip).toHaveBeenCalledWith(false);
                    });
                });
            });
        });
    });

    describe('initBallot()', function() {
        describe('if the card has a ballot', function() {
            let ballot;

            beforeEach(function() {
                ballot = new EventEmitter();
                card.modules.ballot = ballot;

                SwipeVideoCardCtrl.initBallot();
            });

            it('should instantiate a SwipeBallotCtrl', function() {
                expect(SwipeVideoCardCtrl.BallotCtrl).toEqual(jasmine.any(SwipeBallotController));
                expect(SwipeVideoCardCtrl.BallotCtrl.model).toBe(ballot);
                expect(SwipeVideoCardCtrl.BallotCtrl.card).toBe(card);
            });

            describe('when the player plays', function() {
                beforeEach(function() {
                    spyOn(SwipeVideoCardCtrl.BallotCtrl, 'deactivate');

                    SwipeVideoCardCtrl.player.emit('play');
                });

                it('should deactivate() the BallotCtrl', function() {
                    expect(SwipeVideoCardCtrl.BallotCtrl.deactivate).toHaveBeenCalled();
                });
            });

            describe('when the player pauses', function() {
                beforeEach(function() {
                    spyOn(SwipeVideoCardCtrl.BallotCtrl, 'activate');

                    SwipeVideoCardCtrl.player.emit('pause');
                });

                it('should activate() the BallotCtrl', function() {
                    expect(SwipeVideoCardCtrl.BallotCtrl.activate).toHaveBeenCalled();
                });
            });

            describe('when the card deactivates', function() {
                beforeEach(function() {
                    spyOn(SwipeVideoCardCtrl.BallotCtrl, 'deactivate');

                    Runner.run(() => card.emit('deactivate'));
                });

                it('should deactivate() the BallotCtrl', function() {
                    expect(SwipeVideoCardCtrl.BallotCtrl.deactivate).toHaveBeenCalled();
                });
            });
        });
    });

    describe('initPost()', function() {
        describe('if the card has a post', function() {
            let post;

            beforeEach(function() {
                post = new EventEmitter();
                post.ballot = null;

                card.modules.post = post;
            });

            describe('if the post has a ballot', function() {
                let ballot;

                beforeEach(function() {
                    ballot = new EventEmitter();
                    ballot.choice = null;

                    post.ballot = ballot;

                    SwipeVideoCardCtrl.initPost();
                });

                it('should instantiate a SwipePostController', function() {
                    expect(SwipeVideoCardCtrl.PostCtrl).toEqual(jasmine.any(SwipePostController));
                    expect(SwipeVideoCardCtrl.PostCtrl.model).toBe(post);
                });

                describe('when the card is deactivated', function() {
                    beforeEach(function() {
                        spyOn(SwipeVideoCardCtrl.PostCtrl, 'deactivate');

                        Runner.run(() => card.emit('deactivate'));
                    });

                    it('should deactivate() the PostCtrl', function() {
                        expect(SwipeVideoCardCtrl.PostCtrl.deactivate).toHaveBeenCalled();
                    });
                });

                describe('when the player plays', function() {
                    beforeEach(function() {
                        spyOn(SwipeVideoCardCtrl.PostCtrl, 'deactivate');

                        Runner.run(() => SwipeVideoCardCtrl.player.emit('play'));
                    });

                    it('should deactivate() the PostCtrl', function() {
                        expect(SwipeVideoCardCtrl.PostCtrl.deactivate).toHaveBeenCalled();
                    });
                });

                describe('when the player ends', function() {
                    beforeEach(function() {
                        spyOn(SwipeVideoCardCtrl.PostCtrl, 'activate');
                    });

                    describe('if the user has not voted', function() {
                        beforeEach(function() {
                            ballot.choice = null;
                            Runner.run(() => SwipeVideoCardCtrl.player.emit('ended'));
                        });

                        it('should activate() the PostCtrl', function() {
                            expect(SwipeVideoCardCtrl.PostCtrl.activate).toHaveBeenCalled();
                        });
                    });

                    describe('if the user has voted', function() {
                        beforeEach(function() {
                            ballot.choice = 0;
                            Runner.run(() => SwipeVideoCardCtrl.player.emit('ended'));
                        });

                        it('should not activate() the PostCtrl', function() {
                            expect(SwipeVideoCardCtrl.PostCtrl.activate).not.toHaveBeenCalled();
                        });
                    });
                });

                describe('when the user votes', function() {
                    beforeEach(function() {
                        spyOn(SwipeVideoCardCtrl.PostCtrl, 'deactivate');

                        Runner.run(() => SwipeVideoCardCtrl.PostCtrl.emit('vote'));
                    });

                    it('should deactivate() the PostCtrl', function() {
                        expect(SwipeVideoCardCtrl.PostCtrl.deactivate).toHaveBeenCalled();
                    });
                });
            });

            describe('if the post has no ballot', function() {
                beforeEach(function() {
                    post.ballot = null;

                    SwipeVideoCardCtrl.initPost();
                });

                it('should not instantiate a PostCtrl', function() {
                    expect('PostCtrl' in SwipeVideoCardCtrl).toBe(false);
                });
            });
        });
    });

    describe('render()', function() {
        beforeEach(function() {
            spyOn(SwipeVideoCardCtrl.view, 'update').and.callThrough();
            spyOn(VideoCardController.prototype, 'render').and.callThrough();
            spyOn(SwipeVideoCardCtrl.view, 'appendTo');

            Runner.run(() => SwipeVideoCardCtrl.render());
        });

        it('should update its view with info about the card\'s position in the MiniReel', function() {
            expect(SwipeVideoCardCtrl.view.update).toHaveBeenCalledWith({
                number: '3',
                total: '5'
            });
        });

        it('should call super()', function() {
            expect(VideoCardController.prototype.render).toHaveBeenCalled();
        });

        it('should append its view to the parent', function() {
            expect(SwipeVideoCardCtrl.view.appendTo).toHaveBeenCalledWith(parentView);
        });
    });

    describe('toggleFlip()', function() {
        let view;

        beforeEach(function() {
            view = SwipeVideoCardCtrl.view;

            spyOn(view, 'flip');
        });

        describe('if the view is flipped', function() {
            beforeEach(function() {
                view.flipped = true;

                SwipeVideoCardCtrl.toggleFlip();
            });

            it('should call flip() with false', function() {
                expect(view.flip).toHaveBeenCalledWith(false);
            });
        });

        describe('if the view is not flipped', function() {
            beforeEach(function() {
                view.flipped = false;

                SwipeVideoCardCtrl.toggleFlip();
            });

            it('should call flip() with true', function() {
                expect(view.flip).toHaveBeenCalledWith(true);
            });
        });
    });

    describe('canAutoadvance()', function() {
        beforeEach(function() {
            spyOn(VideoCardController.prototype, 'canAutoadvance').and.returnValue(false);
        });

        describe('if there is no ballot module', function() {
            beforeEach(function() {
                delete card.modules.ballot;
            });

            it('should be true', function() {
                expect(SwipeVideoCardCtrl.canAutoadvance()).toBe(true);
            });
        });

        describe('if there is a ballot module', function() {
            beforeEach(function() {
                card.modules.ballot = new EventEmitter();
            });

            it('should be false', function() {
                expect(SwipeVideoCardCtrl.canAutoadvance()).toBe(false);
            });
        });

        describe('if there is no post module', function() {
            beforeEach(function() {
                delete card.modules.post;
            });

            it('should be true', function() {
                expect(SwipeVideoCardCtrl.canAutoadvance()).toBe(true);
            });
        });

        describe('if there is a post module', function() {
            beforeEach(function() {
                card.modules.post = new EventEmitter();
                card.modules.post.ballot = null;
            });

            describe('if the post has no ballot', function() {
                beforeEach(function() {
                    card.modules.post.ballot = null;
                });

                it('should be true', function() {
                    expect(SwipeVideoCardCtrl.canAutoadvance()).toBe(true);
                });
            });

            describe('if the post has a ballot', function() {
                beforeEach(function() {
                    card.modules.post.ballot = new EventEmitter();
                    card.modules.post.ballot.choice = null;
                });

                describe('if the user has not voted', function() {
                    beforeEach(function() {
                        card.modules.post.ballot.choice = null;
                    });

                    it('should be false', function() {
                        expect(SwipeVideoCardCtrl.canAutoadvance()).toBe(false);
                    });
                });

                describe('if the user has voted', function() {
                    beforeEach(function() {
                        card.modules.post.ballot.choice = 0;
                    });

                    it('should be true', function() {
                        expect(SwipeVideoCardCtrl.canAutoadvance()).toBe(true);
                    });
                });
            });
        });
    });
});
