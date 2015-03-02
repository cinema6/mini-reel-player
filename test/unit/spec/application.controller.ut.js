describe('ApplicationController', function() {
    import ApplicationController from '../../../src/controllers/ApplicationController.js';
    import ApplicationView from '../../../src/views/ApplicationView.js';
    import Controller from '../../../lib/core/Controller.js';
    import PlayerController from '../../../src/controllers/PlayerController.js';
    import Runner from '../../../lib/Runner.js';
    let ApplicationCtrl;

    let root;

    beforeEach(function() {
        root = document.createElement('body');

        Runner.run(() => ApplicationCtrl = new ApplicationController(root));
    });

    it('should exist', function() {
        expect(ApplicationCtrl).toEqual(jasmine.any(Controller));
    });

    describe('properties:', function() {
        describe('appView', function() {
            it('should be an ApplicationView', function() {
                expect(ApplicationCtrl.appView).toEqual(jasmine.any(ApplicationView));
            });

            it('should be for the root', function() {
                expect(ApplicationCtrl.appView.element).toBe(root);
            });
        });

        describe('PlayerCtrl', function() {
            it('should be a PlayerController', function() {
                expect(ApplicationCtrl.PlayerCtrl).toEqual(jasmine.any(PlayerController));
            });
        });
    });
});
