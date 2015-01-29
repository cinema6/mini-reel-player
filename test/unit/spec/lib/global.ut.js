describe('global', function() {
    import globalModule from '../../../../lib/global.js';

    it('should be the global object', function() {
        expect(globalModule).toBe(global);
    });
});
