import PostController from '../../../src/controllers/PostController.js';
import ModuleController from '../../../src/controllers/ModuleController.js';
import Post from '../../../src/models/Post.js';
import PostView from '../../../src/views/PostView.js';
import PostBallotView from '../../../src/views/PostBallotView.js';
import View from '../../../lib/core/View.js';
import Runner from '../../../lib/Runner.js';

describe('PostController', function() {
    let PostCtrl;
    let card;
    let experience;
    let post;

    beforeEach(function() {
        card = {
            links: { Website: 'http://www.netflix.com' },
            data: {}
        };
        experience = { data: {} };

        post = new Post(card, experience);
        PostCtrl = new PostController(post);
    });

    it('should exist', function() {
        expect(PostCtrl).toEqual(jasmine.any(ModuleController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a PostView', function() {
                expect(PostCtrl.view).toEqual(jasmine.any(PostView));
            });

            describe('events:', function() {
                let parentView;

                beforeEach(function() {
                    parentView = new View();
                    parentView.tag = 'div';

                    Runner.run(() => PostCtrl.renderInto(parentView));
                });

                describe('replay', function() {
                    let replay;

                    beforeEach(function() {
                        replay = jasmine.createSpy('replay()');
                        PostCtrl.on('replay', replay);
                        spyOn(PostCtrl, 'deactivate');

                        PostCtrl.view.emit('replay');
                    });

                    it('should emit the replay event', function() {
                        expect(replay).toHaveBeenCalled();
                    });

                    it('should deactivate itself', function() {
                        expect(PostCtrl.deactivate).toHaveBeenCalled();
                    });
                });

                describe('close', function() {
                    beforeEach(function() {
                        spyOn(PostCtrl, 'deactivate');

                        PostCtrl.view.emit('close');
                    });

                    it('should deactivate itself', function() {
                        expect(PostCtrl.deactivate).toHaveBeenCalled();
                    });
                });

                describe('vote', function() {
                    let oldView;
                    let parentView;

                    beforeEach(function() {
                        parentView = new View();
                        parentView.tag = 'div';

                        card.ballot = {
                            prompt: 'How\'s it going?',
                            choices: ['Awesome', 'Terrible']
                        };
                        post = new Post(card, experience);

                        spyOn(post.ballot, 'cast');

                        PostCtrl = new PostController(post);
                        oldView = PostCtrl.view;
                        Runner.run(() => PostCtrl.renderInto(parentView));
                        spyOn(PostCtrl, 'deactivate');
                        spyOn(oldView, 'remove');
                        spyOn(PostCtrl, 'renderInto').and.callThrough();

                        PostCtrl.view.emit('vote', 2);
                    });

                    it('should deactivate itself', function() {
                        expect(PostCtrl.deactivate).toHaveBeenCalled();
                    });

                    it('should cast the ballot with the provided value', function() {
                        post.ballot.cast.calls.reset();
                        PostCtrl.constructor(post);
                        Runner.run(() => PostCtrl.renderInto(parentView));

                        PostCtrl.view.emit('vote', 0);
                        expect(post.ballot.cast).toHaveBeenCalledWith(0);
                        post.ballot.cast.calls.reset();
                        PostCtrl.constructor(post);
                        Runner.run(() => PostCtrl.renderInto(parentView));

                        PostCtrl.view.emit('vote', 1);
                        expect(post.ballot.cast).toHaveBeenCalledWith(1);
                    });

                    it('should remove its view', function() {
                        expect(oldView.remove).toHaveBeenCalled();
                    });

                    it('should make its view a PostView', function() {
                        expect(PostCtrl.view.constructor).toBe(PostView);
                    });

                    it('should render the new view into the old view\'s parent', function() {
                        expect(PostCtrl.renderInto).toHaveBeenCalledWith(parentView);
                    });
                });
            });

            describe('if the post has a ballot', function() {
                beforeEach(function() {
                    card.ballot = {
                        prompt: 'Hello!',
                        choices: []
                    };
                    post = new Post(card, experience);

                    PostCtrl = new PostController(post);
                });

                it('should be a PostBallotView', function() {
                    expect(PostCtrl.view).toEqual(jasmine.any(PostBallotView));
                });
            });
        });
    });

    describe('methods:', function() {
        describe('renderInto(view)', function() {
            let view;

            beforeEach(function() {
                view = new View();

                spyOn(ModuleController.prototype, 'renderInto');
                spyOn(PostCtrl.view, 'update');

                PostCtrl.renderInto(view);
            });

            it('should call super()', function() {
                expect(ModuleController.prototype.renderInto).toHaveBeenCalledWith(view);
            });

            it('should update the view with data about the model', function() {
                expect(PostCtrl.view.update).toHaveBeenCalledWith({
                    website: post.website,
                    ballot: null
                });
            });

            describe('if the post has a ballot', function() {
                beforeEach(function() {
                    card.ballot = {
                        prompt: 'How\'s it going?',
                        choices: ['Awesome', 'Terrible']
                    };
                    post = new Post(card, experience);

                    PostCtrl = new PostController(post);
                    spyOn(PostCtrl.view, 'update');

                    PostCtrl.renderInto(view);
                });

                it('should include view info about the ballot', function() {
                    expect(PostCtrl.view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        ballot: {
                            prompt: post.ballot.prompt,
                            choice1: post.ballot.choices[0],
                            choice2: post.ballot.choices[1]
                        }
                    }));
                });
            });
        });
    });
});
