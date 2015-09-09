import normalizeLinks from '../../../src/fns/normalize_links.js';

describe('normalizeLinks(links)', function() {
    let links;
    let result;

    beforeEach(function() {
        links = {
            foo: { uri: 'http://www.foo.com', tracking: ['foo.px', 'bar.px'] },
            Facebook: 'http://www.facebook.com/post/3',
            'My Site': { uri: 'http://josh.minzner.org', tracking: [] },
            Twitter: { uri: 'http://twitter.com/tweet/dhsjcb', tracking: ['tweet.me'] },
            Pinterest: 'http://pin.it',
            YouTube: { uri: 'http://youtu.be/v?w8ru4893r', tracking: ['video.play'] },
            Vimeo: 'http://video.com/487543975',
            Instagram: { uri: 'http://instag.rm/hfu9ewr', tracking: ['bar.px'] },
            Action: { uri: 'http://store.com/buy', tracking: ['foo.bar', 'bar.foo'] }
        };

        result = normalizeLinks(links);
    });

    it('should make all links values objects', function() {
        expect(result).toEqual({
            foo: { uri: 'http://www.foo.com', tracking: ['foo.px', 'bar.px'] },
            Facebook: { uri: 'http://www.facebook.com/post/3', tracking: [] },
            'My Site': { uri: 'http://josh.minzner.org', tracking: [] },
            Twitter: { uri: 'http://twitter.com/tweet/dhsjcb', tracking: ['tweet.me'] },
            Pinterest: { uri: 'http://pin.it', tracking: [] },
            YouTube: { uri: 'http://youtu.be/v?w8ru4893r', tracking: ['video.play'] },
            Vimeo: { uri: 'http://video.com/487543975', tracking: [] },
            Instagram: { uri: 'http://instag.rm/hfu9ewr', tracking: ['bar.px'] },
            Action: { uri: 'http://store.com/buy', tracking: ['foo.bar', 'bar.foo'] }
        });
    });
});
