import '../../../src/tests.js';
import browser from '../../../src/services/browser.js';
import BrowserInfo from 'rc-browser-info';

describe('mobile test', function() {
    it('should get mobile status from the BrowserInfo module', function(done) {
        browser.test('mobile').then(result => {
            expect(result).toBe(new BrowserInfo(window.navigator.userAgent).isMobile);
            process.nextTick(done);
        }).catch(done.fail);
    });
});
