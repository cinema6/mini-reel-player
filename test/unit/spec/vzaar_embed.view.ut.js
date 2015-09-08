import VzaarEmbedView from '../../../src/views/video_embeds/VzaarEmbedView.js';
import TemplateView from '../../../lib/core/TemplateView.js';

describe('VzaarEmbedView', function() {
    let view;

    beforeEach(function() {
        view = new VzaarEmbedView();
    });

    it('should be a TemplateView', function() {
        expect(view).toEqual(jasmine.any(TemplateView));
    });

    describe('properties:', function() {
        describe('tag', function() {
            it('should be div', function() {
                expect(view.tag).toBe('div');
            });
        });

        describe('template', function() {
            it('should be the contents of VzaarEmbedView.html', function() {
                expect(view.template).toBe(require('../../../src/views/video_embeds/VzaarEmbedView.html'));
            });
        });
    });
});
