describe('Controller', function() {
    import Controller from '../../../../lib/core/Controller.js';
    import Mixable from '../../../../lib/core/Mixable.js';
    let controller;

    beforeEach(function() {
        controller = new Controller();
    });

    it('should exist', function() {
        expect(controller).toEqual(jasmine.any(Mixable));
    });
});
