import globalModule from '../../../../lib/global.js';

describe('global', function() {
    it('should be the global object', function() {
        expect(globalModule).toBe(global);
    });
});
