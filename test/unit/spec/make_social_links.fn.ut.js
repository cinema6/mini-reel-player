import makeSocialLinks from '../../../src/fns/make_social_links.js';

describe('makeSocialLinks(links)', function() {
    let links;
    let result;

    beforeEach(function() {
        links = {
            foo: { uri: 'http://www.foo.com', tracking: ['foo.px', 'bar.px'] },
            Facebook: { uri: 'http://www.facebook.com/post/3', tracking: ['pixel.px'] },
            'My Site': { uri: 'http://josh.minzner.org', tracking: [] },
            Twitter: { uri: 'http://twitter.com/tweet/dhsjcb', tracking: ['tweet.me'] },
            Pinterest: { uri: 'http://pin.it', tracking: ['url1.foo', 'url2.bar'] },
            YouTube: { uri: 'http://youtu.be/v?w8ru4893r', tracking: ['video.play'] },
            Vimeo: { uri: 'http://video.com/487543975', tracking: [] },
            Instagram: { uri: 'http://instag.rm/hfu9ewr', tracking: ['bar.px'] },
            Action: { uri: 'http://store.com/buy', tracking: ['foo.bar', 'bar.foo'] }
        };

        result = makeSocialLinks(links);
    });

    it('should return an Array of social links', function() {
        expect(result).toEqual([
            { type: 'facebook', label: 'Facebook', href: links.Facebook.uri },
            { type: 'twitter', label: 'Twitter', href: links.Twitter.uri },
            { type: 'pinterest', label: 'Pinterest', href: links.Pinterest.uri },
            { type: 'youtube', label: 'YouTube', href: links.YouTube.uri },
            { type: 'vimeo', label: 'Vimeo', href: links.Vimeo.uri },
            { type: 'instagram', label: 'Instagram', href: links.Instagram.uri }
        ]);
    });
});
