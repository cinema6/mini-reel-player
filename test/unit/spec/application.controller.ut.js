describe('ApplicationController', function() {
    import ApplicationController from '../../../src/controllers/ApplicationController.js';
    import ApplicationView from '../../../src/views/ApplicationView.js';
    import Controller from '../../../lib/core/Controller.js';
    import cinema6 from '../../../src/services/cinema6.js';
    import PlayerController from '../../../src/controllers/PlayerController.js';
    import Runner from '../../../lib/Runner.js';
    let ApplicationCtrl;
    let session;

    let root;

    beforeEach(function() {
        root = document.createElement('body');

        cinema6.constructor();

        const init = cinema6.init;
        spyOn(cinema6, 'init').and.callFake(function() {
            return (session = init.apply(cinema6, arguments));
        });

        Runner.run(() => ApplicationCtrl = new ApplicationController(root));
    });

    it('should exist', function() {
        expect(ApplicationCtrl).toEqual(jasmine.any(Controller));
    });

    it('should initialize a cinema6 session', function() {
        expect(cinema6.init).toHaveBeenCalled();
    });

    describe('properties:', function() {
        describe('session', function() {
            it('should be the cinema6 session', function() {
                expect(ApplicationCtrl.session).toBe(session);
            });
        });

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
