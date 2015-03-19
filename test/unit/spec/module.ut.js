import module from '../../../src/services/module.js';
import DisplayAd from '../../../src/models/DisplayAd.js';
import DisplayAdController from '../../../src/controllers/DisplayAdController.js';

describe('module', function() {
    let card;
    let experience;

    beforeEach(function() {
        module.constructor();

        card = {};
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
                    displayAd: new DisplayAd(card, experience)
                };

                result = module.getControllers(modules);
            });

            it('should return instantiated controllers for the given modules', function() {
                expect(result).toEqual({
                    displayAd: jasmine.any(DisplayAdController)
                });
                expect(result.displayAd.model).toBe(modules.displayAd);
            });
        });
    });
});
