import urlParser from '../../../src/services/url_parser.js';

describe('urlParser', function() {
    beforeEach(function() {
        urlParser.constructor();
    });

    afterAll(function() {
        urlParser.constructor();
    });

    it('should exist', function() {
        expect(urlParser).toEqual(jasmine.any(Object));
    });

    it('should parse the url', function() {
        expect(urlParser.parse('http://www.apple.com:9000/foo/test.json?abc=123#foo')).toEqual(jasmine.objectContaining({
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

    describe('in freakin\' internet explorer', function() {
        let a;

        beforeEach(function() {
            a = {
                setAttribute: jasmine.createSpy('a.setAttribute()'),
                pathname: 'my/path/foo',
                protocol: '',
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
