import completeUrl from '../../../src/fns/complete_url.js';
import environment from '../../../src/environment.js';

describe('completeUrl(url)', function() {
    let url;

    beforeEach(function() {
        environment.constructor();

        jasmine.clock().install();
        jasmine.clock().mockDate();
        environment.debug = false;

        url = '//ad.doubleclick.net/pfadx/N6543.1919213CINEMA6INC/B8370514.113697085;sz=0x0;ord={cachebreaker};dcmt=text/xml;url={pageUrl};id={guid};cb={cachebreaker};cb=[timestamp]';
    });

    afterEach(function() {
        jasmine.clock().uninstall();
    });

    afterAll(function() {
        environment.constructor();
    });

    it('should be the url with the dynamic segments replaced', function() {
        expect(completeUrl(url)).toBe(
            `//ad.doubleclick.net/pfadx/N6543.1919213CINEMA6INC/B8370514.113697085;sz=0x0` +
            `;ord=${encodeURIComponent(Date.now())};dcmt=text/xml;url` +
            `=${encodeURIComponent(environment.href)};id` +
            `=${encodeURIComponent(environment.guid)};cb=${encodeURIComponent(Date.now())};` +
            `cb=${encodeURIComponent(Date.now())}`
        );
    });

    describe('if in debug mode', function() {
        beforeEach(function() {
            environment.debug = true;
            url = '{pageUrl}';
        });

        it('should set the pageUrl to "mutantplayground.com"', function() {
            expect(completeUrl(url)).toBe(encodeURIComponent('mutantplayground.com'));
        });
    });
});
