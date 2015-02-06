describe('Controller', function() {
    import Controller from '../../../../lib/core/Controller.js';
    let controller;

    beforeEach(function() {
        controller = new Controller();
    });

    it('should exist', function() {
        expect(controller).toEqual(jasmine.any(Object));
    });
});
