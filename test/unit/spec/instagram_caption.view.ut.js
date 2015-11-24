import InstagramCaptionView from '../../../src/views/InstagramCaptionView.js';
import View from '../../../lib/core/View.js';
import Runner from '../../../lib/Runner.js';

describe('InstagramCaptionView', function() {
    let view;

    beforeAll(function(done) {
        process.nextTick(done);
    });

    beforeEach(function() {
        view = new InstagramCaptionView();
    });

    it('should be a TemplateView', function() {
        expect(view).toEqual(jasmine.any(View));
    });

    describe('properties', function() {
        describe('tag', function() {
            it('should be a span', function() {
                expect(view.tag).toBe('span');
            });
        });
    });

    describe('methods', function() {
        describe('update', function() {
            it('should insert a formatted caption', function() {
                const input = {
                    caption: '@yolo! ~ #swag! @user.name:#hash.tag'
                };
                const expectedOutput = '<a href="https://instagram.com/yolo/" target="_blank" class="instag____postInfo__tag">@yolo</a>! ~ ' +
                    '<a href="https://instagram.com/explore/tags/swag/" target="_blank" class="instag____postInfo__tag">#swag</a>! ' +
                    '<a href="https://instagram.com/user.name/" target="_blank" class="instag____postInfo__tag">@user.name</a>:' +
                    '<a href="https://instagram.com/explore/tags/hash/" target="_blank" class="instag____postInfo__tag">#hash</a>.tag';
                Runner.run(() => {
                    view.update(input);
                });
                const output = view.element.innerHTML;
                expect(output).toBe(expectedOutput);
            });

            it('should format valid usernames', function() {
                const input = [
                    '@Scott',
                    '@under_score',
                    '@period.',
                    '@Rand0m_1337'
                ];
                const expectedOutput = [
                    '<a href="https://instagram.com/Scott/" target="_blank" class="instag____postInfo__tag">@Scott</a>',
                    '<a href="https://instagram.com/under_score/" target="_blank" class="instag____postInfo__tag">@under_score</a>',
                    '<a href="https://instagram.com/period./" target="_blank" class="instag____postInfo__tag">@period.</a>',
                    '<a href="https://instagram.com/Rand0m_1337/" target="_blank" class="instag____postInfo__tag">@Rand0m_1337</a>'
                ];
                const output = input.map(input => {
                    Runner.run(() => {
                        view.update({
                            caption: input
                        });
                    });
                    return view.element.innerHTML;
                });
                expect(output).toEqual(expectedOutput);
            });

            it('should not format invalid usernames', function() {
                const input = [
                    '@!@#$%^*()',
                    '@',
                    '@ a a a a a',
                    '@-abc'
                ];
                const expectedOutput = [
                    '@!@#$%^*()',
                    '@',
                    '@ a a a a a',
                    '@-abc'
                ];
                const output = input.map(input => {
                    Runner.run(() => {
                        view.update({
                            caption: input
                        });
                    });
                    return view.element.innerHTML;
                });
                expect(output).toEqual(expectedOutput);
            });

            it('should format valid hashtags', function() {
                const input = [
                    '#hashtag',
                    '#octothrope',
                    '#H3llo_W0r1d',
                    '#2015'
                ];
                const expectedOutput = [
                    '<a href="https://instagram.com/explore/tags/hashtag/" target="_blank" class="instag____postInfo__tag">#hashtag</a>',
                    '<a href="https://instagram.com/explore/tags/octothrope/" target="_blank" class="instag____postInfo__tag">#octothrope</a>',
                    '<a href="https://instagram.com/explore/tags/H3llo_W0r1d/" target="_blank" class="instag____postInfo__tag">#H3llo_W0r1d</a>',
                    '<a href="https://instagram.com/explore/tags/2015/" target="_blank" class="instag____postInfo__tag">#2015</a>'
                ];
                const output = input.map(input => {
                    Runner.run(() => {
                        view.update({
                            caption: input
                        });
                    });
                    return view.element.innerHTML;
                });
                expect(output).toEqual(expectedOutput);
            });

            it('should not format invalid hashtags', function() {
                const input = [
                    '#!@#$%^*()',
                    '@',
                    '# a a a a a',
                    '#-abc',
                    '#.hashtag'
                ];
                const expectedOutput = [
                    '#!@#$%^*()',
                    '@',
                    '# a a a a a',
                    '#-abc',
                    '#.hashtag'
                ];
                const output = input.map(input => {
                    Runner.run(() => {
                        view.update({
                            caption: input
                        });
                    });
                    return view.element.innerHTML;
                });
                expect(output).toEqual(expectedOutput);
            });
        });
    });
});
