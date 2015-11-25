import PostController from '../../../src/controllers/PostController.js';
import ModuleController from '../../../src/controllers/ModuleController.js';
import Post from '../../../src/models/Post.js';
import PostView from '../../../src/views/PostView.js';
import PostBallotView from '../../../src/views/PostBallotView.js';
import View from '../../../lib/core/View.js';
import Runner from '../../../lib/Runner.js';
import ButtonView from '../../../src/views/ButtonView.js';

describe('PostController', function() {
    let PostCtrl;
    let card;
    let experience;
    let post;

    beforeEach(function() {
        card = {
            links: { Website: { uri: 'http://www.netflix.com', tracking: [] } },
            data: {}
        };
        experience = { data: {} };
        spyOn(PostController.prototype, 'addView').and.callThrough();

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
                expect(PostCtrl.addView).toHaveBeenCalledWith(PostCtrl.view);
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
                    expect(PostCtrl.addView).toHaveBeenCalledWith(PostCtrl.view);
                });
            });
        });
    });

    describe('methods:', function() {
        describe('replay()', function() {
            let replay;

            beforeEach(function() {
                replay = jasmine.createSpy('replay()');
                PostCtrl.on('replay', replay);
                spyOn(PostCtrl, 'deactivate');

                PostCtrl.replay();
            });

            it('should emit the replay event', function() {
                expect(replay).toHaveBeenCalled();
            });

            it('should deactivate itself', function() {
                expect(PostCtrl.deactivate).toHaveBeenCalled();
            });
        });

        describe('vote(button)', function() {
            let oldView;
            let parentView;
            let buttonView;

            beforeEach(function() {
                parentView = new View();
                parentView.tag = 'div';
                buttonView = new ButtonView();

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
                spyOn(oldView, 'destroy');
                spyOn(PostCtrl, 'renderInto').and.callThrough();

                PostCtrl.vote(buttonView);
            });

            it('should deactivate itself', function() {
                expect(PostCtrl.deactivate).toHaveBeenCalled();
            });

            it('should cast the ballot with the provided value', function() {
                post.ballot.cast.calls.reset();
                PostCtrl.constructor(post);
                Runner.run(() => PostCtrl.renderInto(parentView));

                buttonView.id = 'post-module-vote1';
                PostCtrl.vote(buttonView);
                expect(post.ballot.cast).toHaveBeenCalledWith(0);
                post.ballot.cast.calls.reset();
                PostCtrl.constructor(post);
                Runner.run(() => PostCtrl.renderInto(parentView));

                buttonView.id = 'post-module-vote2';
                PostCtrl.vote(buttonView);
                expect(post.ballot.cast).toHaveBeenCalledWith(1);
            });

            it('should destroy its view', function() {
                expect(oldView.destroy).toHaveBeenCalled();
            });

            it('should make its view a PostView', function() {
                expect(PostCtrl.view.constructor).toBe(PostView);
                expect(PostCtrl.addView).toHaveBeenCalledWith(PostCtrl.view);
            });

            it('should render the new view into the old view\'s parent', function() {
                expect(PostCtrl.renderInto).toHaveBeenCalledWith(parentView);
            });
        });

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
                    website: post.website.uri,
                    ballot: null
                });
            });

            describe('if the post has no website', function() {
                beforeEach(function() {
                    card.links = {};
                    post = new Post(card, experience);

                    PostCtrl = new PostController(post);
                    spyOn(PostCtrl.view, 'update');

                    PostCtrl.renderInto(view);
                });

                it('should not include any data about the website', function() {
                    expect(PostCtrl.view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        website: undefined
                    }));
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
