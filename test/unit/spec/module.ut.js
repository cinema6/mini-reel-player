import module from '../../../src/services/module.js';
import DisplayAd from '../../../src/models/DisplayAd.js';
import DisplayAdController from '../../../src/controllers/DisplayAdController.js';
import Post from '../../../src/models/Post.js';
import PostController from '../../../src/controllers/PostController.js';

describe('module', function() {
    let card;
    let experience;

    beforeEach(function() {
        module.constructor();

        card = {
            links: {}
        };
        experience = { data: {} };
    });

    afterAll(function() {
        module.constructor();
    });

    it('should exist', function() {
        expect(module).toEqual(jasmine.any(Object));
    });

    describe('methods:', function() {
        describe('getControllers(modules)', function() {
            let modules;
            let result;

            beforeEach(function() {
                modules = {
                    displayAd: new DisplayAd(card, experience),
                    post: new Post(card, experience)
                };

                result = module.getControllers(modules);
            });

            it('should return instantiated controllers for the given modules', function() {
                expect(result).toEqual({
                    displayAd: jasmine.any(DisplayAdController),
                    post: jasmine.any(PostController)
                });
                expect(result.displayAd.model).toBe(modules.displayAd);
                expect(result.post.model).toBe(modules.post);
            });
        });
    });
});
