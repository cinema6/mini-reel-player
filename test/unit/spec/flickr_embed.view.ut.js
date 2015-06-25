import FlickrEmbedView from '../../../src/views/image_embeds/FlickrEmbedView.js';
import TemplateView from '../../../lib/core/TemplateView.js';

describe('FlickrEmbedView', function() {
    let view;

    beforeEach(function() {
        view = new FlickrEmbedView();
    });

    it('should be a TemplateView', function() {
        expect(view).toEqual(jasmine.any(TemplateView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of FlickrEmbedView.html', function() {
                expect(view.template).toBe(require('../../../src/views/image_embeds/FlickrEmbedView.html'));
            });
        });
    });

});
