import makeShareLinks from '../../../src/fns/make_share_links.js';

describe('makeShareLinks(links, thumbUrl, title)', function() {
    let links, thumbUrl, title;
    let result;

    beforeEach(function() {
        thumbUrl = 'https://media.giphy.com/media/ptDRdwFkFVAkg/giphy.gif';
        title = 'This is the Title';
    });

    describe('if no links are provided', function() {
        beforeEach(function() {
            result = makeShareLinks(links, thumbUrl, title);
        });

        it('should be an empty Array', function() {
            expect(result).toEqual([]);
        });
    });

    describe('if the values are Strings', function() {
        beforeEach(function() {
            links = {
                facebook: 'http://imgur.com/bjZGHN2',
                twitter: 'https://www.reddit.com/r/books/comments/3ux6pn/hitchhikers_guide_to_the_galaxy_has_to_be_the/',
                pinterest: 'http://www.nzherald.co.nz/lifestyle/news/article.cfm?c_id=6&objectid=11553026',
                myspace: 'http://finance.yahoo.com/news/peoples-racist-facebook-comments-ending-234400980.html'
            };

            result = makeShareLinks(links, thumbUrl, title);
        });

        it('should convert the links to Objects', function() {
            expect(result).toEqual([
                { type: 'facebook', label: 'Share', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(links.facebook)}`, tracking: [] },
                { type: 'twitter', label: 'Tweet', href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(links.twitter)}`, tracking: [] },
                { type: 'pinterest', label: 'Pin it', href: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(links.pinterest)}&media=${encodeURIComponent(thumbUrl)}&description=${encodeURIComponent(title)}`, tracking: [] }
            ]);
        });

        describe('if no thumbUrl is specified', function() {
            beforeEach(function() {
                thumbUrl = undefined;

                result = makeShareLinks(links, thumbUrl, title);
            });

            it('should remove the pinterest share link', function() {
                expect(result).toEqual([
                    { type: 'facebook', label: 'Share', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(links.facebook)}`, tracking: [] },
                    { type: 'twitter', label: 'Tweet', href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(links.twitter)}`, tracking: [] }
                ]);
            });
        });

        describe('if no title is specified', function() {
            beforeEach(function() {
                title = undefined;

                result = makeShareLinks(links, thumbUrl, title);
            });

            it('should leave the pinterest description blank', function() {
                expect(result).toEqual([
                    { type: 'facebook', label: 'Share', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(links.facebook)}`, tracking: [] },
                    { type: 'twitter', label: 'Tweet', href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(links.twitter)}`, tracking: [] },
                    { type: 'pinterest', label: 'Pin it', href: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(links.pinterest)}&media=${encodeURIComponent(thumbUrl)}&description=`, tracking: [] }
                ]);
            });
        });
    });

    describe('if the values are Objects', function() {
        beforeEach(function() {
            links = {
                facebook: {
                    uri: 'http://imgur.com/bjZGHN2',
                    tracking: ['//cinema6.com/pixel.gif?params']
                },
                twitter: {
                    uri: 'https://www.reddit.com/r/books/comments/3ux6pn/hitchhikers_guide_to_the_galaxy_has_to_be_the/',
                    tracking: ['//cinema6.com/pixel.gif?params']
                },
                pinterest: {
                    uri: 'http://www.nzherald.co.nz/lifestyle/news/article.cfm?c_id=6&objectid=11553026',
                    tracking: ['//cinema6.com/pixel.gif?params']
                },
                myspace: {
                    uri: 'http://finance.yahoo.com/news/peoples-racist-facebook-comments-ending-234400980.html',
                    tracking: ['//cinema6.com/pixel.gif?params']
                }
            };

            result = makeShareLinks(links, thumbUrl, title);
        });

        it('should leave the links as Objects', function() {
            expect(result).toEqual([
                { type: 'facebook', label: 'Share', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(links.facebook.uri)}`, tracking: links.facebook.tracking },
                { type: 'twitter', label: 'Tweet', href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(links.twitter.uri)}`, tracking: links.twitter.tracking },
                { type: 'pinterest', label: 'Pin it', href: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(links.pinterest.uri)}&media=${encodeURIComponent(thumbUrl)}&description=${encodeURIComponent(title)}`, tracking: links.pinterest.tracking }
            ]);
        });

        describe('if no thumbUrl is specified', function() {
            beforeEach(function() {
                thumbUrl = undefined;

                result = makeShareLinks(links, thumbUrl, title);
            });

            it('should remove the pinterest share link', function() {
                expect(result).toEqual([
                    { type: 'facebook', label: 'Share', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(links.facebook.uri)}`, tracking: links.facebook.tracking },
                    { type: 'twitter', label: 'Tweet', href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(links.twitter.uri)}`, tracking: links.twitter.tracking }
                ]);
            });
        });

        describe('if no title is specified', function() {
            beforeEach(function() {
                title = undefined;

                result = makeShareLinks(links, thumbUrl, title);
            });

            it('should leave the pinterest description blank', function() {
                expect(result).toEqual([
                    { type: 'facebook', label: 'Share', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(links.facebook.uri)}`, tracking: links.facebook.tracking },
                    { type: 'twitter', label: 'Tweet', href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(links.twitter.uri)}`, tracking: links.twitter.tracking },
                    { type: 'pinterest', label: 'Pin it', href: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(links.pinterest.uri)}&media=${encodeURIComponent(thumbUrl)}&description=`, tracking: links.pinterest.tracking }
                ]);
            });
        });
    });
});
