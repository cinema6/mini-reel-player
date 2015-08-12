import InstagramCaptionView from '../../../src/views/InstagramCaptionView.js';
import View from '../../../lib/core/View.js';
import Runner from '../../../lib/Runner.js';

describe('InstagramCaptionView', function() {
    let view;

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
                    caption: '@yolo ~ #swag'
                };
                const expectedOutput = '<a href="https://instagram.com/yolo/" target="_blank" class="instag____postInfo__tag">@yolo</a> ~ ' +
                    '<a href="https://instagram.com/explore/tags/swag/" target="_blank" class="instag____postInfo__tag">#swag</a>';
                Runner.run(() => {
                    view.update(input);
                });
                const output = view.element.innerHTML;
                expect(output).toBe(expectedOutput);
            });
        });
    });
});
