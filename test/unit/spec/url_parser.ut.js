import urlParser from '../../../src/services/url_parser.js';
import environment from '../../../src/environment.js';

describe('urlParser', function() {
    beforeEach(function() {
        environment.constructor();
        urlParser.constructor();
    });

    afterAll(function() {
        environment.constructor();
        urlParser.constructor();
    });

    it('should exist', function() {
        expect(urlParser).toEqual(jasmine.any(Object));
    });

    it('should parse the url', function() {
        expect(urlParser.parse('http://www.apple.com:9000/foo/test.json?abc=123#foo')).toEqual(jasmine.objectContaining({
            absolute: true,
            href: 'http://www.apple.com:9000/foo/test.json?abc=123#foo',
            protocol: 'http',
            host: 'www.apple.com:9000',
            search: 'abc=123',
            hash: 'foo',
            hostname: 'www.apple.com',
            port: '9000',
            pathname: '/foo/test.json',
            origin: 'http://www.apple.com:9000'
        }));
    });

    it('should work for minimal urls', function() {
        expect(urlParser.parse('/hello/world.html')).toEqual(jasmine.objectContaining({
            absolute: false,
            href: location.origin + '/hello/world.html',
            protocol: location.protocol.replace(/:$/, ''),
            host: location.host,
            search: '',
            hash: '',
            hostname: location.hostname,
            port: location.port,
            pathname: '/hello/world.html',
            origin: location.protocol + '//' + location.host
        }));
    });

    describe('if the parsed protocol does not match the environment protocol', function() {
        let a;
        let url;

        beforeEach(function() {
            environment.protocol = 'http:';
            a = {
                setAttribute: jasmine.createSpy('a.setAttribute()'),
                href: 'applewebdata://apple.com/foo/bar',
                protocol: 'applewebdata:',
                host: 'apple.com',
                search: '',
                hash: '',
                hostname: 'apple.com',
                port: '',
                pathname: '/foo/bar'
            };
            spyOn(document, 'createElement').and.returnValue(a);

            urlParser.constructor();
        });

        describe('if an absolute URL is provided', function() {
            beforeEach(function() {
                url = urlParser.parse('applewebdata://apple.com/foo/bar');
            });

            it('should allow the difference in protocol', function() {
                expect(url).toEqual(jasmine.objectContaining({
                    href: 'applewebdata://apple.com/foo/bar',
                    protocol: 'applewebdata'
                }));
            });
        });

        describe('if a relative URL is provided', function() {
            beforeEach(function() {
                url = urlParser.parse('//apple.com/foo/bar');
            });

            it('should give the URL the same protocol as the environment', function() {
                expect(url).toEqual(jasmine.objectContaining({
                    href: 'http://apple.com/foo/bar',
                    protocol: 'http'
                }));
            });
        });
    });

    describe('in freakin\' internet explorer', function() {
        let a;

        beforeEach(function() {
            a = {
                setAttribute: jasmine.createSpy('a.setAttribute()'),
                pathname: 'my/path/foo',
                protocol: environment.protocol,
                search: '',
                hash: ''
            };

            spyOn(document, 'createElement').and.returnValue(a);
            urlParser.constructor();
            expect(document.createElement).toHaveBeenCalledWith('a');
        });

        it('should include the leading slash in the pathname', function() {
            expect(urlParser.parse('http://www.foo.com/my/path/foo').pathname).toBe('/my/path/foo');
        });
    });

    describe('sameOriginAs(url)', function() {
        it('should return a boolean indicating if the provided url has the same origin as the parsed url', function() {
            const parsed = urlParser.parse('http://www.cinema6.com/foo/test.xml');

            expect(parsed.sameOriginAs('http://www.cinema6.com/help.json')).toBe(true);
            expect(parsed.sameOriginAs('https://www.cinema6.com/help.json')).toBe(false);
            expect(parsed.sameOriginAs('http://cinema6.com/help.json')).toBe(false);
            expect(parsed.sameOriginAs('/okay.html')).toBe(false);
        });
    });
});
