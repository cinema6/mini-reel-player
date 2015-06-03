import SwipeApplicationController from '../../../../src/controllers/swipe/SwipeApplicationController.js';
import ApplicationController from '../../../../src/controllers/ApplicationController.js';
import SwipePlayerController from '../../../../src/controllers/swipe/SwipePlayerController.js';

describe('SwipeApplicationController', function() {
    let SwipeApplicationCtrl;

    beforeEach(function() {
        SwipeApplicationCtrl = new SwipeApplicationController(document.createElement('body'));
    });

    it('should exist', function() {
        expect(SwipeApplicationCtrl).toEqual(jasmine.any(ApplicationController));
    });

    describe('properties:', function() {
        describe('PlayerCtrl', function() {
            it('should be a SwipePlayerController', function() {
                expect(SwipeApplicationCtrl.PlayerCtrl).toEqual(jasmine.any(SwipePlayerController));
            });
        });
    });
});
