import '../../../src/tests.js';
import browser from '../../../src/services/browser.js';
import environment from '../../../src/environment.js';

describe('mobile test', function() {
    it('should get mobile status from the environment', function(done) {
        Promise.resolve(browser.test('mobile').then(result => {
            expect(result).toBe(environment.browser.isMobile);
        })).then(done, done.fail);
    });
});
