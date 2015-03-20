import PostController from '../../../src/controllers/PostController.js';
import ModuleController from '../../../src/controllers/ModuleController.js';
import Post from '../../../src/models/Post.js';
import PostView from '../../../src/views/PostView.js';
import View from '../../../lib/core/View.js';

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
                    website: post.website
                });
            });
        });
    });
});
