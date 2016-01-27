import makeSocialLinks from '../../../src/fns/make_social_links.js';
import socialLinkCTAs from '../../../src/copy/social_link_ctas.json';

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
            { type: 'facebook', label: 'Facebook', href: links.Facebook.uri, cta: socialLinkCTAs.Facebook },
            { type: 'twitter', label: 'Twitter', href: links.Twitter.uri, cta: socialLinkCTAs.Twitter },
            { type: 'pinterest', label: 'Pinterest', href: links.Pinterest.uri, cta: socialLinkCTAs.Pinterest },
            { type: 'youtube', label: 'YouTube', href: links.YouTube.uri, cta: socialLinkCTAs.YouTube },
            { type: 'vimeo', label: 'Vimeo', href: links.Vimeo.uri, cta: socialLinkCTAs.Vimeo },
            { type: 'instagram', label: 'Instagram', href: links.Instagram.uri, cta: socialLinkCTAs.Instagram }
        ]);
    });
});
