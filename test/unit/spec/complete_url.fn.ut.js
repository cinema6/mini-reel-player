import completeUrl from '../../../src/fns/complete_url.js';
import environment from '../../../src/environment.js';

describe('completeUrl(url, [params])', function() {
    let url;

    beforeEach(function() {
        environment.constructor();

        jasmine.clock().install();
        jasmine.clock().mockDate();
        environment.debug = false;
        environment.href = 'http://cinema6.com/solo?id=e-bc30fd47d005e3&campaign=cam-c163b84cd06ac0&src=jun';

        url = '//ad.doubleclick.net/pfadx/N6543.1919213CINEMA6INC/B8370514.113697085;sz=0x0;ord={cachebreaker};dcmt=text/xml;url={pageUrl};id={guid};cb={cachebreaker};cb=[timestamp];foo={bar};bar={foo}';
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
            `=${encodeURIComponent('http://cinema6.com/solo')};id` +
            `=${encodeURIComponent(environment.guid)};cb=${encodeURIComponent(Date.now())};` +
            `cb=${encodeURIComponent(Date.now())};` +
            `foo={bar};` +
            `bar={foo}`
        );
    });

    describe('if called with params', function() {
        it('should replace the macros defined in the params', function() {
            expect(completeUrl(url, { '{bar}': 'Hello Bar!', '{foo}': 'Hello, World!' })).toBe(
                `//ad.doubleclick.net/pfadx/N6543.1919213CINEMA6INC/B8370514.113697085;sz=0x0` +
                `;ord=${encodeURIComponent(Date.now())};dcmt=text/xml;url` +
                `=${encodeURIComponent('http://cinema6.com/solo')};id` +
                `=${encodeURIComponent(environment.guid)};cb=${encodeURIComponent(Date.now())};` +
                `cb=${encodeURIComponent(Date.now())};` +
                `foo=${encodeURIComponent('Hello Bar!')};` +
                `bar=${encodeURIComponent('Hello, World!')}`
            );
        });
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
